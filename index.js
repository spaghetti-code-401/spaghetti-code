'use strict';
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI
// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
};
mongoose.connect(MONGODB_URI, options);

// Start the web server
require('./src/server.js').startup(process.env.PORT);

