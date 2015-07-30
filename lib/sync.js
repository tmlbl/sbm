var exec = require('./util.js').run,
    path = require('path'),
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

  var p = path.resolve(dep.path);
  var prefix = util.format('git --work-tree=%s --git-dir=%s/.git', p, p);
  var cmd = '';

  // Either clone or fetch repo, depending if folder exists
  if (fs.existsSync(dep.path)) {
    cmd = util.format('%s pull origin %s;', prefix, dep.branch || 'master');
  } else {
    cmd = util.format('git clone %s %s;', dep.url, dep.path);
  }

  // Checkout sha, branch or master depending on config specificity
  if (dep.sha) {
    cmd += util.format('%s checkout %s', prefix, dep.sha);
  } else if (dep.branch) {
    cmd += util.format('%s checkout %s', prefix, dep.branch);
  } else {
    cmd += util.format('%s checkout master', prefix);
  }

  exec(cmd);
  cb();
}
