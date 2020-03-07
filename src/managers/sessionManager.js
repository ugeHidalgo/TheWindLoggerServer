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

    Session.find({userName: userName}, callbackFn).populate('sport','spot');
};

module.exports.getActiveSessions = function (userName, callbackFn) {

    Session.find({userName: userName, active: true}, callbackFn).populate('sport','spot');
};

module.exports.createSessions = function (sessionsToCreate, callbackFn) {

    var loadSportObjectOnSportField = function(sessionToCreate, callbackFn) {
        var sportName = sessionToCreate.sport;
        
        Sport.find({userName: sessionToCreate.userName, name: sportName}, function(err, sport){
            if (sport && sport.length>0) {
                sessionToCreate.sport = sport[0]._doc;
            } else {
                sessionToCreate.sport = sportName;
            } 
            callbackFn();
        });
    };

    async.each(sessionsToCreate, loadSportObjectOnSportField, function() {
        console.log ('Added sport data for ' + sessionsToCreate.length + ' sessions.');
        Session.insertMany(sessionsToCreate, callbackFn);
    });
};

module.exports.setVirtualFields = function (sessions, callbackFn) {
    var mapVirtualFields = function(session, callbackFn) {
        if (session.sport) {
            session.sportName = session.sport.name;
        }
        if (session.spot) {
            session.spotName = session.spot.name;
        }
        callbackFn();
    };
    async.each(sessions, mapVirtualFields, callbackFn);
};