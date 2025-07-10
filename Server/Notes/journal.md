CONFIGURE SERVER AND DATABASE

1. Setting up and installing module
    - npm init -y
    - npm i express
    - npm i pg
    - npm i sequelize
    - npm i dotenv
    - npm i --save-dev sequelize-cli
    - npx sequelize-cli init

2. Setting config/config.json
    > change config.json to config.js
    > change the code inside become js language and implement .env to hide credential things like password etc

        require('dotenv').config(); // ini buat load .env

            module.exports = {
            development: {
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                host: process.env.DB_HOST,
                dialect: "mysql"
            },
            test: {
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME_TEST,
                host: process.env.DB_HOST,
                dialect: "mysql"
            },
            production: {
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME_PROD,
                host: process.env.DB_HOST,
                dialect: "mysql"
            }
        };

    > create file at root to replace config.json to config.js
    > touch .sequelizerc
    > put code on .sequelizerc:

        const path = require('path');

            module.exports = {
                config: path.resolve('config', 'config.js'),
                'models-path': path.resolve('models'),
                'seeders-path': path.resolve('seeders'),
                'migrations-path': path.resolve('migrations')
            };

3. Create your Data Base
    > npx sequelize db:create

4. Create you Models
    > see at migrationsSceleton

5. Setting again your association FK reference in migration

6. Setting your association between models, and stup models validate

7. Indexing on field you usually use for querry

8. Create your table:
    > npx sequelize-cli db:migrate

SETUP EXPRESS JS

1. Create root app file
    > mkdir routes
        > index.js
        > touch userRouter.js
        > touch profileRouter.js
        > ... etc
    > mkdir controllers
        > userController.js
        > profileController.js
        > ... etc
    > touch app.js
        > initiation express, app, and route

2. create all controllers static and integrate with routes
    > create all controllers static
    > integrate with routes 

3. setUp helpers
    > mkdir helper
        > create javascript file, containing bcrypt function
        > create javasript file for errorHandler

4. Finish Register
    > create hooks before create for hashing password before insert to database
    > create register functions

5. Create test with jest and supertest
    > npm install --save-dev jest supertest
    > npm init jest@latest
        > answer the question based on your need, no need coverage
    > mkdir test
        > user.test.js
6. Finish test post register

7. Finish hashPassword function test
    >  touch hashPassword.test.js

8. Test function for JWT create Token
    > touch jwt.js in helper
        > create the function
    > Describe function and test the function

9. Create test skeleton for post Login
    > describe post login in user.test.js
        > create all possible test and expect

10. crete test skeleton to get user and finis getuser
    > describe get user
        > Create all possible test and expect
            > finish function get user

11. finish tetsting post change-email
12. Finish testing post change-password
13. adding more testing to change-email and change-password
    > adding decreasing update_token testing every success update
14. adding more end point for change-username
15. finish teting api chance username
16. adding end point for is verified
17. finish all user role end ponit and testing
18.