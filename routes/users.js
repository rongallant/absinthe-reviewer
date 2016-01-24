var express = require('express');
var User = require('../models/user');
var router = express.Router();
var VIEW_FOLDER = "usermanager"

/************************************************************
 * PAGES
 ************************************************************/

// LIST
router.get('/', function(req, res){
    var user = req.user
    User.find({ }, function(err, data, req) {
        if (err) console.log(err.message);
        res.render(VIEW_FOLDER +'/userList', {
            title:'Users',
            user: user,
            data: data
        });
    });
});

// FORM
router.get('/edit', function(req, res) {
    User.findOne({ '_id': req.query.id }, function (err, data) {
        if (err) console.log(err.message)
        if (!data) data = new User()
        res.render(VIEW_FOLDER + '/userAdd', {
            title: "User Editor",
            user: req.user,
            data: data
        })
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

router.post('/save', function(req, res) {
    User.findOne({ '_id': req.body.id }, function (err, data) {
        if (err) console.log(err.message)
        if (data) {
            updateUser(req, res, data)
        } else {
            saveUser(req, res)
        }
    })
})

function saveUser(req, res)
{
    var newUser = new User({
        username: req.body.username,
        password: req.body.password,
        fullName: req.body.fullName,
        email: req.body.email
    })
    newUser.save(function(err) {
        if (err) console.error(err)
        res.redirect('/users')
    })
}


/**
 * This is the best way to update a form.
 */
function updateUser(req, res, data)
{
    data.update({$set:req.body}, function (err, data) {
        if (err)
            console.error('UPDATE ERROR: ' + err)
        req.flash("success")
        res.redirect('/users')
    })
}

module.exports = router;
