CREATE OR REPLACE
FUNCTION test_js_func() RETURNS text
AS
$js$
  {{ 'func' | loadFrom('test-js-func') }}

  return func();
$js$
LANGUAGE plv8
IMMUTABLE
STRICT;
