import * as types from 'types';
import R from 'ramda';
//{
//    user: {
//        emailEq: 'email@email.com'
//    }
//}

function buildSQL(query) {
    R.pipe(
        R.toPairs(query),
        R.map(R.__, ([type, filter]) => ``)
    )
}

export default function get(plv8, query) {

    buildSQL(query)

    const res = plv8.execute('select id, type, data from entities where id = $1', [1]);
    return res;
}