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
var depGraph = new DepGraph();


module.exports = function(){

  describe('Init service processing', function(){

    before(function(){

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

    it('Should return items with active property set to false', function(){
      var processed = mockSrvs.map(init.process)
        .every(function(item){ return !item.active; })
        .should.be.true;
    });

    it('Should set as inactivable services with unmet dependencies', function(){
      var processed = mockSrvs.map(init.process);
      processed[2].activable.should.be.false;
      processed[1].activable.should.be.true;
    });

    it('Should remove inactivable services from de dependency graph', function(){
      var processed = mockSrvs.map(init.process);
      Object.keys(depGraph.nodes).should.not.include(mockSrvs[2].id);
    });

  });
};