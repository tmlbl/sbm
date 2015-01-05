var ui = require('./ui'),
    config = require('./config'),
    exec = require('./util').run,
    util = require('util'),
    async = require('async');

// The add command adds a repository to the current project's
// config file, clones it and adds the directory to .gitignore
module.exports = function (url, path, options, cb) {
  cb = cb || function () {};
  var sha = options.sha || 'master';

  // Make sure the command was called correctly
  if (!url) {
    return cb('Please supply a repository url');
  }
  if (!path) {
    return cb('Please supply a path');
  }

  async.series([
    cloneRepo.bind(null, url, path),
    addToIgnore.bind(null, path),
    addToConfig.bind(null, url, path, options)
  ], cb);
};

// Execute the clone command
function cloneRepo (url, path, next) {
  var cmd = util.format('git clone %s %s', url, path);
  ui.loading();
  exec(cmd, function (err) {
    ui.doneLoading();
    return next(err);
  });
}

// Add the path to .gitignore
function addToIgnore (path, next) {
  var cmd = util.format('echo "%s" >> .gitignore', path);
  exec(cmd, next);
}

// Adds the dependency to config
function addToConfig (url, path, options, next) {
  config.add(url, path, options, next);
}
