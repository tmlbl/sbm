var ui = require('./ui'),
    config = require('./config'),
    exec = require('child_process').exec,
    util = require('util');

module.exports = function (repo, path, options) {
  var sha = options.sha || 'master';
  if (!repo && !path) {
    return sbmInstall(options);
  }
  if (!path) {
    ui.error('Please supply a path');
    process.exit(1);
  }
  var cmd = util.format('git clone %s %s', repo, path);
  console.log(util.format('Running %s', cmd));
  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      ui.error(stderr);
      return process.exit(1);
    }
    cmd = util.format('cd %s && git rev-parse HEAD', path);
    exec(cmd, function (err, stdout, stderr) {
      console.log('Checked %s out @%s', repo, stdout);
      cmd = util.format('echo "%s" >> .gitignore', path);
      exec(cmd, function (err, stdout, stderr) {
        console.log(util.format('Added %s to .gitignore', path));
        config.add(repo, path, options);
      });
    });
  });
};

function sbmInstall(options) {
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
    });
  });
}
