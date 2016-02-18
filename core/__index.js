
var EventEmitter = require('eventemitter2').EventEmitter2;
var requireAll   = require('require-all');
//var Sequelize    = require('sequelize');
var callerId     = require('caller-id');
//var Promise      = require('bluebird');
var express      = require('express');
//var async        = require('async');
var path         = require('path');
//var co           = require('co');
var _            = require('lodash');
var lifecycle    = require('./lib/lifecycle');
var logger       = require('./lib/util/logger');



// S-Object definition ////////////////////////////////////////////////////////
module.exports = GLOBAL.S = {

  // Logger
  log: function(level, message){
    if( !S.get('config.core.silent') )
      logger(level, message);
  },

  // Event emitter instance
  event: new EventEmitter({
    wildcard:     true,
    delimiter:    '.',
    newListener:  false,
    maxListeners: 20
  })
};


// Privates ///////////////////////////////////////////////////////////////////

//// Started flag
//var S_started = false;
//
//// Protected core store
//var S_store = {
//  app:      express(),
//  path:     path.resolve(__dirname, '../'),
//  config:   requireAll(path.resolve(__dirname, '../config'))
//};

// Validate method usage
var isValid = function(caller, member){

  // Is main script calling init?
  if( 'init' === member && S_store.path + '/smallcloud.js' === caller.filePath )
    return true;

  // Is call coming from core?
  var fromCore = (-1 !== caller.filePath.search(S_store.path + '/core'));

  // Is call coming from testing?
  var fromTests = (-1 !== caller.filePath.search(S_store.path + '/test'));

  return ( fromCore || fromTests );

};


// Protecteds /////////////////////////////////////////////////////////////////

var S_protected = {

  // Installation path
  path: path.resolve(__dirname, '../'),

  // Core configuration
  config: requireAll(path.resolve(__dirname, '../config')),

  // Init method
  init: lifecycle.init,

  // Express app
  app: express(),

  // Register property into S-Object
  register: function(key, value){

    // Avoid overwriting
    if( S.hasOwnProperty(key) )
      return false;

    // Determine value type
    if( _.isFunction(value) ){

      // Register method
      Object.defineProperty(S, key, {
        configurable: false,
        enumerable:   false,
        writable:     false,
        value: function(){

          // Get caller data
          var caller = callerId.getData();

          // Validate caller
          if( isValid(caller, key) )
            return value.apply(S, arguments);
          else
            throw new Error('Illegal invocation of S.' + key + ' from ' + caller.filePath);
        }
      });

    }else{

      // Register property
      Object.defineProperty(S, key, {
        configurable: false,
        enumerable:   false,
        writable:     false,
        value:        value,
        //get: function(){
        //
        //  // Get caller data
        //  var caller = callerId.getData();
        //
        //  // Validate caller
        //  if( isValid(caller, key) )
        //    return value;
        //  else
        //    throw new Error('Illegal read of S.' + key + ' from ' + caller.filePath);
        //},
        //set: function(_value){
        //
        //  // XXX
        //  console.log('>>> Setting', key, '=', _value);
        //
        //}
      });
    }
  }

};


// Attach protecteds to S-Object
_.forEach(S_protected, function(value, key){

  // Register into S-Object
  S_protected.register(key, value);

});