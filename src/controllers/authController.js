/*jslint node: true */
'use strict';

/**
 * Module dependencies.
 */
var url = require ('url'),
    config = require('../../config/config'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    userManager = require('../managers/userManager'),
    auth = require ('../auth/authMiddleware'),

    transporter = nodemailer.createTransport(smtpTransport({
        service: config.recoveryMail.service,
        host: config.recoveryMail.host,
        port: config.recoveryMail.port,
        secure: config.recoveryMail.secure,
        auth: {
            user: config.recoveryMail.user,
            pass: config.recoveryMail.pass
        }
    })),

    mailOptions = {
        from: config.recoveryMail.user,
        to: 'ugehidalgo@gmail.com',
        subject: config.recoveryMail.subject,
        text: 'Usa el siguiente enlace para recuperar tu cuenta: '
    };

/**
 * Public methods.
 */
module.exports.init = function (app) {

    // Send a password recovery mail to the user.
    // (POST)http:localhost:3000/api/users/userrecover body: {username: 'a name', eMail:'pop@pop.es'}
    app.post('/api/users/userrecover', function(request, response, next){

        var userToRecover =  request.body.userName,
            mailToRecover = request.body.eMail,
            userPass = '';

        userManager.getUserByExactUserName(userToRecover, function (error, users) {
            if (!error) {
                if (users.length === 0) {
                    console.log('Recover password: Unknown Username. No mail was sent.')
                    response.status(201).send(true);
                } else if (users[0].eMail === mailToRecover) {
                    userPass = users[0].password;
                    sendMailToRecover(response, userToRecover, userPass);
                } else  {
                    console.log('Recover password: Bad email for username to recover. No mail was sent.')
                    response.status(201).send(true);
                }
            }
        });
    });

    // Updates an user password.
    // (POST)http:localhost:3000/api/users/username body: {hashedPassword: '...', newPassword: '...'}
    app.post('/api/users/:username', function(request, response, next){

        var username = request.params.username,
            hashedPassword = request.body.hashedPassword,
            password =  request.body.newPassword;

        userManager.updateUserPassword (username, hashedPassword, password, function(error, wasUpdated){
                if (error){
                    console.log('Failed to update username password: ' + error);
                    response.status(400).send(false);
                } else {
                    if (wasUpdated) {
                        response.set('Content-Type','application/json');
                        response.status(201).send(true);
                    } else {
                        console.log('Failed to update username password: Hashed password not valid.');
                        response.status(201).send(false);
                    }
                }
            });
    });

    // Register a new user.
    // (POST)http:localhost:3000/api/user body: {firstName: 'a name', username:'ugeHidalgo', ...}
    app.post('/api/users', function(request, response, next){

        var userToUpdate =  request.body;

        userManager.updateUser ( userToUpdate, function(error, updatedUser){
             if (error){
                response.status(400).send('Failed to save user: ' + error);
            } else {
                response.set('Content-Type','application/json');
                response.status(201).send(updatedUser);
             }
        });
    });

    // Verify if an username is in use
    // (GET)http:localhost:3000/api/auth/isusedusername/?username=pepe
    app.get('/api/users/auth/isusedusername', function(req, res, next){

        var queryString = url.parse(req.url, true).query,
            username = queryString.username;

        auth.isUsedUsername ( username, function(error, result){
             if (error){
                res.status(400).send('There was an error trying to veriy if "' + username + '" is in use.');
            } else {
                console.log('Verified if username "' + username + '" is already used: ' + result);
                res.set('Content-Type','application/json');
                res.status(201).send(result);
            }
        });
    });

    // Verify if an user can access
    // (POST)http:localhost:3000/api/auth body: {username: 'a user name', password:'a password'}
    app.post('/api/users/auth/login', function(req, res, next){

        var userData =  req.body;

        auth.authenticateUser ( userData, function(error, loginResult){
             if (error){
                res.status(400).send(loginResult.message + loginResult.userName);
            } else {
                if (loginResult.success) {
                    res.set('Content-Type','application/json');
                    res.status(201).send(loginResult);
                }
                else {
                    res.status(401).send(loginResult.message) //send(loginResult.message);
                }
             }
        });
    });

    console.log('Auth controller initialized');

    /**
     * Private methods.
     */
    function sendMailToRecover (response, userToRecover, userPass) {

        mailOptions.text += prepareRecoveryUrl(userToRecover, userPass);

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              response.status(400).send(false);
            } else {
              console.log('Recover password: Email sent to : ' + userToRecover + '. Info:' + info.response);
              response.set('Content-Type','text/html');
              response.status(201).send(true);
            }
          });
    }

    function prepareRecoveryUrl (userToRecover, userPass) {
        var url = config.recoveryMail.recoveryUrl;

        if (userToRecover !== '') {
            url += userToRecover + '/' + userPass;
        } else {

        }

        return url;
    }
};