/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require ('mongoose'),
    hasher = require ('../auth/hasher'),
    Spot = require ('../models/spot');

/**
 * Public methods.
 */
module.exports.getSpots = function (userName, callbackFn) {

    Spot
        .find({userName: userName}, callbackFn)
        .sort({name: 'asc'});
};

module.exports.getActiveSpots = function (userName, callbackFn) {

    Spot
        .find({userName: userName, active: true}, callbackFn)
        .sort({name: 'asc'});
};

module.exports.createSpots = function (spotsToCreate, callbackFn) {

    Spot.insertMany(spotsToCreate, callbackFn);
};