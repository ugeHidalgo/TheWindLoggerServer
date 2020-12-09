/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var url = require ('url'),
    errorMessage = 'Sport controller returns an error (400).',
    sportManager = require('../managers/sportManager'),
    auth = require ('../auth/authMiddleware');

/**
 * Public methods.
 */
module.exports.init = function (app) {
    app.post ('/api/sports', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/sports   sports in payload 
        var sportsToCreate =  req.body;
        
        sportManager.createSports ( sportsToCreate, function(error, sports){
            if (error){
                console.log(errorMessage);
                console.log(error.message);
                res.status(400).send(error);
            } else {
                res.set('Content-Type','application/json');
                console.log(`Sport controller created ${sports.length} sports successfully.`);
                res.status(200).send(sports);
            }
        });
    });

    app.get ('/api/sports', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (GET)http:localhost:3000/api/sports/?username=pepe&active=true 
        var queryString = url.parse(req.url, true).query,
            userName = queryString.username,
            active = queryString.active;

        if (userName) {
            if (active) {
                getActiveUserSports(userName, res);
            } else {
                getUserSports(userName, res);
            }
        }
    });

    console.log('Sport controller initialized');
};

/**
 * Private methods.
 */
function getUserSports(userName, res) {
    var message;

    sportManager.getSports (userName, function(error, data){
        if (error){
            console.log(errorMessage);
            console.log(error.message);
            res.status(400).send(error);
        } else {
            message = `Sports controller returns ${data.length} sports for user "${userName}" successfully.`;
            returnData(data, res, message);
        }
    });
}

function getActiveUserSports(userName, res) {
    var message;

    sportManager.getActiveSports (userName, function(error, data){
        if (error){
            console.log(errorMessage);
            console.log(error.message);
            res.status(400).send(error);
        } else {
            message = `Sports controller returns ${data.length} active sports for user "${userName}" successfully.`;
            returnData(data, res, message);
        }
    });
}

function returnData(data, res, message) {
    console.log(message);
    res.set('Content-Type','application/json');
    res.status(200).send(data);
}