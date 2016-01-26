var express = require('express')
var Review = require('../models/review')
var Rating = require('../models/rating')

var router = express.Router()

var VIEW_FOLDER = "reviewmanager"

var menu = [
    {
        link:'/reviews',
        iconClass: 'view_list',
        title: 'List'
    },
    {
        link: '/reviews/add',
        iconClass: 'add',
        title: 'Add'
    }
]


/************************************************************
 * VIEWS
 ************************************************************/

// List All Reviews
router.get('/', function(req, res) {
    Review.find({}).exec(function(err, data) {
        if (err) { handleError(req, res, err) }
        res.render(VIEW_FOLDER + '/reviewList', {
            title: 'Reviews',
            menuItems: menu,
            user: req.user,
            data: data
        })
    })
})

// Return selected Review
router.get('/edit', function(req, res) {
    Review.findById(req.query.id, function(err, data) {
        if (err) {
            console.error("ERROR IN FINDBYID: ", err)
        }
        if (!data) {
            data = new Review()
            var ratingTypes = ['Appearance', 'Louche', 'Aroma', 'Flavor', 'Finish', 'Overall']
            for (var i in ratingTypes) {
             data.ratings.push(new Rating({ sortorder: i, attribute: ratingTypes[i] }))
            }
        }
        res.render(VIEW_FOLDER + '/reviewAdd', {
            title: "Review Editor",
            menuItems: menu,
            user: req.user,
            data: data
        })
    })
})

// List All Reviews
router.get('/intro', function(req, res) {
    res.render(VIEW_FOLDER + '/intro', {
        title: 'Introduction',
        menuItems: menu,
        user: req.user
    })
})

router.get('/tasting', function(req, res) {
    res.render(VIEW_FOLDER + '/howToTasteAbsinthe', {
        title: 'How to taste absinthe',
        menuItems: menu,
        user: req.user
    })
})


/************************************************************
 * ACTIONS
 ************************************************************/

function buildResultSet(docs) {
    var result = [];
    for(var i in docs) {
        result.push(docs[i].absinthe.make);
    }
    return result;
}

router.get('/search_absinthe_makes', function(req, res) {
    var regex = new RegExp(req.query["term"], 'i')
    console.info("req.query", req.query)
    var query = Review.find({ "absinthe.make" : regex }, { "absinthe.make" : 1 }).sort({"absinthe.make" : -1}).limit(20)
    query.exec(function(err, makers) {
        if (!err) {
            var result = buildResultSet(makers);
            console.log("result: ", result)
            res.send(result, { 'Content-Type': 'application/json' }, 200);
        } else {
            res.send(JSON.stringify(err), { 'Content-Type': 'application/json' }, 404);
        }
    });
});
router.get('/absinthe_makes', function(req, res) {
    var query = Review.find({ }, { "absinthe.make" : 1 }).sort({"absinthe.make" : -1}).limit(500)
    query.exec(function(err, makers) {
        if (!err) {
            var result = buildResultSet(makers);
            console.log("result: ", result)
            res.send(result, { 'Content-Type': 'application/json' }, 200);
        } else {
            res.send(JSON.stringify(err), { 'Content-Type': 'application/json' }, 404);
        }
    });
});

router.post('/save', function(req, res) {
    Review.findOne({ '_id': req.body.id }, { }, function(err, data) {
        if (err)
            console.info('SAVE FINDONE ERROR: ' + err)
        else if (data)
           updateReview(req, res, data)
        else
           saveNewReview(req, res)
    })
})

function saveNewReview(req, res) {
    var data = new Review({
        title: req.body.title,
        subtitle: req.body.subtitle,
        intro: req.body.intro,
        conclusion: req.body.conclusion,
        absinthe: {
            make: req.body.absinthe.make,
            type: req.body.absinthe.type,
            manufacturer: req.body.absinthe.manufacturer,
            country: req.body.absinthe.country,
            alcohol: req.body.absinthe.alcohol
        },
        cr_date: Date.now,
        cr_user: req.user,
        lu_user: req.user
     })
    data.cr_date = Date.now()
    data.cr_user = req.user
    for (var i in req.body.ratings) {
        data.ratings.push(new Rating({
            sortorder: req.body.ratings[i].sortorder,
            attribute: req.body.ratings[i].attribute,
            content: req.body.ratings[i].content,
            score: req.body.ratings[i].score
        }))
    }
    data.save(function(err) {
        if (err) { handleError(req, res, err) }
        req.flash("success", 'Created')
        res.redirect('/reviews')
    })
}

/**
 * This is the best way to update a form.
 */
function updateReview(req, res, data) {
    for (var i in req.body.ratings) {
        console.table(req.body.ratings[i])
        Rating.findByIdAndUpdate(req.body.ratings[i].ratingId, {$set:req.body}, function(err) {
            if (err) console.error(err)
        })
    }
    data.update({$set:req.body}, function (err, data) {
        if (err)
            console.error('UPDATE ERROR: ' + err)
        req.flash("success", 'Updated')
        res.redirect('/reviews')
    })
}

router.get('/delete', function(req, res) {
    Review.findByIdAndRemove(req.query.id, function (err) {
        if (err) {
            console.error(err.message)
            req.flash("error", err.message)
        }
        req.flash("success", 'Deleted')
        res.redirect('/reviews')
    });
})

router.post('/deleteAll', function(req, res) {
    Review.remove({_id: {$in: req.body.reviewid}}, function (err) {
            if (err) {
                console.error(err.message)
                req.flash("error", err.message)
            }
        req.flash('success', 'Reviews successfully deleted!');
        res.redirect('back')
    });
})

function handleError(req, res, err) {
    console.error("ERROR: ", err)
}

module.exports = router
