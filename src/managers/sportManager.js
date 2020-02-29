/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require ('mongoose'),
    hasher = require ('../auth/hasher'),
    Sport = require ('../models/sport');

/**
 * Public methods.
 */
module.exports.getSports = function (userName, callbackFn) {

    Sport.find({userName: userName}, callbackFn);
};

module.exports.getActiveSports = function (userName, callbackFn) {

    Sport.find({userName: userName, active: true}, callbackFn);
};

module.exports.createSports = function (sportsToCreate, callbackFn) {

    Sport.insertMany(sportsToCreate, callbackFn);
};