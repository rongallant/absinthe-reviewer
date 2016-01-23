var express = require('express');
var passport = require('passport');

var User = require('../models/user');

var router = express.Router();

var VIEW_FOLDER = "usermanager"


// LIST
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

// FORM
router.get('/edit', function(req, res) {

    User.findOne({ '_id': req.query.id }, function (err, data) {
        if (err) console.log(err.message)

            console.info(data)

        if (!data) data = new User()
        res.render(VIEW_FOLDER + '/userAdd', {
            title: "Edit User",
            user: req.user,
            data: data
        })
    })
})

// Actions

router.post('/save', function(req, res) {
    User.findOne({ '_id': req.query.userid }, function (err, data) {
        if (err) console.log(err.message)
        if (!data) {
            saveUser(req, res)
        } else {
            updateUser(req, res, data)
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
        res.redirect('/reviews')
    })
}



// User.register(new User({
//     username : req.body.username,
//     fullName : req.body.fullName,
//     email : req.body.email
// })
// , req.body.password, function(err, data) {
//     if (err) {
//         return res.render(VIEW_FOLDER + '/userAdd', {
//             title : "Register",
//             user: req.user,
//             data: data
//         });
//     }
//     // passport.authenticate('local')(req, res, function () {
//     //     res.redirect('/');
//     // });
// });


module.exports = router;
