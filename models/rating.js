var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Rating = new Schema ({
     appearance_rating:{ type: Number, min: 0, max: 100 },
    appearance: String,
    louche_rating:{ type: Number, min: 0, max: 100 },
    louche: String,
    aroma_rating:{ type: Number, min: 0, max: 100 },
    aroma: String,
    flavor_rating:{ type: Number, min: 0, max: 100 },
    flavor: String,
    finish_rating:{ type: Number, min: 0, max: 100 },
    finish: String,
    overall_rating:{ type: Number, min: 0, max: 100 },
    overall: String
});

module.exports = mongoose.model('Rating', Rating);