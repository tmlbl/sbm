var ui = require('./ui'),
    config = require('./config'),
    exec = require('child_process').exec,
    util = require('util');

module.exports = function (repo, path, options, cb) {
  cb = cb || function () {};
  var sha = options.sha || 'master';
  if (!repo && !path) {
    return sbmInstall(options, cb);
  }
  if (!path) {
    return cb('Please supply a path');
  }
  var cmd = util.format('git clone %s %s', repo, path);
  console.log(util.format('Running %s', cmd));
  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      ui.error(stderr);
      return cb(err);
    }
    cmd = util.format('cd %s && git rev-parse HEAD', path);
    exec(cmd, function (err, stdout, stderr) {
      console.log('Checked %s out @%s', repo, stdout);
      cmd = util.format('echo "%s" >> .gitignore', path);
      exec(cmd, function (err, stdout, stderr) {
        console.log(util.format('Added %s to .gitignore', path));
        config.add(repo, path, options);
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
    console.log('Running ' + cmd);
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        ui.error(stderr);
      }
      console.log(stdout);
      return cb();
    });
  });
}
