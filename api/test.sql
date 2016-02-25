CREATE OR REPLACE
FUNCTION test_js_func() RETURNS text
AS $js$
  import _map from 'lodash-es/map';

  const foo = _map([1, 2, 3], x => x + 1)



//plv8.elog(INFO, 'atata')



  //foo = 1;

  ret(JSON.stringify(foo));
$js$
LANGUAGE plv8
IMMUTABLE
STRICT;
