/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require ('mongoose'),
    hasher = require ('../auth/hasher'),
    MaterialType = require ('../models/materialType');

/**
 * Public methods.
 */
module.exports.getMaterialTypes = function (userName, callbackFn) {

    MaterialType.find({userName: userName}, callbackFn).populate('sport');
};

module.exports.getActiveMaterialTypes = function (userName, callbackFn) {

    MaterialType.find({userName: userName, active: true}, callbackFn);
};

module.exports.createMaterialTypes = function (materialTypesToCreate, callbackFn) {

    MaterialType.insertMany(materialTypesToCreate, callbackFn);
};