
module.exports = {

  service01: {
    manifest: {
      version: '0.1.0'
    },
    startup: function(){}
  },

  service02: {
    manifest: {
      version: '0.1.0',
      dependencies: {
        service01: '0.1.0'
      }
    },
    startup: function(){}
  },

  service03: {
    noManifest: true
  },

  service04: {
    manifest: {
      version: '0.1.0'
    }
  }

};