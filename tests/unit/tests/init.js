
var _        = require('lodash');
var chai     = require('chai');
var init     = require('../../../core/lib/init');
var mockSrvs = require('../mocks/services');

// Setup
chai.should();


module.exports = function(){

  describe('SmallCloud Init', function(){

    describe('Init service validation', function(){

      it('Should not validate service candidates without a manifest file', function(){

        // Run init validation
        var valids = _.reduce(mockSrvs, init.validate, []);

        // Assert
        valids.should.not.include(mockSrvs.service03);
      });

      it('Should not validate service candidates without a startup function', function(){

        // Run init validation
        var valids = _.reduce(mockSrvs, init.validate, []);

        // Assert
        valids.should.not.include(mockSrvs.service04);

      });

      it('Should not validate service candidates without a version in manifest', function(){

        // Run init validation
        var valids = _.reduce(mockSrvs, init.validate, []);

        // Assert
        valids.should.not.include(mockSrvs.service05);

      });

    });

  });
};