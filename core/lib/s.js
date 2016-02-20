
var _        = require('lodash');
var logger   = require('./util/logger.js');


var store = {
  api: {},
  srv: {},
  reg: {},
  all: {
    log: logger
  }
};

var register = {
  services: function(srv){
    srv.forEach(function(_srv){
      store.srv[_srv.id] = _srv;
      store.reg[_srv.id] = Object.keys(_srv.manifest.dependencies);
    });
  },
  api: function(srv, api){
    store.api[srv.id] = api;
  }
};


module.exports = {

  register: function(srv, api){

    // XXX
    //console.log('\n>>>', arguments);
    console.log('\n[REGISTER] SRV', srv.id);
    //console.log('API', api);
    //console.log('[R] DEP', srv.manifest.dependencies);


    store.srv[srv.id] = srv;
    store.api[srv.id] = api;
    store.reg[srv.id] = Object.keys(srv.manifest.dependencies);

    // XXX
    //console.log('[R] S REG', store.registry);
    //console.log('[R] S API', store.api);
  },

  reg: function(type, srv, api){
    console.log('S.reg', type, srv.id);
    register[type](srv, api);
  },

  //regSrv: function(srv){
  //
  //  if( _.isArray(srv) ){
  //    srv.forEach(function(_srv){
  //      store.srv[_srv.id] = _srv;
  //      store.reg[_srv.id] = Object.keys(_srv.manifest.dependencies);
  //    });
  //  }else{
  //    store.srv[srv.id] = srv;
  //    store.reg[srv.id] = Object.keys(srv.manifest.dependencies);
  //  }
  //},
  //
  //regApi: function(srv, api){
  //  store.api[srv.id] = api;
  //},

  ctx: function(srv){

    // XXX
    console.log('--- [CONTEXT]', srv.id, 'registry:', store.reg[srv.id]);

    var apis = _.reduce(store.reg[srv.id], function(out, srvId){
      console.log('--- [C] Store', store.api);
      out[srvId] = store.api[srvId];
      return out;
    }, {});

    // XXX
    console.log('--- [C] APIS', apis);

    return _.assign({}, store.all, apis);
  },

  common: store.common
};