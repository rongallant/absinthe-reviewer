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
            attribute: { type: String, default: "appearance" },
            content: {  type: String, default: "" },
            score: {  type: Number, min: 0, max: 100, default: 0 }
        },
        louche: {
            sortorder: { type: Number , default: 1 },
            attribute: { type: String, default: "louche" },
            content: { type: String, default: "" },
            score: { type:  Number, min: 0, max: 100, default: 0 }
        },
        aroma: {
            sortorder: { type: Number , default: 2 },
            attribute: { type: String, default: "aroma" },
            content: {  type: String, default: "" },
            score: {  type: Number, min: 0, max: 100, default: 0 }
        },
        flavor: {
            sortorder: { type: Number , default: 3 },
            attribute: { type: String, default: "flavor" },
            content: {  type: String, default: "" },
            score: {  type: Number, min: 0, max: 100, default: 0 }
        },
        finish: {
            sortorder: { type: Number , default: 4 },
            attribute: { type: String, default: "finish" },
            content: {  type: String, default: "" },
            score: {  type: Number, min: 0, max: 100, default: 0 }
        },
        overall: {
            sortorder: { type: Number , default: 5 },
            attribute: { type: String, default: "overall" },
            content: {  type: String, default: "" },
            score: {  type: Number, min: 0, max: 100, default: 0 }
        }
    }
});

// retrieve my model
module.exports = mongoose.model('Review', Review);
