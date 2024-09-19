// config.js
const path = require('path');

module.exports = {
  API_URL:
    'https://script.google.com/macros/s/AKfycbxNu27V2Y2LuKUIQMK8lX1y0joB6YmG6hUwB1fNeVbgzEh22TcDGrOak03Fk3uBHmz-/exec',
  ROUTES: {
    DEVICE_LIST: '?route=device-list',
  },
  DIRECTORIES: {
    DATA: path.join(__dirname, 'new'),
    IMAGES: path.join(__dirname, 'new', 'images'),
  },
  FILES: {
    DEVICES_JSON: path.join(__dirname, 'new', 'devices.json'),
  },
};
