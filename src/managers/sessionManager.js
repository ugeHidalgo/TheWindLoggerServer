/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var async = require ('async'),
    moment = require('moment'),
    Session = require ('../models/session'),
    Spot = require ('../models/spot'),
    Sport = require ('../models/sport');

/**
 * Public methods.
 */
module.exports.getSessions = function (userName, callbackFn) {

    Session.find({userName: userName}, callbackFn).populate('sport').populate('spot');
};

module.exports.getActiveSessions = function (userName, callbackFn) {

    Session.find({userName: userName, active: true}, callbackFn).populate('sport').populate('spot');
};

module.exports.saveSession = function (sessionToSave, callbackFn) {
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
            .then( (data)=> { 
                    if (!data) {
                        var error = new Error('Session not fund while trying to find and update.');
                        callbackFn(error, null);
                    }
                    console.log ('Session data updated -->username: ' + data.userName + ' /id: ' + data._id);
                    callbackFn(null, data)
                })
            .catch ( (error)=> {
                    console.log('Error while updating session');
                    callbackFn(error, null);
            });
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