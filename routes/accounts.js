var express = require('express')
var passport = require('passport')

var Email = require('../models/email')
var Account = require('../models/account')

var router = express.Router()

var VIEW_FOLDER = "accounts"

/************************************************************
 * PAGES
 ************************************************************/

// LIST
router.get('/', function(req, res){
    var user = req.user
    Account.find({ }, function(err, data, req) {
        if (err) console.log(err.message);
        res.render(VIEW_FOLDER +'/list', {
            title:'Accounts',
            user: user,
            data: data
        })
    })
})

// FORM
router.get('/edit', function(req, res) {
    Account.findOne({ '_id': req.query.id }, function (err, data) {
        if (err) console.log(err.message)
        if (!data) data = new Account()
        console.log("data", data)
        res.render(VIEW_FOLDER + '/edit', {
            title: "Editing Account",
            user: req.user,
            data: data
        })
    })
})



/************************************************************
 * PARTS
 ************************************************************/


router.get('/emailrow/:index', function(req, res) {
    res.render(VIEW_FOLDER +'/includes/email-row', {
        index:req.params.index
    })
})


/************************************************************
 * ACTIONS
 ************************************************************/

router.post('/save', function(req, res) {
    Account.findOne({ '_id': req.body.id }, function (err, data) {
        if (err) console.log(err.message)
        if (data) {
            updateAccount(req, res, data)
        } else {
            saveAccount(req, res)
        }
    })
})

// function registerNewAccount(req, res) {
//     console.info("REGISTERING: User %s...", req.body.username)
//     Account.register( req.body.username, req.body.password, function(err, account) {
//         if (err) {
//             console.error("ERROR: registering user %s!", req.body.username)
//             console.error(err)
//         }
//         console.success("SUCCESS: registered user %s!", req.body.username)
//         saveAccount(req, res)
//     })
// }

function saveAccount(req, res)
{
    var data = new Account({
        username: req.body.username,
        password: req.body.password,
        name: {
            givenName: req.body.name.givenName,
            familyName: req.body.name.familyName
        }
    })
    for (var i in req.body.emails) {
        data.emails.push(new Email({
            sortorder: req.body.emails[i].value,
            attribute: req.body.emails[i].type
        }))
    }

    // See if username is available then register it.
    console.info("REGISTERING: User %s...", req.body.username)
    Account.register(data, req.body.password, function(err, account) {
        if (err) {
            console.error("ERROR: registering user %s!", req.body.username)
            console.error(err)
        }
        console.info("SUCCESS: registered user %s!", req.body.username)

        // Save to database
        console.info("SAVING: User %s...", req.body.username)
        data.save(function(err) {
            if (err) console.error(err)
            console.info("SUCCESS: User %s saved!", req.body.username)
            res.redirect('/accounts')
        })
    })
}

/**
 * This is the best way to update a form.
 */
function updateAccount(req, res, data) {
    for (var i in req.body.emails) {
        console.table(req.body.emails[i])
        Email.findByIdAndUpdate(req.body.emails[i].id, {$set:req.body}, function(err) {
            if (err) console.error(err)
        })
    }
    console.log("UPDATING: ")
    console.log(req.body)
    console.log(" INTO ")
    console.log(data)

    data.update({$set:req.body}, function (err, data) {
        if (err) {
            req.flash("error", 'Error: ', err.message)
            console.error('UPDATE ERROR: ' + err)
        }
        req.flash("success", 'Updated')
        res.redirect('/accounts')
    })
}

router.get('/delete/:accountid', function(req, res) {

    console.log("Deleting: ", req.params.accountid)

    Account.findByIdAndRemove(req.params.accountid, function (err) {
        if (err) {
            console.error(err.message)
            req.flash("error", err.message)
        }
        req.flash("success", 'Deleted')
        res.redirect('/accounts')
    });
})

module.exports = router;
