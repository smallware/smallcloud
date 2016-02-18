
module.exports = [

  {
    manifest: { version: '0.1.0' },
    startup: function(){},
    id: 'service01'
  },

  {
    manifest: {
      version: '0.1.0',
      dependencies: {
        service01: '0.1.0'
      }
    },
    startup: function(){},
    id: 'service02'
  }
];