var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Absinthe = require('../models/absinthe')
var RatingSchema = require('./rating').schema

var ReviewSchema = new Schema({
    title: { type: String },
    subtitle: { type: String },
    intro: { type: String },
    conclusion: { type: String },
    _absinthe: { type: Schema.Types.ObjectId, ref: 'Absinthe' },
    _ratings: [ RatingSchema ],
    cr_user: { type: Schema.Types.ObjectId, ref: 'Account' },
    cr_date: { type: Date },
    lu_user: { type: Schema.Types.ObjectId, ref: 'Account' },
    lu_date: { type: Date, default: Date.now }
},
{
    strict: true
})

ReviewSchema.pre('save', function(done) {
  this.lu_date = new Date();
  done();
});

module.exports = mongoose.model('Review', ReviewSchema)
