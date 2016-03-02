export default function get(plv8, id) {
    const res = plv8.execute('select data from entities where id = $1 limit 1', [id]);
    return JSON.stringify(res[0].data);
}