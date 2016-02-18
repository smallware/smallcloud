
var _          = require('lodash');
var path       = require('path');
var requireAll = require('require-all');
var tests      = requireAll(path.resolve(__dirname, './tests'));


// Runner
function runner(tests){
  _.forEach(tests, function(test){
    if( _.isFunction(test) )
      test();
    else
      runner(test);
  });
}


describe('SmallCloud unit tests', function(){

  // Run the tests!
  runner(tests);

});