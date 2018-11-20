const constant = require('./constant');

const ANIMATION_NAME = 'quill-plugin-image-upload-spinner';

const styleElement = document.createElement('style');
styleElement.type = 'text/css';
document.getElementsByTagName('head')[0].appendChild(styleElement);

styleElement.appendChild(document.createTextNode(`
  .${constant.IMAGE_UPLOAD_PLACEHOLDER_CLASS_NAME} {
    display: inline-block;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid #ccc;
    border-top-color: #1e986c;
    animation: ${ANIMATION_NAME} 0.6s linear infinite;
  }
  @keyframes ${ANIMATION_NAME} {
    to {
      transform: rotate(360deg);
    }
  }
`));
