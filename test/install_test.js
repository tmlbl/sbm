var assert = require('chai').assert,
    install = require('../install'),
    exec = require('child_process').exec,
    config = require('../config'),
    fs = require('fs');

describe('Install command', function () {

  it('Should return err if path missing', function (next) {
    install('somerepo', null, {}, function (err) {
      assert.typeOf(err, 'string', 'Error is a string');
      next();
    });
  });

  it('Should clone a repository', function (next) {
    config.load(function () {
      install('git@github.com:rmccue/test-repository', 'somepath', {
        branch: 'master',
        sha: 'f903917612b735ca2baa0d13ba8c071d3b3a8df3'
      }, function (err) {
        assert.equal(err, null, 'Err should equal null');
        next();
      });
    });
  });

  it('Should add the path to .gitignore', function (next) {
    fs.readFile('.gitignore', function (err, content) {
      assert.equal(err, null, 'Err should equal null');
      assert.equal(content.toString(), 'somepath\n', 'Path should be in .gitignore');
      next();
    });
  });

  it('Should add the dependency to config', function (next) {
    config.load(function () {
      var deps = config.config.dependencies;
      assert.lengthOf(deps, 1, 'Deps should have a length of 1');
      assert.equal(deps[0].path, 'somepath', 'Path should be correct');
      assert.equal(deps[0].url, 'git@github.com:rmccue/test-repository',
        'Url should be correct');
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
