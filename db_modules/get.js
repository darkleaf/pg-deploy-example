import * as types from 'types';
import queryBuilder from 'query-builder';

export default function get(plv8, query) {
    const sql = queryBuilder(types, query);

    const res = plv8.execute(sql);

    return res;
}