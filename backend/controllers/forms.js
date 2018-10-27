const Form = require('mongoose').model('Form');
const async = require('async');
const uuidv1 = require('uuid/v1');
const fieldExtractor = require('./fieldExtractor');

module.exports.index = (req, res, next) => {
  return next();
}

// Todo - investigate error throwing
// Todo make complete (investigate db setup)
module.exports.process = (req, res, next) => {
  if (!req.file) {
    res.locals.error = {
      status: 400,
      msg: 'Photo required'
    };
    return next();
  }
  const formName = req.body.formName ? req.body.formName : uuidv1();
  const src = req.file.filename;
  const fields = fieldExtractor.extractInfo(req.file); // or pass src?
  
  const formViewInfo = { src, name: formName, fields };
  // not too worried about overloading the system for the demo
  Form.create(formViewInfo, (err, formView) => {
    if (err) {
      res.locals.error = {
        status: 400,
        msg: "Database Form creation error"
      }
      return next();
    } else {
      res.locals.data = {
        formData: formView // it's getting brittler...
      };
      return next();
    }
  });
}

module.exports.create = (req, res, next) => {
  return next();
}