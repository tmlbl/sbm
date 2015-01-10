var fs = require('fs'),
    async = require('async'),
    ui = require('./ui');

function Config() {}

Config.prototype.load = function (cb) {
  var self = this;
	fs.readFile('./sbm.json', function (err, data) {
		self.rawConfig = data;
		if (!self.rawConfig) {
			return cb('No sbm.json in the current directory.');
      process.exit(1);
		}
    self.config = JSON.parse(self.rawConfig);
    return cb();
	});
};

// Initializes an empty config file
Config.prototype.init = function (cb) {

  if (fs.existsSync('./sbm.json')) {
    return cb(new Error('An sbm.json already exists here!'));
  }

  // Set the name of the project to the name
  // of the current directory
  var name = process.cwd().split('/');
  name = name[name.length - 1];

  // Write the empty config
  var writeData = JSON.stringify({
    project: name,
    dependencies: []
  }, null, 4) + '\n';
  fs.writeFile('./sbm.json', writeData, cb);

};

Config.prototype.add = function (repo, path, options, cb) {
  cb = cb || function () {};
  this.config.dependencies.push({
    url: repo,
    path: path,
    sha: options.sha,
    branch: options.branch
  });
  this.save(cb);
};

Config.prototype.remove = function (path, cb) {
  var newDeps = [];
  this.config.dependencies.forEach(function (dep) {
    if (path.indexOf(dep.path) == -1) {
      newDeps.push(dep);
    }
  });
  this.config.dependencies = newDeps;
  this.save(cb);
};

Config.prototype.save = function (cb) {
  cb = cb || function () {};
  var writeData = JSON.stringify(this.config, null, 4);
  fs.writeFile('./sbm.json', writeData, cb);
};

Config.prototype.asyncForEach = function (iter, next) {
  var self = this;
  this.load(function () {
    if (self.config.dependencies.length < 1) {
      return next();
    }
    async.forEach(self.config.dependencies, iter, next);
  });
};

Config.prototype.getDeps = function () {
  if (this.config && this.config.dependencies) {
    return this.config.dependencies;
  } else {
    return [];
  }
};

Config.prototype.countDeps = function () {
  return this.getDeps().length;
};

Config.prototype.byPath = function (path) {
  if (!this.config) process.exit(1);
  return this.getDeps()[this.getDeps().indexOf('path')];
}

module.exports = new Config();
