'use strict';

module.exports = {

  service01: {
    manifest: {
      version: '0.1.0'
    },
    init: function(){}
  },

  service02: {
    manifest: {
      version: '0.2.0',
      dependencies: {
        service01: '0.1.0'
      }
    },
    init: function(){}
  },

  service03: {
    noManifest: true
  },

  service04: {
    manifest: { version: '0.4.0' }
  },

  service05: {
    manifest: {},
    init: function(){}
  },

  service06: {
    manifest: { version: 'a.b.c' },
    init: function(){}
  }

};