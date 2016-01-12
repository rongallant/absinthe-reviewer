var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/', function (req, res) {
    if (req.user) {
      res.redirect('/usermanager');
    } else {
      res.render('login');
    }
});

router.get('/usermanager', function(req, res){
  Account.find({ }, function(err, account, req) {
      if (err) {
        console.log(err.message);
      }
      console.log(account);
     res.render('usermanager', {data:account });
  });
});

router.get('/register', function(req, res) {

   var query = Account.findOne({ '_id': req.query.userid });
    query.select('username');
    query.exec(function (err, account, req) {
        if (err) {
                console.log(err.message);
            }
            else if (account) {
                res.render('register', {
                    title: "Edit User",
                    data: account
                });
        } else {
            res.render('register', {
                title: "Add User",
                data: new Account()
            });
        }
    });
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


module.exports = router;
