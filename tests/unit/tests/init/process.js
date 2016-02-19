'use strict';

var _        = require('lodash');
var chai     = require('chai');
var rewire   = require('rewire');
var DepGraph = require('dependency-graph').DepGraph;
var init     = rewire('../../../../core/lib/init');
//var init     = require('../../../../core/lib/init');
var mockSrvs = require('../../mocks/services');

// Setup
chai.should();


module.exports = function(){

  describe('Init service processing', function(){

    before(function(){
      var depGraph = new DepGraph();

      mockSrvs.map(function(item){
        return item.id;
      }).forEach(function(srvId){
        depGraph.addNode(srvId);
      });

      init.__set__('depGraph', depGraph);
    });

    it('Should return an array', function(){
      mockSrvs.map(init.process).should.be.an('array');
    });
  });
};