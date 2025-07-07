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