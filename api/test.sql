CREATE OR REPLACE
FUNCTION test_js_func() RETURNS text
AS $js$
  //import _max from 'lodash/max';
  import render from 'programm';


  const foo = render('atata')

  ret(foo);
$js$
LANGUAGE plv8
IMMUTABLE
STRICT;
