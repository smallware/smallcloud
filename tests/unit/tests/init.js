
var _        = require('lodash');
var chai     = require('chai');
var init     = require('../../../core/lib/init');
var mockSrvs = require('../mocks/candidates');

// Setup
chai.should();


module.exports = function(){

  describe('SmallCloud Init', function(){

    describe('Init candidate validation', function(){

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


      describe('Init candidate validation results', function(){

        it('Should be an array of services', function(){

          // Run init validation
          var valids = _.reduce(mockSrvs, init.validate, []);

          // Assert
          valids.should.be.an('array');
        });

        it('Should return items with an id', function(){

          // Run init validation
          var valids = _.reduce(mockSrvs, init.validate, []);

          // Verify all items have an non-empty id property
          var haveIds = valids.every(function(item){
            return 'id' in item && !_.isEmpty(item.id);
          });

          // Assert
          haveIds.should.be.true;
        });

        it('Should return items with a startup method', function(){

          // Run init validation
          var valids = _.reduce(mockSrvs, init.validate, []);

          // Verify all items have a startup method
          var haveIds = valids.every(function(item){
            return 'startup' in item
              && !_.isEmpty(item.id)
              && _.isFunction(item.startup);
          });

          // Assert
          haveIds.should.be.true;
        });

        it('Should return items with a manifest', function(){

          // Run init validation
          var valids = _.reduce(mockSrvs, init.validate, []);

          // Verify all items have an object as manifest property
          var haveManifest = valids.every(function(item){
            return 'manifest' in item
              && !_.isEmpty(item.manifest)
              && _.isPlainObject(item.manifest);
          });

          // Assert
          haveManifest.should.be.true;
        });

        it('Should return items with a version in the manifest', function(){

          // Run init validation
          var valids = _.reduce(mockSrvs, init.validate, []);

          // Verify all items have a version inside the manifest property
          var haveVersion = valids.every(function(item){
            return 'version' in item.manifest
              && !_.isEmpty(item.manifest.version)
              && _.isString(item.manifest.version);
          });

          // Assert
          haveVersion.should.be.true;
        });

      });
    });
  });
};