var mongoose = require('mongoose');
var Schema = mongoose.Schema

var RatingSchema = new Schema ({
    ratingId: { type: Schema.Types.ObjectId },
    sortorder: { type: Number },
    attribute: { type: String },
    content: { type: String },
    score: { type: Number, min: 0, max: 100, default: 0 }
},
{
    strict: true
});

module.exports = mongoose.model('Rating', RatingSchema);