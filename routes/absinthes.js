var express = require('express')
var mongoose = require('mongoose')
// var Account = require('../models/account')
var Absinthe = require('../models/absinthe')
var router = express.Router()

var VIEW_FOLDER = "absinthes"
var URL_BASE = "/absinthes"
var entryName = "Absinthe"
var entriesName = "Absinthes"

/************************************************************
 * PAGES
 ************************************************************/

// List
router.get('/', function(req, res){
    Absinthe.find().lean().exec(function(err, data) {
        if (err) {
        	console.log(err)
    		res.status(500).send({ error: 'SYSTEM ERROR ' + err })
        } else {
	        res.render(VIEW_FOLDER +'/list', {
	            title: entriesName,
	            user: req.user,
	            data: data
	        })
        }
    })
})

// Create
router.get('/create', function(req, res) {
    var data = new Absinthe()

    console.log("New model: ", data)

    res.render(VIEW_FOLDER + '/form', {
        title: "Creating " + entryName,
        user: req.user,
        data: data
    })
})

// Edit
router.get('/edit/:itemid', function(req, res) {
	console.log("Editing %s", req.params.itemid)
    Absinthe.findOne({ '_id': req.params.itemid }, function (err, data) {
        if (err) {
    		res.status(404).send({ error: 'ENTRY NOT FOUND ' + err })
        }
        if (data) {
			console.log("Editing: \n%s", data)
	        res.render(VIEW_FOLDER + '/form', {
	            title: "Editing " + entryName,
	            user: req.user,
	            data: data
	        })
        } else {
    		res.status(404).send({ error: 'ENTRY NOT FOUND ' })
        }
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

router.post('/save', function(req, res) {
    Absinthe.findOne({ '_id': req.body.id }, function (err, data) {
        if (err) console.log(err.message)
        if (data) {
            updateEntry(req, res, data)
        } else {
            createEntry(req, res)
        }
    })
})

/**
 * This is the best way to update a form.
 */
function updateEntry(req, res, data)
{
    console.log("Updating: ", req.params.id)
    data.update({$set:req.body}, function (err, data) {
        if (err) {
    		res.status(500).send({ error: 'ERROR UPDATING ' + err });
        }
        console.info("SUCCESS: %s (%s) updated!", entryName, req.body.id)
        console.info(req.body)
        console.info(data)
        req.flash("success", 'Updated')
        res.redirect('back')
    })
}

function createEntry(req, res)
{
    var data = new Absinthe({
		name: req.body.name,
		producer: req.body.producer,
		_style:  mongoose.Types.ObjectId(req.body.type),
		country: req.body.country,
		alcohol: req.body.alcohol
    })
    data.save(function(err, data) {
        if (err) {
    		res.status(500).send({ error: 'ERROR CREATING ' + err.message });
        } else {
        	console.info("SUCCESS: %s (%s) created!", entryName, data.id)
        	res.redirect(URL_BASE + '/edit/' + data.id)
        }
    })
}

router.get('/delete/:id', function(req, res) {
    console.log("Deleting: ", req.params.id)
    Absinthe.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
    		res.status(500).send({ error: 'ERROR DELETING ' + err });
        }
        req.flash("success", 'Deleted ' + entryName)
        res.redirect(URL_BASE)
    });
})

module.exports = router;
