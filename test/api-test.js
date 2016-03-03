"use strict";

import assert from 'assert';
import PgPromise from 'pg-promise';
import pgDeploy from '../';

const pgp = PgPromise();
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
        const data = { email: 'email@email.com' };
        const type = 'user';

        return db.func('put', [id, type, data])
            .then(() => db.func('get', [{user: { emailEq: 'email@email.com' }}]))
            .then(rows => assert.equal(rows.length, 1))
            .then(() => db.func('get', [{user: { emailEq: 'unknown@email.com' }}]))
            .then(rows => assert.equal(rows.length, 0))
    });
});
