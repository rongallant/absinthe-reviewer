var express = require('express')

var router = express.Router()

var VIEW_FOLDER = "information"

/************************************************************
 * VIEWS
 ************************************************************/

router.get('/', function (req, res) {
    res.render(VIEW_FOLDER + '/intro', {
        title: 'Introduction',
        // menuItems: menu,
        user: req.user
    })
})

// List All Reviews
router.get('/intro', function(req, res) {
    res.render(VIEW_FOLDER + '/intro', {
        title: 'Introduction',
        // menuItems: menu,
        user: req.user
    })
})

router.get('/preparing', function(req, res) {
    res.render(VIEW_FOLDER + '/howToPrepareAbsinthe', {
        title: 'How to Prepare Absinthe',
        // menuItems: menu,
        user: req.user
    })
})

/**
 * Styles of Absinthe
 *
 * http://www.liquorista.com/types-of-absinthe/
 * http://wormwoodsociety.org/index.php/absinthe-glossary-education-232
 */
router.get('/tasting', function(req, res) {
    res.render(VIEW_FOLDER + '/howToTasteAbsinthe', {
        title: 'How to Taste Absinthe',
        // menuItems: menu,
        user: req.user
    })
})

module.exports = router
