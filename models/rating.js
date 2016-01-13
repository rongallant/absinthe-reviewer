var mongoose = require('mongoose');
var Schema = mongoose.Schema
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new Schema ({
    ratingId: ObjectId,
    identity: String,
    content: String,
    score: { type: Number, min: 0, max: 100 }
});

module.exports = mongoose.model('Rating', schema);