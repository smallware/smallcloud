
var _          = require('lodash');
var init       = require('./init');
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
               .map(init.process);

// Start services up
var activeSrvs = init.startup(services);




// XXX
module.exports = {
  services: services,
  actives: activeSrvs
};
