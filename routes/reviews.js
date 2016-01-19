var express = require('express')
var passport = require('passport')
var mongoose = require('mongoose')
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var Review = require('../models/review')
var Account = require('../models/account')

var router = express.Router()

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

var VIEW_FOLDER = "reviewmanager"

/************************************************************
 * VIEWS
 ************************************************************/

router.get('/', function(req, res){
    var query = Review.find({})
    query.sort({ key:1 })
    query.exec(function(err, review, req) {
        if (err && err.message)
            res(err)
        res.render(VIEW_FOLDER + '/reviewList', {
            title: 'List All',
            data: review,
            menuItems: menu
        })
    })
})


router.get('/view', function(req, res) {
    Review.findOne({_id:req.query.id}, function(err, results){
        if (err) console.log(err.message)
        res.render(VIEW_FOLDER + '/reviewAdd', {
            title: "View",
            data: JSON.parse(JSON.stringify(results)),
            menuItems: menu
        })
    })
})

router.get('/add', function(req, res) {
    res.render(VIEW_FOLDER + '/reviewAdd', {
        title: "Add",
        user: req.session.user,
        data: JSON.parse(JSON.stringify(new Review())),
        menuItems: menu
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

router.post('/save', function(req, res, err) {
    if (err && err.message) console.log(err.message)
    var review = new Review({
        title: req.body.title,
        subtitle: req.body.subtitle,
        author: req.body.author,
        intro: req.body.intro,
        conclusion: req.body.conclusion,
        absinthe: {
            make: req.body.absinthe_make,
            type: req.body.absinthe_type,
            manufacturer: req.body.absinthe_manufacturer,
            country: req.body.absinthe_country,
            alcohol: req.body.absinthe_alcohol
        },
        rating: req.body.ratings
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
