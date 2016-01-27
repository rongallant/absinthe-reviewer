var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/**
 * Styles of Absinthe
 *
 * http://www.liquorista.com/types-of-absinthe/
 * http://wormwoodsociety.org/index.php/absinthe-glossary-education-232
 */
var AbsintheType = new Schema({
    name: String,
    meaning: String,
    description: String,
    source: String
});

mongoose.model('AbsintheType', AbsintheType)

AbsintheType.methods.defaults = function getDefaultTypes () {
    return this.model('AbsintheType', function(){ new AbsintheType([
        {
            name: 'Blanche, or la Bleue',
            meaning: 'White',
            description : ' Blanche absinthe (also referred to as la Bleue in Switzerland) is bottled directly following distillation and reduction, and is uncoloured (clear). The name la Bleue was originally a term used for bootleg Swiss absinthe, but has become a popular term for post-ban-style Swiss absinthe in general.',
            source: 'Wikipedia (wikipedia.org)'
        },
        {
            name: 'Verte',
            meaning: '"green" in French',
            description : 'absinthe begins as a blanche. The blanche is altered by the colouring step, by which a separate mixture of herbs is steeped into the clear distillate. This confers a peridot green hue and an intense flavour. Vertes represent the prevailing type of absinthe that was found in the 19th century. Artificially coloured green absinthes may also claimed to be verte, though they lack the characteristic herbal flavours that result from the colouring process.',
            source: 'Wikipedia (wikipedia.org)'
        },
        {
            name: 'Absenta',
            meaning: '"absinthe" in Spanish',
            description: 'Is sometimes associated with a regional style that often differed slightly from its French cousin. Traditional absentas may taste slightly different due to their use of Alicante anise, and often exhibit a characteristic citrus flavour.',
            source: 'Wikipedia (wikipedia.org)'
        },
        {
            name: 'Hausgemacht',
            meaning: 'German for home-made, often abbreviated as HG',
            description: 'refers to clandestine absinthe (not be confused with the Swiss La Clandestine brand) that is home-distilled by hobbyists. It should not be confused with absinthe kits. Hausgemacht absinthe is produced in tiny quantities for personal use and not for the commercial market. Clandestine production increased after absinthe was banned, when small producers went underground, most notably in Switzerland. Although the ban has been lifted in Switzerland, some clandestine distillers have not legitimised their production. Authorities believe that high taxes on alcohol and the mystique of being underground are likely reasons.',
            source: 'Wikipedia (wikipedia.org)'
        },
        {
            name: 'Bohemian-Style',
            meaning: '',
            description: 'is also referred to as Czech-style absinthe, anise-free absinthe, or just "absinth" (without the "e"), and is best described as a wormwood bitters. It is produced mainly in the Czech Republic, from which it gets its designation as Bohemian or Czech, although not all absinthes from the Czech Republic are Bohemian-style. Bohemian-style absinth typically contains little or none of the anise, fennel, and other herbal flavours associated with traditional absinthe, and thus bears very little resemblance to the absinthes made popular in the 19th century. Typical Bohemian-style absinth has only two similarities with its authentic, traditional counterpart: it contains wormwood and has a high alcohol content. The Czechs are credited with inventing the fire ritual in the 1990s, possibly because Czech absinth does not louche, which renders the traditional French preparation method useless. As such, this type of absinthe and the fire ritual associated with it are entirely modern fabrications, and have little to no relationship with the historical absinthe tradition.',
            source: 'Wikipedia (wikipedia.org)'
        },
        {
            name: 'Fougerolles',
            meaning: 'City in France',
            description: 'City in France; also a style of absinthe.',
            source: 'The Wormwood Society (wormwoodsociety.org)'
        },
        {
            name: 'Lyon / Lyons / Lyonaise',
            meaning: 'A city in east-central France',
            description: 'A city in east-central France. Of, or coming from, Lyons. Also style of absinthe.',
            source: 'The Wormwood Society (wormwoodsociety.org)'
        },
        {
            name: 'Suisse',
            meaning: 'French for "Swiss."',
            description: 'Also a style of absinthe, produced by the "suisse" method, often un-colored.',
            source: 'The Wormwood Society (wormwoodsociety.org)'
        },
        {
            name: 'Montpellier',
            meaning: 'A city of southern France',
            description: 'A city of southern France near the Mediterranean. Also a style of absinthe.',
            source: 'The Wormwood Society (wormwoodsociety.org)'
        },
        {
            name: 'Nimes',
            meaning: 'A city of southern France',
            description: 'A city of southern France northeast of Montpellier. Also a style of absinthe.',
            source: 'The Wormwood Society (wormwoodsociety.org)'
        },
        {
            name: 'Pontarlier',
            meaning: 'A frontier town of eastern France',
            description: 'A frontier town of eastern France whose chief industry is the distillation of herbal liqueurs and was the center of absinthe production from 1805 through 1915. Also a style of absinthe; considered by many to be the definitive style, containing only six ingredients: grand wormwood, anise, fennel, petite wormwood, hyssop and melissa.',
            source: 'The Wormwood Society (wormwoodsociety.org)'
        }
    ])})
}