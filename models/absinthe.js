var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Absinthe = new Schema({
        name: String,
        type: String,
        manufacturer: String,
        country: String,
        alcohol: Number
});

module.exports = mongoose.model('Absinthe', Absinthe);