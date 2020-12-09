/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var url = require ('url'),
    errorMessage = 'Sport types controller returns an error (400)',
    sportTypeManager = require('../managers/sportTypeManager'),
    auth = require ('../auth/authMiddleware');

/**
 * Public methods.
 */
module.exports.init = function (app) {
    app.post ('/api/sporttypes', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/sporttypes   sport types in payload 
        var sportTypesToCreate =  req.body;
        
        sportTypeManager.createSportTypes ( sportTypesToCreate, function(error, sportTypes){
            if (error){
                console.log(errorMessage);
                console.log(error.message);
                res.status(400).send(error);
            } else {
                res.set('Content-Type','application/json');
                console.log(`SportTypes controller created ${sportTypes.length} sport types successfully.`);
                res.status(200).send(sportTypes);
            }
        });
    });

    app.get ('/api/sporttypes', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (GET)http:localhost:3000/api/sporttypes/?username=pepe&active=true 
        var queryString = url.parse(req.url, true).query,
            userName = queryString.username,
            active = queryString.active;

        if (userName) {
            if (active) {
                getActiveUserSportTypes(userName, res);
            } else {
                getUserSportTypes(userName, res);
            }
        }
    });

    console.log('SportType controller initialized');
};

/**
 * Private methods.
 */
function getUserSportTypes(userName, res) {

    sportTypeManager.getSportTypes (userName, function(error, data){
        if (error){
            console.log(errorMessage);
            console.log(error.message);
            res.status(400).send(error);
        } else {
            console.log(`SportType controller returns ${data.length} sport types for user "${userName}" successfully.`);
            res.set('Content-Type','application/json');
            res.status(200).send(data);
        }
    });
}

function getActiveUserSportTypes(userName, res) {

    sportManager.getActiveSportTypes (userName, function(error, data){
        if (error){
            console.log(errorMessage);
            console.log(error.message);
            res.status(400).send(error);
        } else {
            console.log(`SportType controller returns ${data.length} active sport types for user "${userName}" successfully.`);
            res.set('Content-Type','application/json');
            res.status(200).send(data);
        }
    });
}
