var assert = require('chai').assert,
    install = require('../install'),
    exec = require('child_process').exec,
    config = require('../config'),
    fs = require('fs');

describe('Install command', function () {

  it('Should clone a repository', function (next) {
    config.load(function () {
      install('git@github.com:rmccue/test-repository', 'somepath', {}, function (err) {
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

});
