
var _ = require('lodash');

module.exports = {
  object: object
};

var object = {
  safe: function inmutableObject(obj, target){

    target = target || {};

    _.forEach(obj, function(value, key){

      if( _.isPlainObject(value) )
        value = inmutableObject(value);

      Object.defineProperty(target, key, {
        configurable: false,
        enumerable:   false,
        writable:     false,
        value:        value
      });

    });

    return target;

  }
};