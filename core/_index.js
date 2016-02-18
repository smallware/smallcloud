
var _             = require('lodash');
var co            = require('co');
var path          = require('path');
//var Proxy         = require('harmony-proxy');
var logger        = require('./lib/util/logger');
var callerId      = require('caller-id');
var Bluebird      = require('bluebird');
var requireAll    = require('require-all');
var EventEmitter2 = require('eventemitter2').EventEmitter2;


var _components = {
  srv: {},
  res: {}
};

var _facade = {};

var _dispatcher = function(component){

  // Empty path?
  if( undefined === component )
    return Object.keys(_components[this.type]);

  // XXX
  console.log('>>>', this);

  // Component exists?
  if( !(component in _components[this.type]) )
    return undefined;

  return _components[this.type][component];
};

var setup = {

  facade: function setupFacade(key, value){

    // Freeze?
    value = _.isPlainObject(value)? Object.freeze(value) : value;

    // Define protected
    Object.defineProperty(_facade, key, {
      configurable: false,
      enumerable:   true,
      writable:     false,
      value:        value
    });
  },

  config: function setupConfig(){
    var config = requireAll(path.resolve(__dirname, '../config'));
    return Object.freeze(config);
  },

  logger: function setupLogger(){
    return function(){
      if( _facade.conf.log.silent )
        logger.apply({}, arguments);
    };
  },

  signals: function setupSignals(){
    var emitter = new EventEmitter2(_facade.config.signal);
    return Object.freeze(emitter);
  },

  registrer: function setupRegistrer(){
    return function registerComponent(type, name, component){

      // Type exists?
      if( !(type in _components) )
        return null;

      // Component exists?
      if( name in _components[type] )
        return null;

      // Is core calling?
      if( !_util.validate.isCore(callerId.getData()) )
        return null;

      // Register
      _.set(_components[type], name, Object.freeze(component));

      // Emit registration signal
      _facade.signal.emit('core.register.'+type, name);
    }
  },

  dispatcher: {
    service: function(){
      return _dispatcher.bind({type: 'srv'});
    },
    resource: function(){
      return _dispatcher.bind({type: 'res'});
    }
  }
};

var _util = {
  validate: {
    isCore: function valIsCoreFile(callerData){

      // Get installation path
      var installPath = path.resolve(__dirname, '../');

      // Is call coming from core?
      var fromCore = (-1 !== callerData.filePath.search(installPath + '/core'));

      // Is call coming from testing?
      var fromTests = (-1 !== callerData.filePath.search(installPath + '/test'));

      // TODO
      //return ( fromCore || fromTests );
      return true;
    }
  }
};

module.exports = function(params){

  // Register config facade
  setup.facade('config', setup.config());

  // Register log facade shorthand
  setup.facade('log', setup.logger());

  // Register signal facade
  setup.facade('signal', setup.signals());

  // Register component registrer
  setup.facade('register', setup.registrer());

  // Register service dispatcher
  setup.facade('srv', setup.dispatcher.service());

  // Register resource dispatcher
  setup.facade('res', setup.dispatcher.resource());

  return _facade;

};







//
////var _protected = {};
//
//var __public = {
//  srv:      {numse: {en: 'ass', es: 'culo'}},
//  res:      {},
//
//  config: (function(){
//    var config = requireAll(path.resolve(__dirname, '../config'));
//    return Object.freeze(config);
//  })(),
//
//  signal: (function(){
//
//    var emitter = new EventEmitter2({
//      wildcard:     true,
//      delimiter:    '.',
//      newListener:  false,
//      maxListeners: 20
//    });
//
//    return Object.freeze(emitter);
//  })(),
//
//  register: function(type, name, component){
//
//    // Validate type
//    if( !(type in this) )
//      return null;
//
//    // Validate registration
//    if( !_util.validate.apply(callerId.getData(), arguments) )
//      return null;
//
//    // Define protected property
//    _util.def(this[type], name, component);
//
//    // Signal component registration
//    _public.signal.emit('core.register.'+type, name);
//
//    // Done
//    return component;
//  }
//};
//
//var __proxy = {
//  get: function(_public, key){
//
//    console.log('\n>>> CALLER:', callerId.getData());
//
//    // XXX
//    console.log('\n>>>', key);
//
//    if(key in _public)
//      return _public[key];
//    //else{
//    //  return undefined;
//    //}
//  },
//  set: function(){
//    console.error( new Error('Use S.register() to add component to S-Object') );
//  }
//};
//
//var __util = {
//
//  def: function(target, key, value){
//
//    // Freeze?
//    value = _.isPlainObject(value)? Object.freeze(value) : value;
//
//    // Define protected
//    Object.defineProperty(target, key, {
//      configurable: false,
//      enumerable:   true,
//      writable:     false,
//      value:        value
//    });
//  },
//
//  validate: function(type, name, component){
//
//    // Service exists?
//    if( name in _public[type] )
//      return false;
//
//    // Validate caller
//    if( !_util.caller.isCore(this.filePath) )
//      return false;
//
//    // Valid
//    return true;
//  },
//
//  caller: {
//    isCore: function(filePath){
//
//      // Get installation path
//      var installPath = path.resolve(__dirname, '../');
//
//      // Is call coming from core?
//      var fromCore = (-1 !== filePath.search(installPath + '/core'));
//
//      // Is call coming from testing?
//      var fromTests = (-1 !== filePath.search(installPath + '/test'));
//
//      return ( fromCore || fromTests );
//    },
//    isService: function(){},
//    isResource: function(){}
//  }
//};

// Setup global core object && export
//module.exports = new Proxy(_public, _proxy);














//var contexts = {
//  core: {},
//  service: {},
//  resource: {}
//};
//
//var core = {
//  privates: {},
//  protecteds: {},
//  publics: {
//    run: function(fn, args){
//      return fn.call({}, args);
//    }
//  }
//};
//
//var facade = {
//
//};
//
//
//var build = {
//
//  core: function(){
//
//    return {
//      signal: new EventEmitter2({
//        wildcard:     true,
//        delimiter:    '.',
//        newListener:  false,
//        maxListeners: 20
//      }),
//      config: {}
//    };
//  },
//
//  coreCtx: function(){
//
//    return {
//      log: function(){
//        core.signal('core.log', arguments);
//      },
//      set: function(comp, value){
//        _.set(coreCtx, comp, value);
//      }
//    };
//
//  }
//};

//
//module.exports = function(params){
//
//
//  var coreObs = {
//    get: function(coreCtx, srvName){
//
//      //console.log('\n>>> root:', coreCtx);
//      //console.log('>>> srvName =', srvName);
//
//      core.signal.emit('core.use', srvName);
//
//      return coreCtx[srvName];
//    },
//    set: function(coreCtx, srvName, service){
//
//      console.log('\n>>> root:', coreCtx);
//      console.log('>>> srvName =', srvName);
//      console.log('>>> service =', service);
//
//      // Duck typing service
//      if( _.isFunction(service.then) ){
//
//        // XXX
//        console.log('___ have a promise');
//
//        service.then(function(srv){
//
//          // TODO: service registration validation
//          var _service = srv;
//
//          coreCtx[srvName] = _service;
//          core.signal.emit('core.ready', srvName);
//          return srv;
//        });
//
//
//      }else{
//        core.signal.emit('core.ready', srvName);
//        coreCtx[srvName] = service;
//      }
//    }
//  };
//
//  // XXX
//  core.signal.on('core.ready', function(name){
//    console.log('\neee S.'+name, 'is ready!');
//  });
//
//  return new Proxy(coreCtx, coreObs);
//
//};