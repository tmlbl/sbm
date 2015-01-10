var init = require('../lib/init'),
    assert = require('chai').assert,
    exec = require('child_process').exec,
    fs = require('fs'),
    setup = require('./setup');

describe('Init command', function () {

  afterEach(function (done) {
    exec('rm sbm.json', function () {
      done();
    });
  });

  it('Should not cause an error', function (done) {
    init({}, function (err) {
      assert.equal(err, null);
      done();
    });
  });

  it('Should create sbm.json', function (done) {
    init({}, function () {
      fs.readFile('./sbm.json', function (err, content) {
        assert.lengthOf(content, 50, 'sbm.json has length of 50');
        done();
      });
    });
  });

  it('Should not overwrite existing file', function (done) {
    exec('echo "11" > sbm.json', function () {
      init({}, function () {
        fs.readFile('./sbm.json', function (err, content) {
            assert.lengthOf(content, 3, 'sbm.json has length of 3');
            done();
        });
      });
    });
  });

});
