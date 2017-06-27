const sut = require('../');
const async = require('async');
const parallel = async.parallel;
const config = Object.assign({}, require('config'));
const request = require('request');
const logger = require('../lib/logger');
config.logger = logger.configure( config.logger );

var app;
var port;
var baseUrl;

module.exports = {
  'end to end' : {
    'initiation problems should be handled' : (done) => {
        async.parallel = function(_, cb) {
            cb( new Error('oups...') )
        };
        sut.start(config, (err) => {
            async.parallel = parallel;
            Should(err).have.property('message', 'oups...')
            done()
        })
    },
    'normal work': {
      beforeAll: (done) => {
        sut.start(config, (err, oApp) => { 
            Should.not.exist(err)
            app = oApp; 
            port = app.svr.address().port;
            baseUrl = 'http://localhost:' + port;
            done(err) 
        }) 
      },
      afterAll: (done) => app.stop(done),
      'post should work' : (done) => {
        request({ 
          method: 'POST', 
          url: baseUrl + "/api/foo"
        }, (err, res) => { done(err) })
      },
      'get should work' : (done) => {
        request({ 
          method: 'GET', 
          url: baseUrl + "/api/foo"
        }, (err, res) => { done(err) })
      },
      'delete should work' : (done) => {
        request({ 
          method: 'DELETE', 
          url: baseUrl + "/api/foo"
        }, (err, res) => { done(err) })
      },
      'delete should work on deleted' : (done) => {
        request({ 
          method: 'DELETE', 
          url: baseUrl + "/api/foo"
        }, (err, res) => { done(err) })
      },
      'get should work on deleted' : (done) => {
        request({ 
          method: 'GET', 
          url: baseUrl + "/api/foo"
        }, (err, res) => { done(err) })
      },
      'post should work with by' : (done) => {
        request({ 
          method: 'POST', 
          url: baseUrl + "/api/foo/4"
        }, (err, res) => { done(err) })
      },
      'when redis gives errors' : block(() => {
          var db;
          return {
            beforeAll: () => { 
              db = app.get('db');
              
              const mockErr = function() {
                  arguments[ arguments.length - 1 ]( new Error('oups...') )
              }
              app.set('db', { 
                del: mockErr,
                get: mockErr,
                incr: mockErr
              }) 
            },
            afterAll: () => { app.set('db', db) },
            'delete should work' : (done) => {
              request({ 
                method: 'DELETE', 
                url: baseUrl + "/api/foo"
              }, (err, res) => { done(err) })
            },
            'get should work' : (done) => {
              request({ 
                method: 'GET', 
                url: baseUrl + "/api/foo"
              }, (err, res) => { done(err) })
            },
            'post should work' : (done) => {
              request({ 
                method: 'POST', 
                url: baseUrl + "/api/foo"
              }, (err, res) => { done(err) })
            },
            'post should work with by' : (done) => {
              request({ 
                method: 'POST', 
                url: baseUrl + "/api/foo/4"
              }, (err, res) => { done(err) })
            },          
          }
      }),
      'error handler should work' : block( () => {
          var orig;
          return { 
            beforeAll: () => { 
                orig = app.get('db').get;
                app.get('db').get = function() { throw new Error('oups') }
            },
            afterAll: () => { app.get('db').get = orig },
            'get should work' : (done) => {
              request({ 
                method: 'GET', 
                url: baseUrl + "/api/foo"
              }, (err, res) => { done(err) })
            },
          }
      }),
      'starting after started should work' : (done) => app.start(done),
    }
  }
}