"use strict";

import assert from 'assert';
import queryBuilder from '../db_modules/query-builder';

const types = {
    user: {
        filters: {
            emailEq(email) {
                return {
                    condition: `entity.data->'email' = '${email}'`
                }
            }
        }
    }
};

describe('queryBuilder', () => {
    it('correct', () => {
        const query = {
            user: { emailEq: "some@email.com" }
        };
        const actual = `select entities.id, entities.type, entities.data from entities where (entities.type = 'user' and entity.data->'email' = 'some@email.com')`;
        const given = queryBuilder(types, query);
        assert.equal(given, actual);
    });
});
