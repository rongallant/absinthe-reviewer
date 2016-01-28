var express = require('express')
var Review = require('../models/review')

var router = express.Router()

/************************************************************
 * ACTIONS
 ************************************************************/

// function buildResultSet(docs) {
//     var result = [];
//     for(var i in docs) {
//         result.push(docs[i].absinthe.make);
//     }
//     return result;
// }

router.get('/absinthe_makes/:name', function(req, res) {
    var query = Review
        .find({ "absinthe.make": {$regex : new RegExp("^" + req.params.name, "i")}})
        .select({ "absinthe.make": 1 })
        .sort({"absinthe.make" : -1})
        .limit(20)
    query.exec(function(err, data) {
        if (!err) {
            var result = []
            for(var i in data) {
                result.push(data[i].absinthe.make)
            }
            res.send(result, { 'Content-Type': 'application/json' }, 200)
        } else {
            res.send(JSON.stringify(err), { 'Content-Type': 'application/json' }, 404)
        }
    })
})

router.get('/absinthe_manufacturers/:name', function(req, res) {
    var query = Review
        .find({ "absinthe.manufacturer": {$regex : new RegExp("^" + req.params.name, "i")}})
        .select({ "absinthe.manufacturer": 1 })
        .sort({"absinthe.manufacturer" : -1})
        .limit(20)
    query.exec(function(err, data) {
        if (!err) {
            var result = []
            for(var i in data) {
                result.push(data[i].absinthe.manufacturer)
            }
            res.send(result, { 'Content-Type': 'application/json' }, 200)
        } else {
            res.send(JSON.stringify(err), { 'Content-Type': 'application/json' }, 404)
        }
    })
})

module.exports = router