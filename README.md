# quill-plugin-image-upload

A plugin for uploading image in Quill 🌇

- 🌟 preview uploading image
- 🌟 hook for uploading image to get its url

## Install

```bash
npm install quill-plugin-image-upload --save
```

## Start

```js
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import imageUpload from 'quill-plugin-image-upload';

// register quill-plugin-image-upload
Quill.register('modules/imageUpload', imageUpload);

new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [
     'image'
    ],
    imageUpload: {
      upload: file => {
        // return a Promise that resolves in a link to the uploaded image
        return new Promise((resolve, reject) => {
          ajax().then(data => resolve(data.imageUrl));
        });
      }
    },
  },
});
```

## Demo

```bash
cd demo
npm install
npm start
```
