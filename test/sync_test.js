var assert = require('chai').assert,
    sync_cmd = require('../lib/sync'),
    exec = require('child_process').exec,
    config = require('../lib/config'),
    fs = require('fs'),
    setup = require('./setup');

var testUrl = 'git@github.com:tmlbl/sbm-test';

describe('Sync command', function () {

  before(function (done) {
    setup.config({
      dependencies: [
        {
          url: testUrl,
          path: 'somepath'
        }
      ]
    }, function () {
      config.load(done);
    });
  });

  afterEach(function (done) {
    exec('rm -rf somepath/ sbm.json', done);
  });

  it('should pull code when there is none', function (done) {
    sync_cmd(null, null, function (err) {
      assert.equal(err, null, 'Err should equal null');
      exec('ls somepath', function (err, stdout, stderr) {
        assert.isNull(err);
        done();
      });
    });
  });

});
