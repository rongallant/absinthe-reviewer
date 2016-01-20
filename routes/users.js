var express = require('express');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');

var User = require('../models/user');

var router = express.Router();

var VIEW_FOLDER = "usermanager"

router.get('/', function(req, res){
    var user = req.user
    User.find({ }, function(err, data, req) {
        if (err) console.log(err.message);
        res.render(VIEW_FOLDER +'/userList', {
            title:'User Manager',
            user: user,
            data: data
        });
    });
});

router.get('/add', function(req, res){
    var user = req.user
    User.findOne({ '_id': req.query.userid }, function (err, data, req) {
        if (err) console.log(err.message)
        if (data) {
            res.render(VIEW_FOLDER + '/userAdd', {
                title: "Edit User",
                user: user,
                data: data
            });
        } else {
            res.render(VIEW_FOLDER + '/userAdd', {
                title: "Add User",
                user: user,
                data: new User()
            });
        }
    });
});

router.post('/add', function(req, res) {
    var user = req.user
    User.register(new User({
        username : req.body.username,
        fullName : req.body.fullName,
        email : req.body.email
    })
    , req.body.password, function(err, data) {
        if (err) {
            return res.render('register', {
                title : "Register",
                user: user,
                data: data
            });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

module.exports = router;
