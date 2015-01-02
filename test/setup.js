var fs = require('fs');

// Sets the test up by creating a config file
module.exports.config = function (config, cb) {
  var conf = config || {};
  conf.project = config.project || 'test';
  conf.version = config.version || '0.0.1';
  conf.dependencies = config.dependencies || [];
  var writeData = JSON.stringify(conf, null, 4);
  fs.writeFile('./sbm.json', writeData, cb);
}
