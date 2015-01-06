var config = require('./config'),
    util = require('util'),
    exec = require('./util').run;

module.exports = function (path, opts, cb) {
  cb = cb || function () { };

  config.load(function () {

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

  });

};
