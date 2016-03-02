create or replace function
  put(id int, data jsonb) returns void as
$js$
  {{ 'put' | loadFrom('put') }}
  put(plv8, id, data);
$js$
language plv8;

create or replace function
  get(id int) returns jsonb as
$js$
  {{ 'get' | loadFrom('get') }}
  return get(plv8, id);
$js$
language plv8;
