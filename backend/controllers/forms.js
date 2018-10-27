const Form = require('mongoose').model('Form');
const uuidv1 = require('uuid/v1');

const fieldExtractor = require('./fieldExtractor');

module.exports.index = (req, res, next) => {
  return next();
}

// Todo - investigate error throwing
// Todo make complete (investigate db setup)
// Todo - single cleansing utility for things you'd want from formview (for both create and get)
module.exports.process = async (req, res, next) => {
  if (!req.file) {
    res.locals.error = {
      status: 400,
      msg: 'Photo required'
    };
    return next();
  }
  try {
    const src = req.file.filename;

    const formName = req.body.formName ? req.body.formName : src.split('.')[0]; // uuid name, not mongoose id
    const fields = await fieldExtractor.extractInfo(src);
    if (fields.error) {
      res.locals.error = {
        status: 400,
        msg: fields.error
      };
      return next();
    }
    console.log(fields);
    const formViewInfo = await { src, name: formName, fields };
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
  } catch (err) {
    console.log(err);
  }
  
};
  
module.exports.getForm = (req, res, next) => {
  if (!req.params.id) {
    res.locals.error = {
      status: 400,
      msg: 'Photo id required'
    };
    return next();
  }
  const { id } = req.params;
  Form.findById(id).exec((err, formView) => {
    if (err) {
      res.locals.error = {
        status: 400,
        msg: "Form not found"
      }
      return next();
    } else {
        res.locals.data = {
          formData: formView, // it's getting brittler...
        };
        return next();  
    }
  });
}

module.exports.create = (req, res, next) => {
  return next();
}