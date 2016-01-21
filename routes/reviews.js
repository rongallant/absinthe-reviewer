var express = require('express')
var passport = require('passport')
var mongoose = require('mongoose')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var Review = require('../models/review')
var Account = require('../models/account')

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
    var user = req.user
    Review.find({}).exec(function(err, data, req) {
        if (err) {
            req.flash('error', err)
        }
        res.render(VIEW_FOLDER + '/reviewList', {
            title: 'List All',
            menuItems: menu,
            user: user,
            data: data
        })
    })
})

router.get('/view', function(req, res) {
    var user = req.user
    Review.findById(req.query.id, function(err, data) {
        if (err) {
            req.flash('error', err)
        }

        console.log("\n view data", data)

        res.render(VIEW_FOLDER + '/reviewAdd', {
            title: "View",
            menuItems: menu,
            user: req.user,
            data: data
        })
    })
})

router.get('/add', function(req, res) {

    var ratingTypes = ['appearance', 'louche', 'aroma', 'flavor', 'finish'];
    var defaultRatings = [];
    for (var i in ratingTypes) {
        defaultRatings.push({
            sortorder: i,
            attribute: ratingTypes[i]
        })
    }
    var newReview = new Review({
       ratings: defaultRatings
    });
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
    if (err && err.message) console.log(err.message)
    console.info("Looking for " + req.body.id)
    Review.findOne({ '_id': req.body.id }, function(err, data) {
        if (err && err.message) console.log(err.message)
        if (!data) {
            data = new Review({
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
                    ratings: [],
                    author: req.session.passport.user,
                lu_ts: Date.now()
            })
            for (var i in req.body.ratings) {
                data.ratings.push(req.body.ratings[i]);
            }
            data.save(function(err) {
                if (err && err.message) {
                    console.error(err)
                }
                res.redirect('/review')
            })
        } else {
            var options = {
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
                author: req.session.passport.user,
                lu_ts: Date.now()
            }
            data.update(options, function(err) {
                if (err && err.message) {
                    console.error(err)
                }
                res.redirect('/review')
            })
        }
    })
})

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

module.exports = router
