var express = require('express')
var passport = require('passport')
var router = express.Router()

/************************************************************
 * VIEWS
 ************************************************************/

router.get('/', function (req, res) {
    if (req.user)
        res.redirect('/reviews')
    else
        res.redirect('/login')
})

/************************************************************
 * ACTIONS
 ************************************************************/

router.get('/login', function(req, res) {
    res.render('login', {
        title : "Absinthe Reviewer"
    })
})

router.post('/login', passport.authenticate('local', {
        successRedirect: '/reviews',
        successFlash: true,
        failureRedirect: '/login',
        failureFlash: true
    })
)

// router.post('/login', function(req, res, next) {
//     passport.authenticate('local', function(err, user, info) {
//         if (err) {
//             return next(err)
//         }
//         if (!user) {
//             req.flash("error", info.message)
//             return res.redirect('/login')
//         }
//         req.logIn(user, function(err) {
//             if (err) {
//                 return next(err)
//             }
//             req.flash("success", "Welcome")
//             return res.redirect('/reviews')
//         })
//     })(req, res, next)
// })

router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/login')
})

module.exports = router
