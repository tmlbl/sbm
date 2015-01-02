var ui = require('./ui'),
    config = require('./config'),
    exec = require('./util').run,
    util = require('util');

// Adds a repository to the current project
module.exports = function (url, path, options, cb) {
  cb = cb || function () {};
  var sha = options.sha || 'master';
  if (!url && !path) {
    return sbmInstall(options, cb);
  }
  if (!path) {
    return cb('Please supply a path');
  }
  var cmd = util.format('git clone %s %s', url, path);
  ui.loading();
  exec(cmd, function (err) {
    ui.doneLoading();
    cmd = util.format('cd %s && git rev-parse HEAD', path);
    exec(cmd, function (err, stdout, stderr) {
      console.log('Checked %s out @%s', url, stdout);
      cmd = util.format('echo "%s" >> .gitignore', path);
      exec(cmd, function (err) {
        console.log(util.format('Added %s to .gitignore', path));
        config.add(url, path, options);
        cb();
      });
    });
  });
};

function sbmInstall(options, cb) {
  var deps = config.config.dependencies;
  if (deps.length < 1) {
    ui.warn('No dependencies installed yet!');
    process.exit(1);
  }
  deps.forEach(function (d) {
    var cmd = util.format('git clone %s %s', d.url, d.path);
    exec(cmd, function (err) {
      return cb();
    });
  });
}
