var config = require('../lib/config'),
    assert = require('chai').assert,
    exec = require('child_process').exec,
    fs = require('fs'),
    setup = require('./setup');

describe('Config module', function () {

  beforeEach(function (done) {
    setup.config({}, done);
  });

  afterEach(function (done) {
    exec('rm sbm.json', function () {
      done();
    });
  });

  it('Should load the config', function (next) {
    config.load(function (err) {
      assert.equal(err, null, 'Err should be null');
      assert.typeOf(config.config, 'object', 'Should parse config to json');
      next();
    });
  });

  it('Should read the project name', function (next) {
    config.load(function () {
      assert.equal(config.config.project, 'test', 'Project name should be correct');
      next();
    });
  });

  it('Should add a dependency', function (next) {
    config.add('repo', 'path', {
      branch: 'branch',
      sha: 'sha'
    }, function (err) {
      config.load(function () {
        assert.equal(err, null, 'Err should be null');
        var dep = config.config.dependencies[0];
        assert.equal(dep.url, 'repo', 'URL should be correct');
        assert.equal(dep.path, 'path', 'Path should be correct');
        assert.equal(dep.branch, 'branch', 'Branch should be correct');
        assert.equal(dep.sha, 'sha', 'SHA should be correct');
        next();
      })
    });
  });

  it('Should remove a dependency', function (next) {
    config.remove('path/', function (err) {
      assert.equal(err, null, 'Err should be null');

      config.load(function (err) {
        assert.lengthOf(config.config.dependencies, 0, 'Dep should have been removed');
        next();
      })
    });
  });

});
