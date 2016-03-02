export default function put(plv8, id, data) {
    plv8.execute('insert into entities values ($1, $2)', [id, data]);
}