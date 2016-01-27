var express = require('express')
var passport = require('passport')
var flash = require('connect-flash')

var Account = require('../models/account')

var router = express.Router()

/************************************************************
 * VIEWS
 ************************************************************/

router.get('/', function (req, res) {
    if (req.user)
        res.redirect('/reviews')
    else
        res.redirect('/login')
});

router.get('/usermanager', function(req, res){
  Account.find({ }, function(err, account, req) {
      if (err) {
        console.log(err.message)
      }
     res.render('usermanager', {title:'User Manager', data:account })
  })
})

router.get('/register', function(req, res) {
   var query = Account.findOne({ '_id': req.query.userid })
    query.select('username')
    query.exec(function (err, account, req) {
        if (err) {
            console.log(err.message)
        } else if (account) {
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
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

router.post('/register', function(req, res) {
    Account.register(new Account({
        username : req.body.username,
        fullName : req.body.fullName,
        email : req.body.email
    }),
    req.body.password, function(err, account) {
        if (err) {
            return res.render('register', {
                account : account,
                title : "Register"
            })
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/')
        })
    })
})

router.get('/login', function(req, res) {
    // res.render('login', { // TODO Rename newLogin to login.
    res.render('newLogin', {
        title : "Absinthe Reviewer"
    })
})

router.post('/authenticate', passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        req.session.user=req.user
        req.flash("success", "Welcome back %s", req.session.user.fullName)
        res.redirect('/reviews')
});

router.get('/logout', function(req, res) {
    req.logout()
    // req.flash("success", "You have successfully logged out") // FIXME Causes duplicate messages
    res.redirect('/login')
})

module.exports = router
