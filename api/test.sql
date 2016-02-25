CREATE OR REPLACE
FUNCTION test_js_func() RETURNS text
AS $js$
  import Imm from 'immutable';

  const foo = Imm.fromJS({foo: 'bar'})

  ret(JSON.stringify(foo.toJS()));
$js$
LANGUAGE plv8
IMMUTABLE
STRICT;
