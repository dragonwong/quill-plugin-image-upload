const Quill = require('quill');
const constant = require('./constant');

const Image = Quill.import('formats/image');

class ImageUploadPlaceholder extends Image {
  static create(value) {
    let id;
    let src;

    const arr = value.split(constant.ID_SPLIT_FLAG);
    if (arr.length > 1) {
      id = arr[0];
      src = arr[1];
    } else {
      src = value;
    }

    let node = super.create(src);
    if (typeof src === 'string') {
      node.setAttribute('src', this.sanitize(src));
    }

    if (id) {
      node.setAttribute('id', id);
    }
    return node;
  }
}

ImageUploadPlaceholder.blotName = 'imageUpload';
ImageUploadPlaceholder.className = constant.IMAGE_UPLOAD_PLACEHOLDER_CLASS_NAME;

Quill.register({
  'formats/imageUploadPlaceholder': ImageUploadPlaceholder
});
