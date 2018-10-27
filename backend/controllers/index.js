"use strict";
// const Tesseract = require('tesseract.js');
const path = require('path');

// module.exports.tesseract = Tesseract.create({
//     workerPath: path.join(__dirname, 'tesseract.js/src/node/worker.js'),
//     langPath: path.join(__dirname, ''),
//     corePath: path.join(__dirname, 'tesseract.js/src/index.js')
//   })
  
module.exports.forms = require('./forms');
