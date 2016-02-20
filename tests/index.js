'use strict';

var _          = require('lodash');
var path       = require('path');
var requireAll = require('require-all');
var units      = requireAll(path.resolve(__dirname, './units'));


// Runner
function runner(_units){
  _.forEach(_units, function(test){
    if( _.isFunction(test) )
      test();
    else
      runner(test);
  });
}


describe('SmallCloud unit tests', function(){

  // Run the tests!
  runner(units);

});