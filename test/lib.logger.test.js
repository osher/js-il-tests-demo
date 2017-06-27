const sut = require('../lib/logger');

module.exports = {
    'the logger' : {
      'should init with settings' : () => {
           sut.configure()
      },
      'should init with defaults': () => {
           sut.configure( { levels: { "[all]" : "FATAL" } } )
      }
    }
}