'use strict';

var _          = require('lodash');
var init       = require('./lib/init');
var path       = require('path');
var requireAll = require('require-all');

// Core and custom services paths
var srvPaths = {
  core: path.resolve(__dirname, './services'),
  custom: path.resolve(__dirname, '../services')
};


// Get service candidates
var srvCandidates = _.assign({}, requireAll(srvPaths.core, srvPaths.custom));


// Load services
var services = _.reduce(srvCandidates, init.validate, [])
               .map(init.process).reduce(init.queue, []);


// Run init scripts
init.run(services).then(function(_services){
  console.log('\n[DUMP]', _services);
}).catch(function(e){
  console.log(e.stack);
});




// XXX
module.exports = {
  services: services
};
