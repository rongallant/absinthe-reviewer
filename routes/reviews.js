var express = require('express')
// var mongoose = require('mongoose')
var Review = require('../models/review')
var Rating = require('../models/rating')
var Absinthe = require('../models/absinthe')
var AbsintheType = require('../models/absinthetype')
var absintheTypes = require('../models/defaults/absinthetypes.json')

var router = express.Router()

var VIEW_FOLDER = "reviewmanager"

var menu = [
    {
        link:'/reviews',
        iconClass: 'view_list',
        title: 'List'
    },
    {
        link: '/reviews/add',
        iconClass: 'add',
        title: 'Add'
    }
]

/************************************************************
 * VIEWS
 ************************************************************/

// List All Reviews
router.get('/', function(req, res) {
    Review.find({}).exec(function(err, data) {
        if (err) { handleError(req, res, err) }
        res.render(VIEW_FOLDER + '/reviewList', {
            title: 'Reviews',
            menuItems: menu,
            user: req.user,
            data: data
        })
    })
})

// Return selected Review
router.get('/edit', function(req, res) {
    Review.findById(req.query.id)
            .populate('_absinthe')
            .exec(function(err, data) {
        if (err) {
            console.error("ERROR IN FINDBYID: ", err)
        }
        if (!data) {
            data = new Review({
                _absinthe: new Absinthe({
                    _style: new AbsintheType()
                })
            })
            var ratingTypes = ['Appearance', 'Louche', 'Aroma', 'Flavor', 'Finish', 'Overall'] // TODO put in model
            for (var i in ratingTypes) {
                data._ratings.push(new Rating({ sortorder: i, attribute: ratingTypes[i] }))
            }
            console.log("created new Review Object", data)
        }
        res.render(VIEW_FOLDER + '/reviewAdd', {
            title: "Review Editor",
            menuItems: menu,
            absintheTypes: absintheTypes,
            user: req.user,
            data: data
        })
    })
})

/************************************************************
 * ACTIONS
 ************************************************************/

router.post('/save', function(req, res) {
    Review.findOne({ '_id': req.body.id }, { }, function(err, data) {
        if (err)
            console.info('SAVE FINDONE ERROR: ' + err)
        else if (data)
            updateReview(req, res, data)
        else
            saveNewReview(req, res)
    })
})

function saveNewReview(req, res) {
    console.log("body = ", req.body)

    var data = new Review({
        title: req.body.title,
        subtitle: req.body.subtitle,
        intro: req.body.intro,
        conclusion: req.body.conclusion,
        _absinthe: req.absinthe,
        // _absinthe: new Absinthe({
        //     make: req.body.absinthe.make,
        //     manufacturer: req.body.absinthe.manufacturer,
        //     country: req.body.absinthe.country,
        //     _type: req.body.absinthe.type,
        //     alcohol: req.body.absinthe.alcohol
        // }),
        cr_date: Date.now,
        cr_user: req.user,
        lu_user: req.user
     })
    data.cr_date = Date.now()
    data.cr_user = req.user
    for (var i in req.body.ratings) {
        data._ratings.push(new Rating({
            sortorder: req.body.ratings[i].sortorder,
            attribute: req.body.ratings[i].attribute,
            content: req.body.ratings[i].content,
            score: req.body.ratings[i].score
        }))
    }
    console.log("data = ", data)
    data.save(function(err) {
        if (err)
            return handleError(req, res, err)
        req.flash("success", 'Created')
        res.redirect('/reviews')
    })
}

/**
 * This is the best way to update a form.
 */
function updateReview(req, res, data) {
    for (var i in req.body.ratings) {
        console.table(req.body.ratings[i])
        Rating.findByIdAndUpdate(req.body.ratings[i].ratingId, {$set:req.body}, function(err) {
            if (err) console.error(err)
        })
    }
    data.update({$set:req.body}, function (err, data) {
        if (err)
            console.error('UPDATE ERROR: ' + err)
        req.flash("success", 'Updated')
        res.redirect('/reviews')
    })
}

router.get('/delete', function(req, res) {
    Review.findByIdAndRemove(req.query.id, function (err) {
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
