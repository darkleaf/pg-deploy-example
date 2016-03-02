create or replace function
  put(id int, type varchar(32), data jsonb) returns void as
$js$
  {{ 'put' | loadFrom('put') }}
  put(plv8, id, type, data);
$js$
language plv8;

create or replace function
  get(query jsonb) returns table(id int, type varchar(32), data jsonb) as
$js$
  {{ 'get' | loadFrom('get') }}
  return get(plv8, query);
$js$
language plv8;
