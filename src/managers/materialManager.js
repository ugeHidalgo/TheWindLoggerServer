/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var async = require ('async'),
    Material = require ('../models/material'),
    MaterialType = require ('../models/materialType');

/**
 * Public methods.
 */
module.exports.getMaterials = function (userName, callbackFn) {

    Material.find({userName: userName}, callbackFn).populate('materialType');
};

module.exports.getActiveMaterials = function (userName, callbackFn) {

    Material.find({userName: userName, active: true}, callbackFn).populate('materialType');
};

module.exports.createMaterials = function (materialsToCreate, callbackFn) {

    var loadMaterialTypeObjectOnMaterialTypeField = function(materialToCreate, callbackFn) {
        var materialTypeName = materialToCreate.materialType;
        
        MaterialType.find({userName: materialToCreate.userName, name: materialTypeName}, function(err, materialType){
            if (materialType && materialType.length>0) {
                materialToCreate.materialType = materialType[0]._doc;
            } else {
                materialToCreate.materialType = materialTypeName;
            } 
            callbackFn();
        });
    };

    async.each(materialsToCreate, loadMaterialTypeObjectOnMaterialTypeField, function() {
        console.log ('Added material type data for ' + materialsToCreate.length + ' materials.');
        Material.insertMany(materialsToCreate, callbackFn);
    });
};