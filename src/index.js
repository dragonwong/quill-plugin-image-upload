require('./ImageUploadPlaceholder.js');
require('./style.js');
const imageIdManger = require('./imageIdManger');
const constant = require('./constant');

class ImageUpload {

  /**
   * Instantiate the module given a quill instance and any options
   * @param {Quill} quill
   * @param {Object} options
   */
  constructor(quill, options = {}) {
    // save the quill reference
    this.quill = quill;
    // save options
    this.options = options;
    this.range = null;
    this.imageId = null;
    if (options.image) {
      // listen for drop and paste events
      this.quill
        .getModule('toolbar')
        .addHandler('image', this.selectLocalImage.bind(this));
    }
  }

  /**
   * Select local image
   */
  selectLocalImage() {
    const preProcessClickHandler = this.options.preProcessClick || this.preProcessClick;
    preProcessClickHandler(this.processButtonClick.bind(this));
  }

  preProcessClick(callback) {
    callback();
  }

  processButtonClick() {
    if (!this.fileHolder) {
      this.fileHolder = document.createElement("input");
      this.fileHolder.setAttribute("type", "file");
      this.fileHolder.onchange = this.fileChanged.bind(this);
    }
    this.fileHolder.click();
  }

  fileChanged () {
    const preProcessInputHandler = this.options.preProcessInput || this.preProcessInput;
    preProcessInputHandler(this.fileHolder, this.handleFileInput.bind(this));
  };

  preProcessInput(input, callback) {
    callback(input);
  }

  handleFileInput(input) {
    const file = input.files[0];
    input.value = '';

    // file type is only image.
    if (/^image\//.test(file.type)) {
      const checkBeforeSend =
        this.options.checkBeforeSend || this.checkBeforeSend.bind(this);
      this.showLoader(file, () => checkBeforeSend(file, this.sendToServer.bind(this), this.removeLoader.bind(this)));
    } else {
      if (this.options.invalidFileHandler) {
        this.options.invalidFileHandler();
      }
    }
  }

  showLoader(file, callback) {
    this.range = this.quill.getSelection();
    this.imageId = imageIdManger.generate();
    if (this.options.loaderFilePath) {
      this.insertBase64Image(this.options.loaderFilePath);
      callback();
    } else {
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        let base64ImageSrc = fileReader.result;
        this.insertBase64Image(base64ImageSrc);
        callback();
      }, false);
      if (file) {
        fileReader.readAsDataURL(file);
      }
    }
  }

  removeLoader() {
    const imageElement = document.getElementById(this.imageId);
    if (imageElement) {
      imageElement.remove();
    }
  }

  /**
   * Check file before sending to the server
   * @param {File} file
   * @param {Function} next
   */
  checkBeforeSend(file, next, failureCb) {
    next(file);
  }

  /**
   * Generates request url for sending to the server
   * @param {File} file
   * @param {Function} next
   */
  generateFileUrls(file, successCb, failureCb) {
    return successCb({
      uploadUrl: this.options.uploadUrl,
      downloadUrl: this.options.downloadUrl
    });
  }


  /**
   * Send to server
   * @param {File} file
   */
  sendToServer(file) {
    // Handle custom upload
    if (this.options.customUploader) {
      this.options.customUploader(file, dataUrl => {
        this.insert(dataUrl);
      }, this.removeLoader.bind(this));
    } else {
      const generateFileUploadDownloadUrls = this.options.generateFileUrls || this.generateFileUrls.bind(this);
      const method = this.options.method || 'PUT'
      const headers = this.options.headers || {'Content-Type': file.type}
      const callbackOK = this.options.callbackOK || this.uploadImageCallbackOK.bind(this)
      const callbackKO = this.options.callbackKO || this.uploadImageCallbackKO.bind(this);
      generateFileUploadDownloadUrls(file, (urls) => {
        const uploadUrl = urls.uploadUrl, downloadUrl = urls.downloadUrl;

        if (uploadUrl) {

          const xhr = new XMLHttpRequest();
          // init http query
          xhr.open(method, uploadUrl, true);
          // add custom headers
          for (var index in headers) {
            if (headers.hasOwnProperty(index)) {
              xhr.setRequestHeader(index, headers[index]);
            }
          }

          // listen callback
          xhr.onload = () => {
            if (xhr.status === 200) {
              callbackOK(xhr.responseText, downloadUrl, this.insert.bind(this));
            } else {

              this.removeLoader();
              callbackKO({
                code: xhr.status,
                type: xhr.statusText,
                body: xhr.responseText
              });
            }
          };

          if (this.options.withCredentials) {
            xhr.withCredentials = true;
          }


          xhr.send(file);
          if (this.options.returnXhr) {
            this.options.returnXhr(xhr);
          }
        } else {
          const reader = new FileReader();

          reader.onload = event => {
            callbackOK(event.target.result, null, this.insert.bind(this));
          };

          reader.readAsDataURL(file);
        }
      }, this.removeLoader.bind(this));
    }
  }

  insertBase64Image(url) {
    let index;
    if (this.range) {
      index = this.range.index;
    } else {
      index = this.quill.getLength() - 1;
    }
    this.quill.insertEmbed(index, "imageUpload", `${this.imageId}${constant.ID_SPLIT_FLAG}${url}`, 'user');
  }

  /**
   * Insert the image into the document at the current cursor position
   * @param {String} dataUrl  The base64-encoded image URI
   */
  insert(dataUrl) {
    const imageElement = document.getElementById(this.imageId);
    if (imageElement) {
      imageElement.setAttribute('src', dataUrl);
      imageElement.removeAttribute('id');
      imageElement.classList.remove(constant.IMAGE_UPLOAD_PLACEHOLDER_CLASS_NAME);
    }
  }

  /**
   * callback on image upload succesfull
   * @param {Any} response http response
   */
  uploadImageCallbackOK(response, downloadUrl, next) {
    if (downloadUrl) {
      next(downloadUrl);
    } else {
      next(response);
    }
  }

  /**
   * callback on image upload failed
   * @param {Any} error http error
   */
  uploadImageCallbackKO(error) {
    this.removeLoader();
    alert(error);
  }
}

module.exports = {
  ImageUpload: ImageUpload
};
