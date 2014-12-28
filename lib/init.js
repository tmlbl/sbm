var ui = require('./ui'),
    config = require('./config');

module.exports = function (options, cb) {
  cb = cb || function () {};
  config.init(function (err) {
    if (err) {
      ui.error(err);
      return cb(err);
    }
    console.log('Initialized an empty project in ' + process.cwd());
    return cb();
  });
};
