var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Absinthe = require('../models/absinthe');
var Rating = require('../models/rating');

var Review = new Schema({
    cr_date: {type: Date, default: Date.now},
    lu_date: {type: Date, default: Date.now},
    title: String,
    subtitle: String,
    author: String,
    absinthe: {
        type: { Absinthe },
        default: { Absinthe }
        
    },
    intro: String,
    conclusion: String,
    rating: {
        type: {Rating},
        default: {Rating}
        
    }
});

module.exports = mongoose.model('Review', Review);
