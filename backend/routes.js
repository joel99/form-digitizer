"use strict";

const express = require('express');
const router = express.Router();
const controllers = require('./controllers/');

const multer = require('multer');

const formStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploaded/');
  },
  // renaming is done here
  filename: function(req, file, cb) {
    const parts = file.mimetype.split('/');
    const ext = parts[parts.length - 1];
    // todo filtering here or above idk
    cb(null, `random.${ext}`);
  }
});

const formImageUpload = multer({storage: formStorage});

router.post('/process_photo', formImageUpload.single('form_image'), controllers.forms.process);
router.post('/get_form/:id', controllers.forms.getForm);
router.post('/create_submission', controllers.forms.create);

// Package and finish
router.use((req, res, next) => {
  if (res.locals.data) {
    let response = Object.assign({}, res.locals.data, {
      'status': 'ok'
    });
    return res.status(200).json(response);
  } else if (res.locals.error) { // Any errors thrown are be handled below, but because we're bad not all errors are thrown >:(
    let statusCode = res.locals.error.code || 500;
    let response = Object.assign({}, res.locals.error, {
      'status': 'error'
    });
    return res.status(statusCode).json(response);
  } else {
    console.log('generic server error');
    return res.status(500).json({
      'status': 'error',
      'code': 500,
      'msg': 'Internal Server Error'
    });
  }
});

// Error Handle
router.use((err, req, res, next) => {
  if (res.locals.error) {
    // Map msg to message because honestly what even
    res.locals.error.message = res.locals.error.msg
    let statusCode = res.locals.error.code || 500;
    let response = Object.assign({}, res.locals.error, {
      'status': 'error'
    });
    console.log(response);
    return res.status(statusCode).json(response);
  } else {
    console.log('generic server error');
    return res.status(500).json({
      'status': 'error',
      'code': 500,
      'msg': 'Internal Server Error'
    });
  }
});

module.exports = router;
