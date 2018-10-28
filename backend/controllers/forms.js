const Form = require('mongoose').model('Form');
const uuidv1 = require('uuid/v1');
const hummus = require('hummus');
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
        console.log(err)
        console.log('here');
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

module.exports.create = async (req, res, next) => {
  if (!req.params.id) {
    res.locals.error = {
      status: 400,
      msg: 'Photo id required'
    };
    return next();
  }
  const { id } = req.params;
  const { formValues } = req.body;
  try {
    const formView = await new Promise((resolve, reject) => {
      Form.findById(id).exec((err, formView) => {
        if (err)
          reject('Form not found');
        resolve(formView);
      });
    });
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition':'attachment; filename=submission.pdf'
    });
    const pdfWriter = hummus.createWriter(new hummus.PDFStreamForResponse(res));
    const width = 612;
    const height = 792; // 8.5 x 11
    const page = pdfWriter.createPage(0,0,width, height);
    const fontInfo = {
      font:pdfWriter.getFontForFile('./static/arial.ttf'),
      size:14,
      colorspace:'gray',
      color:0x00
    };

    const { fields, src } = formView;
    // TODO: convert fields to proper locations
    let chain = pdfWriter.startPageContentContext(page)
    .drawImage(0,0,`./public/uploaded/${src}`, {
        transformation: {width, height, fit: 'always', proportional: true} // assume 8.5 x 11
    });
    fields.foreach(f => {
      const { label, x, y, inputType } = f;
      if (inputType !== 'text') return;
      // x y transform here 
      chain = chain.writeText(
        label,
        x, y, fontInfo
      );
    });
    pdfWriter.writePage(page);
    pdfWriter.end();
    res.end();
  } catch (err) {
    console.log(err);
    res.locals.error = {
      status: 400,
      msg: 'Misc creation error'
    }
    return next();
  }
}