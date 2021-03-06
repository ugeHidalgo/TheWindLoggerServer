/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var async = require ('async'),
    moment = require('moment'),
    Session = require ('../models/session'),
    SessionMaterialManager = require ('./sessionMaterialManager'),
    Spot = require ('../models/spot'),
    Sport = require ('../models/sport');

/**
 * Public methods.
 */
module.exports.getSessions = function (userName, callbackFn) {
    Session
        .find({userName: userName}, callbackFn)
        .sort({sessionDate: 'desc'})
        .populate('sport').populate('spot');
};

module.exports.getActiveSessions = function (userName, callbackFn) {
    Session
        .find({userName: userName, active: true}, callbackFn)
        .sort({sessionDate: 'desc'})
        .populate('sport').populate('spot');
};

module.exports.getFilteredSessions = function (sessionFilterData, callbackFn) {
    var filter = {
        userName: sessionFilterData.userName, 
        active: true,
        sessionDate: {'$gte': sessionFilterData.dateFrom, '$lte': sessionFilterData.dateTo }
    };

    Session
        .find(filter, callbackFn)
        .sort({sessionDate: 'desc'})
        .populate('sport').populate('spot');
};

module.exports.importSessions = function (sessionsToCreate, callbackFn) {

    var loadObjectFields = function(sessionToCreate, callbackFn) {
        var sportName = sessionToCreate.sport,
            spotName = sessionToCreate.spot,
            userName = sessionToCreate.userName;
        
        async.parallel([
            function(callbackFn){
                Sport.find({userName: userName, name: sportName}, function(err, sport){
                    if (sport && sport.length > 0) {
                        sessionToCreate.sport = sport[0]._doc;
                    } else {
                        sessionToCreate.sport = sportName;
                        console.log(`Sport ${sportName} not found.`);
                    } 
                    callbackFn();
                });
            }, 
            function(callbackFn){
                Spot.find({userName: userName, name: spotName}, function(err, spot){
                    if (spot && spot.length > 0) {
                        sessionToCreate.spot = spot[0]._doc;
                    } else {
                        console.log(`Spot ${spotName} not found.`);
                        sessionToCreate.spot = spotName;
                    } 
                    callbackFn();
                });
            }],
            function done (err) {
                if (err) {
                    throw err;
                }
                callbackFn();
            });
    };

    async.each(sessionsToCreate, loadObjectFields, function() {
        console.log ('Added sport and spot data for ' + sessionsToCreate.length + ' sessions.');
        Session.insertMany(sessionsToCreate, callbackFn);
    });
};

module.exports.saveSession = function (sessionToSave, callbackFn) {
    if (!sessionToSave._id) {
        createSessionHeader(sessionToSave, callbackFn);
    } else {
        updateSession(sessionToSave, callbackFn);
    }
};

/**
 * Private methods.
 */
function createSessionHeader(sessionToSave, callbackFn) {
    var newSession = new Session(sessionToSave);
    newSession.save(function (error) {
        if (error) {
            callbackFn(error, null);
        } else {
            console.log ('New session saved with name ' + newSession.name + ' and id: ' + newSession._id);
            callbackFn(null, newSession);
        }
    });
};

function updateSession(sessionToSave, callbackFn) {
    console.log('SessionManager.saveSession: Session saving process started.');
    async.series([
        function(callbackFn){
            updateSessionHeader(sessionToSave, callbackFn);
        },
        function(callbackFn){
            SessionMaterialManager.deleteSessionMaterials(sessionToSave, callbackFn);
        },
        function(callbackFn){
            SessionMaterialManager.saveSessionMaterials(sessionToSave.materialsUsed, callbackFn);
        }
    ],
    // final callback
    function(error, results){
        if (error) {
            console.log('sessionManager.saveSession: Could not complete save session operation.');
            console.log(error.message);
            callbackFn(error, null);
        } else {
            var session = new Session(results[0]);
            session.usedMaterials = results[2];

            console.log ('SessionManager.saveSession: Session saving process finished.');
            callbackFn(null, session);
        }
    });
}

function updateSessionHeader(sessionToSave, callbackFn) {
    var filter = {
            _id: sessionToSave._id,
            userName: sessionToSave.userName 
        },
        updatedValues = {
            name: sessionToSave.name,
            description: sessionToSave.description,
            sessionDate: sessionToSave.sessionDate,
            sessionTime: sessionToSave.sessionTime,
            sessionDistance: sessionToSave.sessionDistance,
            sport: sessionToSave.sport,
            spot: sessionToSave.spot,
            race: sessionToSave.race,
            indoor: sessionToSave.indoor,
            value: sessionToSave.value,
            effort: sessionToSave.effort,
            maxSpeed: sessionToSave.maxSpeed,
            maxPower: sessionToSave.maxPower,
            medPower: sessionToSave.medPower,
            updated : moment(new Date()).format('YYYY-MM-DD[T00:00:00.000Z]')
        };

    Session.findOneAndUpdate( filter, {$set: updatedValues}, { new: true })
            .then( (sessionHeader)=> { 
                    if (!sessionHeader) {
                        var error = new Error('SessionManager.saveSessionHeader: Session not found while trying to find and update.');
                        callbackFn(error, null);
                    }
                    console.log ('SessionManager.saveSessionHeader: Session header updated -->username: ' + sessionHeader.userName + ' /id: ' + sessionHeader._id);
                    callbackFn(null, sessionHeader);
                })
            .catch ( (error)=> {
                    console.log('SessionManager.saveSessionHeader: Error while updating session');
                    callbackFn(error, null);
            });
};