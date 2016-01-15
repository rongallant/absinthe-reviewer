var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: String,
    password: String,
    fullName: String,
    email: String
});

// Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);