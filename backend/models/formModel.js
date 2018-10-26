const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  name: {
    type: String,
    index: false,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  }
}, { usePushEach: true });

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
