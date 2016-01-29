var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Absinthe
 */
var AbsintheSchema = new Schema({
    name: { type: String, default: "" },
    producer: { type: String, default: "" },
    _style: { type: Schema.Types.ObjectId, ref: 'AbsintheType' },
    country: { type: String, default: "" },
    alcohol: { type: String, default: "" },
    vintage: { type: Date, default: "" }
});

module.exports = mongoose.model('Absinthe', AbsintheSchema)