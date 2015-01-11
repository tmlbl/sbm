var assert = require('chai').assert,
    sync_cmd = require('../lib/sync'),
    exec = require('child_process').exec,
    config = require('../lib/config'),
    fs = require('fs'),
    setup = require('./setup');

var testUrl = 'https://github.com/tmlbl/sbm-test.git';

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

  describe('When given a branch', function () {

    before(function (done) {
      setup.config({
        dependencies: [
          {
            url: testUrl,
            path: 'somepath',
            branch: 'other'
          }
        ]
      }, function () {
        config.load(done);
      })
    });

    after(function (done) {
      exec('rm -rf somepath', done);
    });

    it('Should sync to a branch in config', function (done) {
      sync_cmd(null, null, function (err) {
        assert.equal(err, null, 'Err should equal null');
        exec('cd somepath && git branch', function (err, stdout, stderr) {
          assert.isNull(err);
          assert.notEqual(-1, stdout.indexOf('other'));
          done();
        });
      });
    });

  });

  describe('When given a SHA', function () {

    var testSha = 'c237e220f4188dd9475e5d8e4f897188f561d558';

    before(function (done) {
      setup.config({
        dependencies: [
          {
            url: testUrl,
            path: 'somepath',
            sha: testSha
          }
        ]
      }, function () {
        config.load(done);
      })
    });

    after(function (done) {
      exec('rm -rf somepath', done);
    });

    it('Should sync to a SHA in config', function (done) {
      sync_cmd(null, null, function (err) {
        assert.equal(err, null, 'Err should equal null');
        exec('cd somepath && git rev-parse HEAD', function (err, stdout, stderr) {
          assert.isNull(err);
          assert(stdout.indexOf(testSha) != -1);
          done();
        });
      });
    });

  });

});
