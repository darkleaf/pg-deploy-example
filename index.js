"use strict";

require('dotenv').load();
const PgDeploy = require('pg-deploy');

module.exports = new PgDeploy({
    connectionString: process.env.DB_CONNECTION,
    beforeScripts: ['api/*.sql'],
    migrations: ['migrations/*.sql']
});
