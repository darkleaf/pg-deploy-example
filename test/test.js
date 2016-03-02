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

    it('test_js_func', () => {
        return db
            .func('test_js_func')
            .then(rows => rows[0].test_js_func)
            .then(res => assert.equal(res, 10))
    });

    it('put and get', () => {
        const id = 1;
        const data = { some: 'data' };

        return db.func('put', [id, data])
            .then(() => db.func('get', [id]))
            .then(rows => rows[0].get)
            .then(res => assert.deepEqual(res, data))
    });
});
