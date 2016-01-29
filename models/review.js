var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Rating = require('./rating').schema

// var ratingTypes = ['Appearance', 'Louche', 'Aroma', 'Flavor', 'Finish', 'Overall']

var ReviewSchema = new Schema({
    title: { type: String },
    subtitle: { type: String },
    intro: { type: String },
    conclusion: { type: String },
    _absinthe: { type: Schema.Types.ObjectId, ref: 'Absinthe' },
    _ratings: [ Rating ],
    cr_user: { type: Schema.Types.ObjectId, ref: 'Account' },
    cr_date: { type: Date },
    lu_user: { type: Schema.Types.ObjectId, ref: 'Account' },
    lu_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Review', ReviewSchema)