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
module.exports.createMaterialTypes = function (materialTypesToCreate, callbackFn) {

    MaterialType.insertMany(materialTypesToCreate, callbackFn);
};