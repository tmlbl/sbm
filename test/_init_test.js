var init = require('../lib/init'),
    assert = require('chai').assert,
    exec = require('child_process').exec,
    fs = require('fs');

process.chdir('./test');

describe('Init command', function () {

  it('Should not cause an error', function (next) {
    init({}, function (err) {
      assert.equal(err, null);
      next();
    });
  });

  it('Should create sbm.json', function (next) {
    fs.readFile('./sbm.json', function (err, content) {
      assert.lengthOf(content, 50, 'sbm.json has length of 50');
      next();
    });
  });

  after(function (done) {
    exec('rm sbm.json', function () {
      done();
    });
  });

});
