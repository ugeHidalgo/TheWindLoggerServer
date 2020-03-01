/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var url = require ('url'),
    spotManager = require('../managers/spotManager'),
    auth = require ('../auth/authMiddleware');

/**
 * Public methods.
 */
module.exports.init = function (app) {
    app.post ('/api/spots', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/spots   spots in payload 
        var spotsToCreate =  req.body;
        
        spotManager.createSpots ( spotsToCreate, function(error, spots){
            if (error){
                console.log('Spot controller returns an error (400)');
                res.status(400).send(error);
            } else {
                res.set('Content-Type','application/json');
                console.log(`Spot controller created ${spots.length} Spots successfully.`);
                res.status(200).send(spots);
            }
        });
    });

    app.get ('/api/spots', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (GET)http:localhost:3000/api/spots/?username=pepe&active=true 
        var queryString = url.parse(req.url, true).query,
            userName = queryString.username,
            active = queryString.active;

        if (userName) {
            if (active) {
                getActiveUserSpots(userName, res);
            } else {
                getUserSpots(userName, res);
            }
        }
    });

    console.log('Spot controller initialized');
};

/**
 * Private methods.
 */
function getUserSpots(userName, res) {

    spotManager.getSpots (userName, function(error, data){
        if (error){
            console.log('Spot controller returns an error (400).');
            res.status(400).send(error);
        } else {
            console.log(`Spot controller returns ${data.length} Spots for user "${userName}" successfully.`);
            res.set('Content-Type','application/json');
            res.status(200).send(data);
        }
    });
}

function getActiveUserSpots(userName, res) {

    spotManager.getActiveSpots (userName, function(error, data){
        if (error){
            console.log('Spots controller returns an error (400)');
            res.status(400).send(error);
        } else {
            console.log(`Spots controller returns ${data.length} active Spots for user "${userName}" successfully.`);
            res.set('Content-Type','application/json');
            res.status(200).send(data);
        }
    });
}
