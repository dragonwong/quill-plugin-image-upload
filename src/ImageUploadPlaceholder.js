import Quill from 'quill';
const Image = Quill.import('formats/image');

import constant from './constant';

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
ImageUploadPlaceholder.className = 'image-upload';

Quill.register({
  'formats/imageUploadPlaceholder': ImageUploadPlaceholder
});
