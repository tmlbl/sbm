var exec = require('child_process').exec,
    assert = require('assert'),
    gi = require('../lib/config/gitignore');


describe('gitignore module', function () {

  function assertEndingNewline (gitignore) {
    assert(gitignore.string[gitignore.string.length - 1] == '\n');
  }

  it('should load a valid .gitignore', function (done) {
    exec('echo "fugazi" > .gitignore', function () {
      gi.load(function (err, gitignore) {
        assert(err == null);
        assert(!!gitignore);
        assert.equal(typeof gitignore, 'function');
        assert(gitignore.contains('fugazi'));
        assertEndingNewline(gitignore);
        done();
      });
    });
  });

  it('should add to .gitignore', function (done) {
    gi.add('nomo', function (err) {
      assert(err == null);
      gi.load(function (err, gitignore) {
        assert(gitignore.contains('nomo'));
        assertEndingNewline(gitignore);
        done();
      });
    });
  });

  it('should remove from .gitignore', function (done) {
    gi.remove('nomo', function (err) {
      assert(err == null);
      gi.load(function (err, gitignore) {
        assert(!gitignore.contains('nomo'));
        assertEndingNewline(gitignore);
        done();
      });
    });
  });

});
