var express = require('express')

var Review = require('../models/review')
var Rating = require('../models/rating')

var router = express.Router()

var VIEW_FOLDER = "reviewmanager"

var menu = [
    {
        link:'/review',
        iconClass: 'list layout',
        title: 'List Reviews'
    },
    {
        link: '/review/add',
        iconClass: 'plus',
        title: 'New Review'
    }
]

/************************************************************
 * VIEWS
 ************************************************************/

router.get('/', function(req, res) {
    Review.find({}).exec(function(err, data) {
        if (err) { handleError(req, res, err) }
        res.render(VIEW_FOLDER + '/reviewList', {
            title: 'List All',
            menuItems: menu,
            user: req.user,
            data: data
        })
    })
})

router.get('/view', function(req, res) {
    Review.findById(req.query.id, function(err, data) {
        if (err) { handleError(req, res, err) }

        console.info("\nResult = \n", data)

        res.render(VIEW_FOLDER + '/reviewAdd', {
            title: "View",
            menuItems: menu,
            user: req.user,
            data: data
        })
    })
})

router.get('/add', function(req, res) {
    var newReview = new Review
    var ratingTypes = ['appearance', 'louche', 'aroma', 'flavor', 'finish']
    for (var i in ratingTypes) {
        console.info({ sortorder: i, attribute: ratingTypes[i] })
        newReview.ratings.push(new Rating({ sortorder: i, attribute: ratingTypes[i] }))
    }
    var user = req.user
    res.render(VIEW_FOLDER + '/reviewAdd', {
        title: "Add",
        menuItems: menu,
        user: user,
        data: newReview
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

router.post('/save', function(req, res, err) {
    if (err)
        console.info('SAVE ERROR: ' + err)
    Review.findOne({ '_id': req.body.id }, { }, function(err, data) {
        if (err)
            console.info('SAVE FINDONE ERROR: ' + err)
        else if (data)
           updateReview(req, res, data)
        else
           saveReview(req, res, data)
    })
})

function saveReview(req, res) {
    console.info("\nreq.body \n", req.body)
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
        // author: req.session.passport.user,
        cr_date: Date.now,
        cr_user: req.user
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
        res.redirect('/review')
    })
}

/**
 * This is the best wat to update a form.
 */
function updateReview(req, res, data) {
    for (var i in req.body.ratings) {
        Rating.findByIdAndUpdate(req.body.ratings[i].ratingId, {$set:req.body}, function(err) {
            if (err) console.error(err)
            console.info("Added new rating")
        })
    }
    data.update({$set:req.body}, function (err, data) {
        if (err)
            console.error('UPDATE ERROR: ' + err)
        req.flash("success", data.title + ' has been updated successfully!')
        res.redirect('/review')
    })
}

router.get('/delete', function(req, res) {
    if (req && req.query && req.query.review) {
        Review.findByIdAndRemove(req.query.review, function (err) {
            if (err) {
                console.error(err.message)
                req.flash("error", err.message)
            }
            req.flash("success", 'Deleted successfully!')
            res.redirect('/review')
        });
    } else {
        req.flash('Could not delete!')
    }
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
