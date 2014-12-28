var fs = require('fs');

function Config() {}

Config.prototype.load = function (cb) {
  var self = this;
	fs.readFile('./sbm.json', function (err, data) {
		self.rawConfig = data;
		if (!self.rawConfig) {
			return cb('No sbm.json in the current directory.');
		}
    self.config = JSON.parse(self.rawConfig);
    return cb();
	});
};

// Initializes an empty config file
Config.prototype.init = function (cb) {

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

Config.prototype.add = function (repo, path, options) {
  this.config.dependencies.push({
    url: repo,
    path: path,
    sha: options.sha,
    branch: options.branch
  });
  this.save();
};

Config.prototype.save = function (cb) {
  cb = cb || function () {};
  var writeData = JSON.stringify(this.config, null, 4);
  fs.writeFile('./sbm.json', writeData, cb);
};

module.exports = new Config();
