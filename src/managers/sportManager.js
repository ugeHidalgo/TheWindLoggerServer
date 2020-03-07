/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var async = require ('async'),
    SportType = require ('../models/sportType'),
    Sport = require ('../models/sport');

/**
 * Public methods.
 */
module.exports.getSports = function (userName, callbackFn) {

    Sport.find({userName: userName}, callbackFn).populate('sportType');
};

module.exports.getActiveSports = function (userName, callbackFn) {

    Sport.find({userName: userName, active: true}, callbackFn).populate('sportType');
};

module.exports.createSports = function (sportsToCreate, callbackFn) {

    var loadSportTypeObjectOnSportTypeField = function(sportToCreate, callbackFn) {
        var sportTypeName = sportToCreate.sportType;
        
        SportType.find({userName: sportToCreate.userName, name: sportTypeName}, function(err, sportType){
            if (sportType && sportType.length>0) {
                sportToCreate.sportType = sportType[0]._doc;
            } else {
                sportToCreate.sport = sportTypeName;
            } 
            callbackFn();
        });
    };

    async.each(sportsToCreate, loadSportTypeObjectOnSportTypeField, function() {
        console.log ('Added sport type data for ' + sportsToCreate.length + ' sports.');
        Sport.insertMany(sportsToCreate, callbackFn);
    });
};

module.exports.setVirtualFields = function (sports, callbackFn) {
    var mapSportTypeNames = function(sport, callbackFn) {
        sport.sportTypeName = sport.sportType.name;
        callbackFn();
    };
    async.each(sports, mapSportTypeNames, callbackFn);
};