export default function put(plv8, id, type, data) {
    plv8.execute('insert into entities values ($1, $2, $3)', [id, type, data]);
}