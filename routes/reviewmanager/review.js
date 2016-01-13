var express = require('express');
var passport = require('passport');
var router = express.Router();
var mongoose = require('mongoose');
var Review = require('../../models/review');
var Rating = require('../../models/rating');
var Account = require('../../models/account');


router.get('/', function(req, res){
    Review.find({}, function(err, review, req) {
        if (err && err.message) console.log(err.message);
        res.render('reviewmanager/reviewList', {
            title:'',
            data:review
        });
    });
});

router.get('/add', function(req, res) {
   var query = Review.findOne({ '_id': req.query.review });
    query.exec(function (err, review, req, res) {
        if (err) console.log(err.message);
        if (review) {
            res.render('reviewmanager/reviewAdd', {
                title: "Edit",
                data: review
            }, req, res);
        }
    });
    // create a blog post
    var defaultReview = new Review({
        absinthe : {
            make: "",
            type: "",
            manufacturer: "",
            country: "",
            alcohol: ""
        }
    });
    defaultReview.rating.push({identity: "appearance"});
    defaultReview.rating.push({identity: "louche"});
    defaultReview.rating.push({identity: "aroma"});
    defaultReview.rating.push({identity: "flavor"});
    defaultReview.rating.push({identity: "finish"});
    defaultReview.rating.push({identity: "overall"});
    defaultReview.save(function (err) {
      if (err) throw err;
    });
    res.render('reviewmanager/reviewAdd', {
        title: "Add",
        user: req.session.user,
        data: defaultReview
    });
});

router.post('/save', function(req, res, err) {
    if (err && err.message) console.log(err.message);
    var ratings;
    var i = 0;
    for (i = 0; i < req.body.rating; i++) {
        ratings.push({
            name: req.body.rating[i].name,
            content: req.body.rating[i].content,
            score: req.body.rating[i].score
        });
    }

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
        rating: ratings
    });

    // call the built-in save method to save to the database
    review.save(function(err, res) {
      if (err) throw err;
      console.log('Review saved successfully!');
    });
    res.redirect('/review');
});

router.get('/delete', function(req, res) {
    if (req && req.query && req.query.review) {
        Review.findByIdAndRemove(req.query.review, function (err, req) {
            if (err) throw err;
            console.log('\n\nDeleted successfully!');
        });
        res.redirect('/review');
    } else {
        console.log('\n\nCould not delete');
    }
});

module.exports = router;
