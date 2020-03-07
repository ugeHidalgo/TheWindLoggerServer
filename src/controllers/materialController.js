/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var url = require ('url'),
    errorMessage = 'Material controller returns an error (400).',
    materialManager = require('../managers/materialManager'),
    auth = require ('../auth/authMiddleware');

/**
 * Public methods.
 */
module.exports.init = function (app) {
    app.post ('/api/materials', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/materials   materials in payload 
        var materialsToCreate =  req.body;
        
        materialManager.createMaterials ( materialsToCreate, function(error, materials){
            if (error){
                console.log(errorMessage);
                res.status(400).send(error);
            } else {
                res.set('Content-Type','application/json');
                console.log(`Material controller created ${materials.length} materials successfully.`);
                res.status(200).send(materials);
            }
        });
    });

    app.get ('/api/materials', auth.isUserAuthenticated, function (req, res, next) {
        // By name: (GET)http:localhost:3000/api/materials/?username=pepe&active=true 
        var queryString = url.parse(req.url, true).query,
            userName = queryString.username,
            active = queryString.active;

        if (userName) {
            if (active) {
                getActiveUserMaterials(userName, res);
            } else {
                getUserMaterials(userName, res);
            }
        }
    });

    console.log('Material controller initialized');
};

/**
 * Private methods.
 */
function getUserMaterials(userName, res) {
    var message;

    materialManager.getMaterials (userName, function(error, data){
        if (error){
            console.log(errorMessage);
            res.status(400).send(error);
        } else {
            message = `Material controller returns ${data.length} materials for user "${userName}" successfully.`;
            returnData(data, res, message);
        }
    });
}

function getActiveUserMaterials(userName, res) {
    var message;

    materialManager.getActiveMaterials (userName, function(error, data){
        if (error){
            console.log('Material controller returns an error (400)');
            res.status(400).send(error);
        } else {
            message = `Material controller returns ${data.length} active materials for user "${userName}" successfully.`;
            returnData(data, res, message);
        }
    });
}

function returnData(data, res, message) {
    materialManager.setVirtualFields(data, function(){
        console.log(message);
        res.set('Content-Type','application/json');
        res.status(200).send(data);
    });
}

