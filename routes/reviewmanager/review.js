var express = require('express');
var passport = require('passport');
var router = express.Router();
var mongoose = require('mongoose');

var Review = require('../../models/review');
var Absinthe = require('../../models/absinthe');
var Rating = require('../../models/rating');

router.get('/', function(req, res){
  Review.find({ }, function(err, account, req) {
      if (err) {
        console.log(err.message);
      }
      console.log(account);
     res.render('reviewmanager/reviewList', {title:'Review Manager', data:account });
  });
});

router.get('/new', function(req, res) {
   var query = Review.findOne({ '_id': req.query.review });
    query.exec(function (err, review, req) {
        console.log(review);
        if (err) {
                console.log(err.message);
            }
            else if (review) {
                res.render('reviewmanager/reviewAdd', {
                    title: "Edit Review",
                    data: review
                });
        } else {
            res.render('reviewmanager/reviewAdd', {
                title: "Add Review",
                data: new Review()
            });
        }
    });
});


module.exports = router;
