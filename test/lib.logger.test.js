const sut = require('../lib/logger');

module.exports = {
  'lib/logger' : {
    'should be a module object' : () => {
        Should(sut).be.an.Object()
    },
    '.configure(logCfg)': {
      'should be a function that expects 1 argument- loggerConfig' : () => {
          Should(sut.configure).be.a.Function().have.property('length', 1)
      },
      'when initiated without providing any configs' : {
        'should not fail' : () => {
            sut.configure()
        },
        'should set the logLevel to INFO' : () => {
            Should(sut.of('foo').level.levelStr).eql("INFO")
        }
      },
      'when initiated with explicit settings': {
        'should not fail' : () => {
            sut.configure( { levels: { "[all]" : "FATAL" } } )
        },
        'should set the logLevel to the level noted in the settings' : () => {
            Should(sut.of('foo').level.levelStr).eql("FATAL")
        }
      }
    },
    '.of(name)' : {
      'should be a function that expects 1 argument - name' : () => {
          Should(sut.configure).be.a.Function().have.property('length', 1)
      },
      'when used with a name' : { 
        'should return a logger instance with methods:' : block( () => {
          const log = sut.of('some-name');
          const suite = {}
          
          "Fatal|Warn|Info|Debug|Trace".split("|").forEach(m => {
              suite[m.toLowerCase()] = () => {
                log.should.have.property(m.toLowerCase()).be.a.Function()
              }
              
              suite["is" + m + "Enabled"] = () => {
                log.should.have.property("is" + m + "Enabled").be.a.Function()
              }

          })        

          return suite
        
        })
      }
    }
  }
}