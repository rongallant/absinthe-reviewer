var express = require('express')
var Review = require('../models/review')
var Rating = require('../models/rating')

var router = express.Router()

/************************************************************
 * ACTIONS
 ************************************************************/

function buildResultSet(docs) {
    var result = [];
    for(var i in docs) {
        result.push(docs[i].absinthe.make);
    }
    return result;
}

router.get('/search_absinthe_makes', function(req, res) {
    var regex = new RegExp(req.query["term"], 'i')
    console.info("req.query", req.query)
    var query = Review.find({ "absinthe.make" : regex }, { "absinthe.make" : 1 }).sort({"absinthe.make" : -1}).limit(20)
    query.exec(function(err, makers) {
        if (!err) {
            var result = buildResultSet(makers);
            console.log("result: ", result)
            res.send(result, { 'Content-Type': 'application/json' }, 200);
        } else {
            res.send(JSON.stringify(err), { 'Content-Type': 'application/json' }, 404);
        }
    });
});

router.get('/absinthe_makes', function(req, res) {
    var query = Review.find({ }, { "absinthe.make" : 1 }).sort({"absinthe.make" : -1}).limit(500)
    query.exec(function(err, makers) {
        if (!err) {
            var result = buildResultSet(makers);
            console.log("result: ", result)
            res.send(result, { 'Content-Type': 'application/json' }, 200);
        } else {
            res.send(JSON.stringify(err), { 'Content-Type': 'application/json' }, 404);
        }
    });
});

module.exports = router
