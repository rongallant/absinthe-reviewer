var express = require('express')
var passport = require('passport')

var Email = require('../models/email')
var Account = require('../models/account')

var router = express.Router()

var VIEW_FOLDER = "accounts"
var URL_BASE = "/accounts"
var entryName = "Account"
var entriesName = "Accounts"


/************************************************************
 * PAGES
 ************************************************************/

// LIST
router.get('/', function(req, res){
    Account.find({ }, function(err, data) {
        if (err) console.log(err.message);
        res.render(VIEW_FOLDER +'/list', {
            title: entriesName,
            user: req.user,
            data: data
        })
    })
})

// FORM
router.get('/create', function(req, res) {
    var data = new Account()
    res.render(VIEW_FOLDER + '/edit', {
        title: "Create new " + entryName,
        user: req.user,
        data: data
    })
})

// FORM
router.get('/edit/:accountid', function(req, res) {
    Account.findOne({ '_id': req.params.accountid }, function (err, data) {
        if (err) console.log(err.message)
        if (!data) data = new Account()
        res.render(VIEW_FOLDER + '/edit', {
            title: "Editing " + entryName,
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

function saveAccount(req, res)
{
    console.table(req.body.emails)
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
            'value' : req.body.emails[i].value,
            'type' : req.body.emails[i].type
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
        res.redirect(URL_BASE + '/edit/' + data._id)
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
    data.update({$set:req.body}, function (err, data) {
        if (err) {
            req.flash("error", 'Error: ', err.message)
            console.error('UPDATE ERROR: ' + err)
        }
        console.log("UPDATED: " + data)
        req.flash("success", 'Updated' + entryName)
        res.redirect('back')
    })
}

router.get('/delete/:accountid', function(req, res) {
    console.log("Deleting: ", req.params.accountid)
    Account.findByIdAndRemove(req.params.accountid, function (err) {
        if (err) {
            console.error(err.message)
            req.flash("error", err.message)
        }
        req.flash("success", 'Deleted' + entryName)
        res.redirect('/accounts')
    });
})

module.exports = router;
