var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Rating = require('../models/rating').schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Review = new Schema({
    reviewId : ObjectId,
    cr_date: {type: Date, default: Date.now},
    lu_date: {type: Date, default: Date.now},
    title: String,
    subtitle: String,
    author: String,
    intro: String,
    conclusion: String,
    absinthe: {
        make: {String, default: ""},
        type: {String, default: ""},
        manufacturer: {String, default: ""},
        country: {String, default: ""},
        alcohol: {String, default: ""}
    },
    rating: [Rating]
});

// retrieve my model
module.exports = mongoose.model('Review', Review);
