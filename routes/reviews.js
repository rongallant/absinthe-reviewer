var express = require('express')
var mongoose = require('mongoose')
var Review = require('../models/review')
var Rating = require('../models/rating')
var AbsintheType = require('../models/absinthetype')

var router = express.Router()

var VIEW_FOLDER = "reviewmanager"

var URL_BASE = "/reviews"
var entryName = "Review"
var entriesName = "Reviews"

/************************************************************
 * VIEWS
 ************************************************************/

// List All Reviews
router.get('/', function(req, res) {
    Review.find(function(err, data) {
        if (err) { handleError(req, res, err) }
        res.render(VIEW_FOLDER + '/reviewList', {
            title: 'Reviews',
            user: req.user,
            data: data
        })
    })
})

router.get('/create', function(req, res) {
    var data = new Review()
    var attributes = ['Appearance', 'Louche', 'Aroma', 'Flavor', 'Finish', 'Overall'] // TODO put in model
    for (var i in attributes) {
        data._ratings.push(new Rating({ id: mongoose.Types.ObjectId(), sortorder: i, attribute: attributes[i] }))
    }
    console.log("\nCreated new Review Object: ", data, "\n")
    res.render(VIEW_FOLDER + '/reviewAdd', {
        title: "Review Editor",
        user: req.user,
        data: data
    })
})


// Return selected Review
router.get('/edit/:reviewid', function(req, res) {
    Review.findById(req.params.reviewid).exec(function(err, data) {
        if (err) {
    		res.status(404).send({ error: 'ENTRY NOT FOUND ' + err })
        }
        if (data) {
			console.log("Editing: \n%s", data)
	        res.render(VIEW_FOLDER + '/reviewAdd', {
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

/**
 * Insert default data into database
 */
router.get('/insertDefaults', function(req, res) {
    res.sendStatus(404)
    console.log("Attempting to insert default data.")
    AbsintheType.find().exec(function(err, data) {
        if (err) {
            console.error(err.message)
        } else if (data.length == 0) {
            var absintheTypes = require('../models/defaults/absinthetypes.json')
            AbsintheType.collection.insert(absintheTypes, function(err) {
                if (err) {
                    res.send(JSON.stringify(err), { 'Content-Type': 'application/json' }, 500)
                } else {
                    var result = "You have inserted the default data for AbsintheType"
                    res.send(result, { 'Content-Type': 'application/json' }, 200)
                }
            });
        } else {
            console.log("Current Data in AbsintheType table: ", data)
             AbsintheType.count({}, function(err, c) {
                if (err) {
                    res.send(JSON.stringify(err), { 'Content-Type': 'application/json' }, 500)
                }
                console.log('AbsintheType Count is ' + c);
            });
            res.send("You already have content in the database.  Check console for results.", { 'Content-Type': 'application/text' }, 400)
        }
    })
})

router.post('/save', function(req, res) {
    Review.findOne({ '_id': req.body.id }, { }, function(err, data) {
        if (err)
            console.info('SAVE FINDONE ERROR: ' + err)
        else if (data)
            updateEntry(req, res, data)
        else
            createEntry(req, res)
    })
})

function createEntry(req, res) {
    console.log("body = ", req.body)
    var data = new Review({
        title: req.body.title,
        subtitle: req.body.subtitle,
        intro: req.body.intro,
        conclusion: req.body.conclusion,
        _absinthe: mongoose.Types.ObjectId(req.body._absinthe),
        cr_user: req.user,
        lu_user: req.user
     })
    for (var i in req.body.ratings) {
        data._ratings.push(new Rating({
            sortorder: req.body.ratings[i].sortorder,
            attribute: req.body.ratings[i].attribute,
            content: req.body.ratings[i].content,
            score: req.body.ratings[i].score
        }))
    }
    data.save(function(err) {
        if (err)  console.log(err)
        console.log('SUCCESS created new review for absinthe: %s', data._absinthe)
        req.flash("success", 'Created')
        res.redirect(URL_BASE + '/edit/' + data._id)
    })
}

/**
 * This is the best way to update a form.
 */
function updateEntry(req, res, data) {
    for (var i in req.body.ratings) {
        console.table(req.body)
        Rating.findByIdAndUpdate(req.body.ratings[i].ratingId, {$set:req.body}, function(err) {
            if (err) console.error(err)
        })
    }
    data.update({$set:req.body}, function (err, data) {
        if (err)
            console.error('UPDATE ERROR: ' + err)
        req.flash("success", 'Updated')
        res.redirect('back')
    })
}

router.get('/delete/:reviewid', function(req, res) {
    Review.findByIdAndRemove(req.params.reviewid, function (err) {
        if (err) {
            console.error(err.message)
            req.flash("error", err.message)
        }
        req.flash("success", 'Deleted')
        res.redirect('/reviews')
    });
})

router.post('/deleteAll', function(req, res) {
    Review.remove({_id: {$in: req.body.reviewid}}, function (err) {
            if (err) {
                console.error(err.message)
                req.flash("error", err.message)
            }
        req.flash('success', 'Reviews successfully deleted!');
        res.redirect('back')
    });
})

function handleError(req, res, err) {
    console.error("ERROR: ", err)
    return false
}

module.exports = router
