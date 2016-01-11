var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function (req, res) {
    if (req.user) {
      res.render('usermanager/list', { user:req.user });
    } else {
      res.render('login');
    }
});

router.get('/register', function(req, res) {
    res.render('register', { title : "Register" });
});
router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account, title : "Register" });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user, title : "Absinthe Reviewer" });
});
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
});

router.get('/usermanager/list', function(req, res){
  Account.find({ }, function(err, docs, req) {
     res.render('usermanager/list', { user:req.user, data:docs });
  });
});

router.get('/usermanager', function (req, res) {
    res.render('usermanager/list', { user:req.user });
});

module.exports = router;
