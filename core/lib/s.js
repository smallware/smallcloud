
'use strict';

var _        = require('lodash');
var co       = require('co');
var logger   = require('./util/logger.js');


var store = {
  api: {},
  srv: {},
  reg: {},
  core: {
    log: logger,
    ses: {}
  }
};

var register = {
  srv: function(srv){
    srv.forEach(function(_srv){
      store.srv[_srv.id] = _srv;
      store.reg[_srv.id] = Object.keys(_srv.manifest.dependencies);
    });
  },
  api: function(srv, api){
    store.api[srv.id] = api;
  }
};


var s = {

  core: store.core,

  reg: function(type, srv, api){
    register[type](srv, api);
  },

  ctx: function(srv){

    var apis = _.reduce(store.reg[srv.id], function(out, srvId){
      out[srvId] = store.api[srvId];
      return out;
    }, {});

    return _.assign({}, store.core, apis);
  },

  thener: function(i, api){

    // Register defined api
    if( api ) this.reg('api', this.services[i - 1], api);

    // More services to initialize?
    if( i < this.services.length ){

      try{ // Invoke init runner
        this.runner(i);
      }catch(e){
        this.reject(e)
      }
    }else{
      this.core.log('info', 'SmallCloud is ready');
      this.resolve(s);
    }
  },

  runner: function(i){

    // Defaults
    i = i || 0;

    // Grow context
    _.assign(this, s);

    // Run generator
    co(this.services[i].init.bind(
      _.omit(this.services[i], ['init', 'manifest', 'active', 'activable']),
      this.ctx(this.services[i])
    )).then(this.thener.bind(this, i + 1))
      .catch(this.reject);
  }
};

module.exports = s;