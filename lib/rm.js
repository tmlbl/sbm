var config = require('./config'),
    util = require('util'),
    exec = require('child_process').exec;

module.exports = function (path, cb) {
  cb = cb || function () { };

  // Remove the dependency from config
  config.remove(path, function () {
    // Remove the files at the path
    var cmd = util.format('rm -rf %s', path);
    exec(cmd, function (err, stdout, stderr) {
      // Remove the path from .gitignore
      cmd = util.format('sed -i \'/%s/d\' .gitignore', path);
      exec(cmd, function (err, stdout, stderr) {
        return cb();
      });
    });
  });
};
