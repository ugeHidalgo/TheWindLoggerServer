/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var homeController = require ('./homeController'),
    authController = require ('./authController'),
    userController = require ('./userController'),
    sessionController = require ('./sessionController'),
    sessionMaterialController = require ('./sessionMaterialController'),
    materialTypeController = require ('./materialTypeController'),
    materialController = require ('./materialController'),
    spotController = require ('./spotController'),
    sportTypeController = require ('./sportTypeController'),
    sportController = require ('./sportController');

module.exports.init = function (app){
    console.log('Main controller initialized');
    
    homeController.init(app);
    authController.init(app);
    userController.init(app);
    sessionController.init(app);
    sessionMaterialController.init(app);
    materialTypeController.init(app);
    materialController.init(app);
    spotController.init(app);
    sportController.init(app);
    sportTypeController.init(app);
};