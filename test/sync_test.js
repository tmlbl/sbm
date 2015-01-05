var assert = require('chai').assert,
    sync_cmd = require('../lib/sync'),
    exec = require('child_process').exec,
    config = require('../lib/config'),
    fs = require('fs'),
    setup = require('./setup');

var testUrl = 'git@github.com:rmccue/test-repository';

describe('Sync command', function () {

  before(function (done) {
    setup.config({}, done);
  });

  it('should pull code when there is none', function (done) {
    config.add(testUrl, 'somepath', {}, function () {
      sync_cmd(null, null, function (err) {
        assert.equal(err, null, 'Err should equal null');
        return done();
      });
    });
  });

});
