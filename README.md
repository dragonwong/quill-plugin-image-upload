# quill-plugin-image-upload

A plugin for uploading image in Quill 🌇

- 🌟 upload a image when it is inserted, and then replace the base64-url with a http-url
- 🌟 preview the image which is uploading with a loading animation
- 🌟 when the image is uploading, we can keep editing the content including changing the image's position or even delete the image.

![](https://user-images.githubusercontent.com/2622602/49206584-73c6b080-f3ed-11e8-8164-aad28508d4c4.gif)

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
