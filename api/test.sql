CREATE OR REPLACE
FUNCTION test_js_func() RETURNS text
AS
$js_template$
  {{ 'func' | loadFrom('test-js-func') }}

  return func();
$js_template$
LANGUAGE plv8
IMMUTABLE
STRICT;
