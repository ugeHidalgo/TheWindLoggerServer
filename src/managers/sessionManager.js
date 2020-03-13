/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var async = require ('async'),
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

module.exports.createSessions = function (sessionsToCreate, callbackFn) {

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