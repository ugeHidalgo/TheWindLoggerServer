/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var url = require ('url'),
    materialTypeManager = require('../managers/materialTypeManager'),
    auth = require ('../auth/authMiddleware');

/**
 * Public methods.
 */
module.exports.init = function (app) {
    app.post ('/api/materialtypes', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/materialtypes   materialtypes in payload 
        var materialTypesToCreate =  request.body;
        
        materialTypeManager.createMaterialTypes ( materialTypesToCreate, function(error, materialTypes){
            if (error){
                console.log('MaterialType controller returns an error (400)');
                res.status(400).send(error);
            } else {
                res.set('Content-Type','application/json');
                console.log(`MaterialTypes controller created ${materialTypes.length} material types successfully.`);
                res.status(200).send(materialTypes);
            }
        });
    });

    console.log('Material Type controller initialized');
};
