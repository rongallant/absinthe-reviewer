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
    ratings: [{
        sortorder: { type: Number },
        attribute: { type: String },
        content: { type: String},
        score: { type: Number, min: 0, max: 100, default: 0 }
    }]
})

// retrieve my model
module.exports = mongoose.model('Review', Review)

