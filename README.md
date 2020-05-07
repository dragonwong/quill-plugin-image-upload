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
        preProcessClick: (callback) => {callback()},  // callback on image button click
        preProcessInput: (input, callback) => {callback(input)},  // callback on image button click
        uploadUrl: '', // server url. If the url is empty then the base64 returns
        downloadUrl: '', // image get url.
        method: 'PUT', // change query method, default 'PUT'
        withCredentials: false, // withCredentials
        headers: {'Content-Type': 'image/png'}, // add custom headers, example { token: 'your-token'}
        customUploader: (file, successCallback, failureCallback) => {}, // add custom uploader
        // personalize successful callback and call next function to insert new url to the editor
        callbackOK: (serverResponse, downloadUrl, next) => {
            next(serverResponse);
        },
        // personalize failed callback
        callbackKO: serverError => {
            alert(serverError);
        },
        // optional
        // add callback when a image have been chosen
        checkBeforeSend: (file, next, failureCallback) => {
            console.log(file);
            next(file); // go back to component and send to the server
        },
        invalidFileHandler: '', // handler callback for invalid file selection
        loaderFilePath: '', // image file path to show in loader
        generateFileUrls: (file, successCb, failureCb) => {return {uploadUrl: '', downloadUrl: ''}}, // generate upload
                                                                                                    // and download urls
        returnXhr: (xhr) => {}, // to get the xhr request
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
