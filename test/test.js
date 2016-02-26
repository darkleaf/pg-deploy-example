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

    before(() => pgDeploy.deploy());

    it('ok', () => {
        return db
            .func('test_js_func')
            .then(res => console.log(res))

    });
});
