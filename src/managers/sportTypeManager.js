/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require ('mongoose'),
    hasher = require ('../auth/hasher'),
    SportType = require ('../models/sportType');

/**
 * Public methods.
 */
module.exports.getSportTypes = function (userName, callbackFn) {

    SportType.find({userName: userName}, callbackFn);
};

module.exports.getActiveSportTypes = function (userName, callbackFn) {

    SportType.find({userName: userName, active: true}, callbackFn);
};

module.exports.createSportTypes = function (sportTypesToCreate, callbackFn) {

    SportType.insertMany(sportTypesToCreate, callbackFn);
};