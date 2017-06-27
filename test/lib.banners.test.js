const sut = require('../lib/banners')

module.exports = {
  'the banners' : {
    'header should work' : () => sut.header(),
    'started should work' : () => sut.started(),
    'closing should work' : () => sut.closing(),
    'error should work' :  () => sut.error()
  }
}