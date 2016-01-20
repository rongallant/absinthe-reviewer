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
        title: 'List'
    },
    {
        link: '/review/add',
        iconClass: 'plus',
        title: 'Add'
    }
]

/************************************************************
 * VIEWS
 ************************************************************/

router.get('/', function(req, res) {
    var user = req.user
    Review.find({}, {key:1}, function(err, review, req) {
         if (err) {
            req.flash('error', err)
        }
        res.render(VIEW_FOLDER + '/reviewList', {
            title: 'List All',
            menuItems: menu,
            user: user,
            data: review
        })
    })
})

router.get('/view', function(req, res) {
    var user = req.user
    Review.findById(req.query.id, function(err, data) {
        if (err) {
            req.flash('error', err)
        }
        res.render(VIEW_FOLDER + '/reviewAdd', {
            title: "View",
            menuItems: menu,
            user: user,
            data: data
        })
    })
})

router.get('/add', function(req, res) {
    var user = req.user
    res.render(VIEW_FOLDER + '/reviewAdd', {
        title: "Add",
        menuItems: menu,
        user: user,
        data: new Review()
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

router.post('/save', function(req, res, err) {
    if (err && err.message) console.log(err.message)

    var review = new Review({
        author: req.session.passport.user,
        lu_ts: Date.now(),
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
        rating: [req.body.ratings]
    })
    review.markModified('anything')

    // call the built-in save method to save to the database
    review.save(function(err, res) {
      if (err) throw err;
      console.log('Review saved successfully!')
    });
    console.log("\n/ SAVED \n" + review)
    res.redirect('/review')
})

router.get('/delete', function(req, res) {
    if (req && req.query && req.query.review) {
        Review.findByIdAndRemove(req.query.review, function (err, req) {
            if (err) throw err
            console.log('\n\nDeleted successfully!')
        });
        res.redirect('/review')
    } else {
        console.log('\n\nCould not delete!')
    }
})

router.post('/deleteAll', function(req, res) {
    Review.remove({_id: {$in: req.body.reviewid}}, function (err, req) {
        if (err) throw Error
    });
    req.flash('success', 'Reviews successfully deleted!');
    res.redirect('back')
})

module.exports = router
