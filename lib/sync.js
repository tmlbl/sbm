var exec = require('child_process').exec,
    ui = require('./ui'),
    config = require('./config'),
    util = require('util'),
    fs = require('fs');

// Pull the latest code for dependencies
module.exports = function (path, options, cb) {
  cb = cb || function () { };

  if (!path) {
    ui.info('Syncing all dependencies...');
    if (config.countDeps() < 1) {
      return ui.warn('No dependencies added yet!');
    }
    return syncAll(cb);
  }

  return syncOne(config.byPath(path), cb);
};

function syncAll (cb) {
  config.asyncForEach(syncOne, cb);
}

function syncOne (dep, cb) {

  ui.info('Syncing ' + dep.path);
  var cmd = '';

  // Either clone or fetch repo, depending if folder exists
  if (fs.existsSync(dep.path)) {
    cmd = util.format('cd %s && git fetch', dep.path);
  } else {
    cmd = util.format('git clone %s %s && cd %s', dep.url, dep.path, dep.path);
  }

  // Checkout sha, branch or master depending on config specificity
  if (dep.sha) {
    cmd += util.format(' && git checkout %s', dep.sha);
  } else if (dep.branch) {
    cmd += util.format(' && git checkout %s', dep.branch);
  } else {
    cmd += ' && git checkout master';
  }

  ui.run(cmd);
  exec(cmd, cb);

}
