var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

var Email = new Schema({
    value: { String }, // The actual email address.
    type: { String } // The type of email address (home, work, etc.).
})

module.exports = mongoose.model('Email', Email)