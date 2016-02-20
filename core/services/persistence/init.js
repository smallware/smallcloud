
var co      = require('co');
var Promise = require('bluebird');

module.exports = function*(S){

  console.log('III running Small Persistence');
  console.log('SSS', S);

  return 'Persistence result!';
};