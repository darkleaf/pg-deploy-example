CREATE OR REPLACE
FUNCTION test_js_func() RETURNS int
AS
$js$
  {{ 'func' | loadFrom('test-js-func') }}

  return func();
$js$
LANGUAGE plv8
IMMUTABLE
STRICT;
