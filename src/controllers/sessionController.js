/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var url = require ('url'),
    rootUrl = '/api/sessions',
    errorMessage = 'Session controller returns an error (400).',
    sessionManager = require('../managers/sessionManager'),
    auth = require ('../auth/authMiddleware');

/**
 * Public methods.
 */
module.exports.init = function (app) {
    app.post (rootUrl, auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/sessions   Sessions in payload 
        var sessionsToCreate =  req.body;
        
        sessionManager.createSessions ( sessionsToCreate, function(error, data){
            if (error){
                console.log(errorMessage);
                res.status(400).send(error);
            } else {
                res.set('Content-Type','application/json');
                console.log(`Session controller created ${data.length} sessions successfully.`);
                res.status(200).send(data);
            }
        });
    });

    app.get (rootUrl, auth.isUserAuthenticated, function (req, res, next) {
        // By name: (GET)http:localhost:3000/api/sessions/?username=pepe&active=true 
        var queryString = url.parse(req.url, true).query,
            userName = queryString.username,
            active = queryString.active;

        if (userName) {
            if (active) {
                getActiveUserSessions(userName, res);
            } else {
                getUserSessions(userName, res);
            }
        }
    });

    console.log('Session controller initialized');
};

/**
 * Private methods.
 */
function getUserSessions(userName, res) {
    var message;

    sessionManager.getSessions (userName, function(error, data){
        if (error){
            console.log(errorMessage);
            res.status(400).send(error);
        } else {
            message = `Sessions controller returns ${data.length} sessions for user "${userName}" successfully.`;
            returnData(data, res, message);
        }
    });
}

function getActiveUserSessions(userName, res) {
    var message;

    sessionManager.getActiveSessions (userName, function(error, data){
        if (error){
            console.log(errorMessage);
            res.status(400).send(error);
        } else {
            message = `Sessions controller returns ${data.length} active sessions for user "${userName}" successfully.`;
            returnData(data, res, message);
        }
    });
}

function returnData(data, res, message) {
    sessionManager.setVirtualFields(data, function(){
        console.log(message);
        res.set('Content-Type','application/json');
        res.status(200).send(data);
    });
}