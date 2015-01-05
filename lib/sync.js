var exec = require('child_process').exec,
    ui = require('./ui'),
    config = require('./config'),
    util = require('util');

// Pull the latest code for all dependencies
module.exports = function (path, options, cb) {
  cb = cb || function () { };

  if (!path) {
    ui.info('Syncing all dependencies...');
    return syncAll(cb);
  }

  cb();
};

function syncAll (cb) {
  config.asyncForEach(function (dep, next) {
    ui.info('Syncing ' + dep.path);
    exec(util.format('git clone %s %s', dep.url, dep.path), next);
  }, cb);
}
