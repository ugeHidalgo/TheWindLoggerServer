/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var url = require ('url'),
    rootUrl = '/api/sessions',
    filteredUrl = rootUrl + '-filtered',
    importUrl = rootUrl + '/import',
    infoUrl = rootUrl + '-info',
    errorMessage = 'Session controller returns an error (400) from: ',
    sessionManager = require('../managers/sessionManager'),
    sessionInfoManager = require('../managers/sessionInfoManager'),
    auth = require ('../auth/authMiddleware');
    

/**
 * Public methods.
 */
module.exports.init = function (app) {
    app.post (importUrl, auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/sessions/import   Sessions in payload 
        var sessionsToCreate =  req.body;
        
        sessionManager.importSessions ( sessionsToCreate, function(error, data){
            if (error){
                console.log(errorMessage + 'sessionManager.importSessions');
                console.log(error.message);
                res.status(400).send(error);
            } else {
                res.set('Content-Type','application/json');
                console.log(`Session controller: Imported ${data.length} sessions successfully.`);
                res.status(200).send(data);
            }
        });
    });

    app.post (filteredUrl, auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/sessions-filtered   Session filter data in payload 
        var message,
            sessionsFilterData =  req.body;
        
        sessionManager.getFilteredSessions (sessionsFilterData, function(error, data){
            if (error){
                console.log(errorMessage + 'sessionManager.getFilteredSessions');
                console.log(error.message);
                res.status(400).send(error);
            } else {
                message = `Sessions controller returns ${data.length} filtered sessions for user "${sessionsFilterData.userName}" successfully.`;
                returnData(data, res, message);
            }
        });
    });

    app.post (infoUrl, auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/sessions-info   Session filter data in payload 
        var message,
            sessionsFilterData =  req.body;
        
        sessionInfoManager.getSessionsInfo (sessionsFilterData, function(error, data){
            if (error){
                console.log(errorMessage + 'sessionManager.getSessionsInfo');
                console.log(error.message);
                res.status(400).send(error);
            } else {
                message = `Sessions controller returns sessions info for user "${sessionsFilterData.userName}" successfully.`;
                returnData(data, res, message);
            }
        });
    });

    app.post (rootUrl, auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/sessions   Session in payload 
        var sessionToSave =  req.body;
        
        sessionManager.saveSession ( sessionToSave, function(error, data){
            if (error){
                console.log(errorMessage + 'sessionManager.saveSession');
                console.log(error.message);
                res.status(400).send(error);
            } else {
                console.log(`Session Controller: Saved session ${data.name} successfully.`);
                res.set('Content-Type','application/json');
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
            console.log(errorMessage + 'sessionManager.getSessions');
            console.log(error.message);
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
            console.log(errorMessage + 'sessionManager.getActiveSessions');
            console.log(error.message);
            res.status(400).send(error);
        } else {
            message = `Sessions controller returns ${data.length} active sessions for user "${userName}" successfully.`;
            returnData(data, res, message);
        }
    });
}

function returnData(data, res, message) {
    console.log(message);
    res.set('Content-Type','application/json');
    res.status(200).send(data);
}