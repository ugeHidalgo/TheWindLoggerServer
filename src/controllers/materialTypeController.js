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
        var materialTypesToCreate =  req.body;
        
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

    app.get ('/api/materialtypes', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (GET)http:localhost:3000/api/materialtypes/?username=pepe&active=true 
        var queryString = url.parse(req.url, true).query,
            userName = queryString.username,
            active = queryString.active;

        if (userName) {
            if (active) {
                getActiveUserMaterialTypes(userName, res);
            } else {
                getUserMaterialTypes(userName, res);
            }
        }
    });

    console.log('Material Type controller initialized');
};

/**
 * Private methods.
 */
function getUserMaterialTypes(userName, res) {

    materialTypeManager.getMaterialTypes (userName, function(error, data){
        if (error){
            console.log('MaterialTypes controller returns an error (400).');
            res.status(400).send(error);
        } else {
            console.log(`MaterialTypes controller returns ${data.length} MaterialTypes for user "${userName}" successfully.`);
            res.set('Content-Type','application/json');
            res.status(200).send(data);
        }
    });
}

function getActiveUserMaterialTypes(userName, res) {

    materialTypeManager.getActiveMaterialTypes (userName, function(error, data){
        if (error){
            console.log('MaterialTypes controller returns an error (400)');
            res.status(400).send(error);
        } else {
            console.log(`MaterialTypes controller returns ${data.length} active MaterialTypes for user "${userName}" successfully.`);
            res.set('Content-Type','application/json');
            res.status(200).send(data);
        }
    });
}
