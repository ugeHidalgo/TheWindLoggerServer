/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var mongoose = require ('mongoose'),
    hasher = require ('../auth/hasher'),
    Sport = require ('../models/sport'),
    async = require ('async'),
    MaterialType = require ('../models/materialType');

/**
 * Public methods.
 */
module.exports.getMaterialTypes = function (userName, callbackFn) {

    MaterialType
        .find({userName: userName}, callbackFn)
        .sort({name: 'asc'})
        .populate('sport');
};

module.exports.getActiveMaterialTypes = function (userName, callbackFn) {

    MaterialType
        .find({userName: userName, active: true}, callbackFn)
        .sort({name: 'asc'})
        .populate('sport');;
};

module.exports.createMaterialTypes = function (materialTypesToCreate, callbackFn) {

    var loadSportObjectOnSportField = function(materialTypeToCreate, callbackFn) {
        var sportName = materialTypeToCreate.sport;
        
        Sport.find({userName: materialTypeToCreate.userName, name: sportName}, function(err, sport){
            if (sport && sport.length>0) {
                materialTypeToCreate.sport = sport[0]._doc;
            } else {
                materialTypeToCreate.sport = sportName;
                console.log(`Sport ${sportName} not found.`);
            } 
            callbackFn();
        });
    };

    async.each(materialTypesToCreate, loadSportObjectOnSportField, function() {
        console.log ('Added sport data for ' + materialTypesToCreate.length + ' material types.');
        MaterialType.insertMany(materialTypesToCreate, callbackFn);
    });
};