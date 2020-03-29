/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var async = require ('async'),
    moment = require('moment'),
    Session = require ('../models/session'),
    SessionsInfo = require ('../models/sessionsInfo'),
    sessionManager = require ('./sessionManager'),
    Spot = require ('../models/spot'),
    Sport = require ('../models/sport');

/**
 * Public methods.
 */
module.exports.getSessionsInfo = function (sessionFilterData, callbackFn) {

    var sessionsInfo = new SessionsInfo,
        prepareSessionsInfo = function(data, callbackFn) {
            sessionsInfo.distance += data.sessionDistance;
            sessionsInfo.time += data.sessionTime;
            if (data.sessionDistance > sessionsInfo.maxDistance) sessionsInfo.maxDistance = data.sessionDistance;
            if (data.sessionTime > sessionsInfo.maxTime) sessionsInfo.maxTime = data.sessionTime;
            if (data.maxSpeed > sessionsInfo.maxSpeed) sessionsInfo.maxSpeed = data.maxSpeed;
            if (data.maxPower > sessionsInfo.maxPower) sessionsInfo.maxPower = data.maxPower;
            callbackFn();
        };        
    
    sessionsInfo.distance = 0;
    sessionsInfo.time = 0;
    sessionsInfo.maxTime = 0;
    sessionsInfo.maxDistance = 0;
    sessionsInfo.maxSpeed = 0;
    sessionsInfo.maxPower = 0;
    sessionsInfo.userName = sessionFilterData.userName;

    console.log('SessionInfoManager.getSessionsInfo: Started to gather information.');
    sessionManager.getFilteredSessions(sessionFilterData, function(err, data) {
        if (err) {
            console.log('sessionManager.getSessionsInfo: Could not complete to gather information operation.');
            callbackFn(error, null);
        } else {
            async.each(data, prepareSessionsInfo, function() {
                sessionsInfo.sessions = data.length;
                sessionsInfo.medDistance = sessionsInfo.distance/sessionsInfo.sessions;
                sessionsInfo.medTime = sessionsInfo.time/sessionsInfo.sessions;
                sessionsInfo.medSpeed = sessionsInfo.distance/(sessionsInfo.time/3600);
                console.log ('SessionManager.getSessionsInfo: Finished to gather information.');
                callbackFn(null, sessionsInfo);
            });
            
        }
    });
};