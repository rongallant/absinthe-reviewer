var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Email = require('./email').schema

var passportLocalMongoose = require('passport-local-mongoose')


var Account = new Schema({
    username: { type: String },
    password: { type: String },
    provider: { type: String }, // The provider with which the user authenticated (facebook, twitter, etc.).
    displayName: { type: String }, // The name of this user, suitable for display.
    name: {
        familyName: { type: String }, // The family name of this user, or "last name" in most Western languages.
        givenName: { type: String }, // The given name of this user, or "first name" in most Western languages.
        middleName: { type: String } // The middle name of this user.
    },
    emails: [ Email ],
    photos: [
        { value: { type: String } } // The URL of the image.
    ]
})

Account.plugin(passportLocalMongoose)

module.exports = mongoose.model('Account', Account)
