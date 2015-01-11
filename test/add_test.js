var assert = require('chai').assert,
    add_cmd = require('../lib/add'),
    exec = require('child_process').exec,
    config = require('../lib/config.js'),
    fs = require('fs'),
    gi = require('../lib/config/gitignore'),
    setup = require('./setup');

var testUrl = 'https://github.com/tmlbl/sbm-test.git';

describe('Add command', function () {

  before(function (done) {
    setup.config({}, done);
  });

  after(function (done) {
    exec('rm -rf sbm.json .gitignore somepath/', function () {
      done();
    });
  });

  it('Should return err if path missing', function (next) {
    add_cmd('somerepo', null, {}, function (err) {
      assert.typeOf(err, 'string', 'Error is a string');
      next();
    });
  });

  it('Should clone a repository', function (next) {
    config.load(function () {
      add_cmd(testUrl, 'somepath', {
        branch: 'master',
        sha: 'f903917612b735ca2baa0d13ba8c071d3b3a8df3'
      }, function (err) {
        assert.equal(err, null, 'Err should equal null');
        next();
      });
    });
  });

  it('Should add the path to .gitignore', function (next) {
    gi.load(function (err, gitignore) {
      assert.equal(err, null, 'Err should equal null');
      assert(gitignore.contains('somepath'), 'Path should be in .gitignore');
      next();
    });
  });

  it('Should add the dependency to config', function (next) {
    config.load(function () {
      var deps = config.config.dependencies;
      assert.lengthOf(deps, 1, 'Deps should have a length of 1');
      assert.equal(deps[0].path, 'somepath', 'Path should be correct');
      assert.equal(deps[0].url, testUrl, 'Url should be correct');
      next();
    });
  });

  it('Should add options to config', function (next) {
    config.load(function () {
      var deps = config.config.dependencies;
      assert.equal(deps[0].branch, 'master', 'Branch should be correct');
      assert.equal(deps[0].sha, 'f903917612b735ca2baa0d13ba8c071d3b3a8df3',
        'SHA should be correct');
      next();
    });
  });

});
