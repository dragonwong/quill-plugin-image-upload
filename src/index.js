require('./ImageUploadPlaceholder.js');
require('./style.js');
const imageIdManger = require('./imageIdManger');
const constant = require('./constant');

class ImageUpload {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    if (typeof (this.options.upload) !== "function")
      console.warn('[Missing config] upload function that returns a promise is required');

    var toolbar = this.quill.getModule("toolbar");
    toolbar.addHandler("image", this.selectLocalImage.bind(this));
  }

  selectLocalImage() {
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement("input");
    this.fileHolder.setAttribute("type", "file");
    this.fileHolder.setAttribute('accept', 'image/*');
    this.fileHolder.onchange = this.fileChanged.bind(this);
    this.fileHolder.click();
  }

  fileChanged() {
    const file = this.fileHolder.files[0];
    const imageId = imageIdManger.generate();

    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      let base64ImageSrc = fileReader.result;
      this.insertBase64Image(base64ImageSrc, imageId);
    }, false);
    if (file) {
      fileReader.readAsDataURL(file);
    }

    this.options.upload(file)
      .then((imageUrl) => {
          this.insertToEditor(imageUrl, imageId);
        },
        (error) => {
          console.warn(error.message);
        }
      )
  }

  insertBase64Image(url, imageId) {
    const range = this.range;
    this.quill.insertEmbed(range.index, "imageUpload", `${imageId}${constant.ID_SPLIT_FLAG}${url}`);
  }

  insertToEditor(url, imageId) {
    const imageElement = document.getElementById(imageId);
    if (imageElement) {
      imageElement.setAttribute('src', url);
      imageElement.removeAttribute('id');
      imageElement.classList.remove(constant.IMAGE_UPLOAD_PLACEHOLDER_CLASS_NAME);
    }
  }
}

module.exports = ImageUpload;
