"use strict";

const assert = require('assert');
const pgp = require('pg-promise')();
const pgDeploy = require('../');

const db = pgp(process.env.DB_CONNECTION);

describe('example', () => {
    before(() => {
        return Promise.resolve()
            .then(() => pgDeploy.dropLocalDb())
            .then(() => pgDeploy.createLocalDb())
    });

    before(() => pgDeploy.deploy().catch(err => console.error('You had an error: ', err[0].result.stack)));

    it('ok', () => {
        return db
            .func('test_js_func')
            .then(res => console.log(res))

    });
});
