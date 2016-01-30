var mongoose = require('mongoose')
var Schema = mongoose.Schema

var AbsintheSchema = new Schema({
    name: { type: String, default: "" },
    producer: { type: String, default: "" },
    _style: { type: Schema.Types.ObjectId, ref: 'AbsintheType' },
    country: { type: String, default: "" },
    alcohol: { type: String, default: "" },
    vintage: { type: Date, default: "" },
    cr_user: { type: Schema.Types.ObjectId, ref: 'Account' },
    cr_date: { type: Date },
    lu_user: { type: Schema.Types.ObjectId, ref: 'Account' },
    lu_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Absinthe', AbsintheSchema)
