var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * Styles of Absinthe
 *
 * http://www.liquorista.com/types-of-absinthe/
 * http://wormwoodsociety.org/index.php/absinthe-glossary-education-232
 */
var AbsintheTypeSchema = new Schema({
    name: { type: String, default: '' },
    meaning: { type: String, default: '' },
    description: { type: String, default: '' },
    source: { type: String, default: '' }
});

module.exports = mongoose.model('AbsintheType', AbsintheTypeSchema)