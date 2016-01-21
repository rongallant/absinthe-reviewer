var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Rating = require('./rating').schema

var Review = new Schema({
    title: String,
    subtitle: String,
    author: String,
    intro: String,
    conclusion: String,
    absinthe: {
        id: { type: Schema.Types.ObjectId },
        make: { type: String, default: "" },
        type: { type: String, default: "" },
        manufacturer: { type: String, default: "" },
        country: { type: String, default: "" },
        alcohol: { type: String, default: "" }
    },
    ratings: [ Rating ],
    cr_user: { type: Schema.Types.ObjectId, ref: 'User' },
    cr_date: { type: Date },
    lu_user: { type: Schema.Types.ObjectId, ref: 'User' },
    lu_date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Review', Review)
