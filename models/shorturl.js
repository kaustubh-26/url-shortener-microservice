const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: String,
});

// # Set the collection name
// personSchema.set('collection', 'Person');

const UrlObject = mongoose.model('UrlObject', urlSchema);

module.exports = UrlObject;
