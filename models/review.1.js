var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Review = new Schema({
    // any: [Schema.Types.Mixed],
    cr_date: { type: Date, default: Date.now },
    lu_date: { type: Date, default: Date.now },
    title: String,
    subtitle: String,
    author: String,
    intro: String,
    conclusion: String,
    absinthe: {
        make: { type: String, default: "" },
        type: { type: String, default: "" },
        manufacturer: { type: String, default: "" },
        country: { type: String, default: "" },
        alcohol: { type: String, default: "" }
    },
    rating: {
        appearance: {
            sortorder: { type: Number , default: 0 },
            content: {  type: String, default: "" },
            score: {  type: Number, min: 0, max: 100, default: 0 }
        },
        louche: {
            sortorder: { type: Number , default: 1 },
            content: { type: String, default: "" },
            score: { type:  Number, min: 0, max: 100, default: 0 }
        },
        aroma: {
            sortorder: { type: Number , default: 2 },
            content: {  type: String, default: "" },
            score: {  type: Number, min: 0, max: 100, default: 0 }
        },
        flavor: {
            sortorder: { type: Number , default: 3 },
            content: {  type: String, default: "" },
            score: {  type: Number, min: 0, max: 100, default: 0 }
        },
        finish: {
            sortorder: { type: Number , default: 4 },
            content: {  type: String, default: "" },
            score: {  type: Number, min: 0, max: 100, default: 0 }
        },
        overall: {
            sortorder: { type: Number , default: 5 },
            content: {  type: String, default: "" },
            score: {  type: Number, min: 0, max: 100, default: 0 }
        }
    }
});


// retrieve my model
module.exports = mongoose.model('Review', Review);
