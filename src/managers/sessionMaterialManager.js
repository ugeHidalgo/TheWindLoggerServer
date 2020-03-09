/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var async = require ('async'),
    SessionMaterial = require ('../models/sessionMaterial'),
    Session = require ('../models/session'),
    Material = require ('../models/material');

/**
 * Public methods.
 */
module.exports.getSessionMaterials = function (userName, sessionId, callbackFn) {

    SessionMaterial.find({userName: userName, 'session._id': sessionId}, callbackFn).populate('material');
};

module.exports.createSessionMaterials = function (dataToCreate, callbackFn) {

    var loadObjectFields = function(dataToCreate, callbackFn) {
        var sessionName = dataToCreate.session,
            materialName = dataToCreate.material,
            userName = dataToCreate.userName;
        
        async.parallel([
            function(callbackFn){
                Session.find({userName: userName, name: sessionName}, function(err, session){
                    if (session && session.length > 0) {
                        dataToCreate.session = session[0]._doc;
                    } else {
                        dataToCreate.session = sessionName;
                    } 
                    callbackFn();
                });
            }, 
            function(callbackFn){
                Material.find({userName: userName, name: materialName}, function(err, material){
                    if (material && material.length > 0) {
                        dataToCreate.material = material[0]._doc;
                    } else {
                        dataToCreate.material = materialName;
                    } 
                    callbackFn();
                });
            }],
            function done (err) {
                if (err) {
                    throw err;
                }
                callbackFn();
            });
    };

    async.each(dataToCreate, loadObjectFields, function() {
        console.log ('Added session and material data for ' + dataToCreate.length + ' session materials.');
        SessionMaterial.insertMany(dataToCreate, callbackFn);
    });
};