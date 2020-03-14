/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var url = require ('url'),
    rootUrl = '/api/sessionmaterials',
    importUrl = rootUrl + '/import',
    errorMessage = 'SessionMaterial controller returns an error (400).',
    sessionMaterialManager = require('../managers/sessionMaterialManager'),
    auth = require ('../auth/authMiddleware');

/**
 * Public methods.
 */
module.exports.init = function (app) {
    app.post (importUrl, auth.isUserAuthenticated, function (req, res, next) {
        // By name: (POST)http:localhost:3000/api/sessionmaterials/import   Session materials in payload 
        var dataToCreate =  req.body;
        
        sessionMaterialManager.importSessionMaterials ( dataToCreate, function(error, data){
            if (error){
                console.log(errorMessage);
                res.status(400).send(error);
            } else {
                res.set('Content-Type','application/json');
                console.log(`SessionMaterial controller imported ${data.length} session materials successfully.`);
                res.status(200).send(data);
            }
        });
    });

    app.get (rootUrl, auth.isUserAuthenticated, function (req, res, next) {
        // By name: (GET)http:localhost:3000/api/sessionmaterials/?username=pepe&id=a_session_id 
        var queryString = url.parse(req.url, true).query,
            userName = queryString.username,
            id = queryString.id;

        if (userName) {
            getUserSessionMaterials(userName, id, res);
        }
    });

    console.log('SessionMaterial controller initialized');
};

/**
 * Private methods.
 */
function getUserSessionMaterials(userName, id, res) {
    var message;

    sessionMaterialManager.getSessionMaterials (userName, id, function(error, data){
        if (error){
            console.log(errorMessage);
            res.status(400).send(error);
        } else {
            message = `SessionMaterial controller returns ${data.length} session materials for session "${id}" successfully.`;
            returnData(data, res, message);
        }
    });
}

function returnData(data, res, message) {
    console.log(message);
    res.set('Content-Type','application/json');
    res.status(200).send(data);
}