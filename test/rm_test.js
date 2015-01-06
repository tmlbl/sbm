var setup = require('./setup').config,
    rm = require('../lib/rm'),
    config = require('../lib/config'),
    util = require('util'),
    exec = require('child_process').exec,
    fs = require('fs');

var testUrl = 'git@github.com:tmlbl/sbm-test',
    testPath = 'somepath';

describe('RM command', function () {

  beforeEach(function (done) {
    var cmd = util.format(
      'echo "%s" > .gitignore; mkdir %s',
      testPath,
      testPath
    );
    exec(cmd, function () {
      setup({
        dependencies: [
          {
            url: testUrl,
            path: testPath
          }
        ]
      }, done);
    });
  });

  afterEach(function (done) {
    var cmd = util.format(
      'rm -rf %s sbm.json .gitignore;',
      testPath
    );
    exec(cmd, done);
  });

  it('should remove a dependency from config', function (done) {
    rm(testPath, {}, function () {
      config.load(function () {
        if (config.countDeps() != 0) {
          throw new Error('The dependency was not removed from the list!');
        }
        done();
      });
    });
  });

  it('should remove the directory', function (done) {
    rm(testPath, {}, function () {
      if (fs.existsSync(testPath)) {
        throw new Error('The directory was not removed!');
      }
      done();
    })
  });

  it('should remove the .gitignore entry', function (done) {
    rm(testPath, {}, function () {
      var data = fs.readFileSync('.gitignore');
      if (data.toString().indexOf(testPath) != -1) {
        throw new Error('The path is still in the ,gitignore file!');
      }
      done();
    });
  });

});
