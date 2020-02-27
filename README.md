## TheWindLogger Server.

## Server side

Server side project implemented using:

- nodeJs
- express
- mongodb
- mongoose

Other used:

- gulp
- gulp-jshintnpm install
- nodemon
- underscore
ifconfig
___


**Database**: Mongo.

**Authorizing**: token authorization with (Username/Password).


___

#Install process:

-1 Clone repository:

    git clone https://github.com/ugeHidalgo/thewindloggerserver.git TheWindLoggerServer
    (This will clone the repository to a TheWindLoggerServer folder)

-2 Install:

    - Install mongodb downloading from http://www.mongodb.org if you one to use it locally
        Set path for databases with mongod --dbpath path

    - Install dependecies needed:
    ```
        cd TheWindLoggerServer
        cd server
        npm install
    ```

-3 Run:
    Launch mongoDB in a console:
    ```
        mongod
    </code>
    Launch server side with any of these options:
    ```
        - npm start
        - gulp
        - gulp default
        - gulp develop
    ```
    Access site to http://localhost:3000

-4 Debug server side with the debugger in visual studio code or with node inspector:
    ```
    node --inspect --debug .
    Copiar url y pegar en un browser.
    ```

-5 Remote Data base can also be used hosted in mLab (Need to change local db config to remote. See dbConfig.js to change it)



## Backup and restore

sudo mongodump --db mowizz --out /Users/ugeHidalgo/Documents/mowizz/backups/

sudo mongorestore --db mowizz --drop /Users/ugeHidalgo/Documents/mowizz/backups/mowizz

##NoReply email setup
https://stackoverflow.com/questions/19877246/nodemailer-with-gmail-and-nodejs#27160641