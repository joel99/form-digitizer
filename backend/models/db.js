const mongoose = require('mongoose');
require('./formModel');

const mongoDB = 'mongodb://127.0.0.1/form_digitizer_db';
mongoose.connect(mongoDB, {
  useMongoClient: true
});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = db;
