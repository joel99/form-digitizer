const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  inputType: { // could also be 'info' if it's a paragraph/non-input
    type: String,
    default: "text"
  },
  constraint: {
    type: String,
    required: false // ready for brittle code?
  }
});

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    index: false,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  fields: {
    type: [fieldSchema],
    required: true 
  },
  src: {
    type: String,
    required: true
  }
}, { usePushEach: true });

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
