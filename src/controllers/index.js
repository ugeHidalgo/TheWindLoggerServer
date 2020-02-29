/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var homeController = require ('./homeController'),
    authController = require ('./authController'),
    userController = require ('./userController'),
    materialTypeController = require ('./materialTypeController'),
    spotController = require ('./spotController'),
    sportController = require ('./sportController');

module.exports.init = function (app){
    console.log('Main controller initialized');
    app.options('*', cors());

    homeController.init(app);
    authController.init(app);
    userController.init(app);
    materialTypeController.init(app);
    spotController.init(app);
    sportController.init(app);
};