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

/************************************************************
 * ACTIONS
 ************************************************************/

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
    res.redirect('/login')
})

module.exports = router
