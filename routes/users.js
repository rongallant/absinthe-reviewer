var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var User = require('../models/user');

var router = express.Router();

var VIEW_FOLDER = "usermanager";

router.get('/', function(req, res){
  User.find({ }, function(err, account, req) {
      if (err) {
        console.log(err.message);
      }
      console.log(account);
     res.render(VIEW_FOLDER +'/userList', {
         title:'User Manager',
         data:account
     });
  });
});

// TODO Make an update route.

router.get('/add', function(req, res)
{
   var query = User.findOne({ '_id': req.query.userid });
    query.select('username');
    query.exec(function (err, account, req) {
        if (err) {
                console.log(err.message);
            }
            else if (account) {
                res.render(VIEW_FOLDER + '/userAdd', {
                    title: "Edit User",
                    data: account
                });
        } else {
            res.render(VIEW_FOLDER + '/userAdd', {
                title: "Add User",
                data: new User()
            });
        }
    });
});

router.post('/add', function(req, res) {
    User.register(new User({
        username : req.body.username,
        fullName : req.body.fullName,
        email : req.body.email
        })
    , req.body.password, function(err, account) {
        if (err) {
            return res.render('register', {
                account : account,
                title : "Register"
            });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

module.exports = router;
