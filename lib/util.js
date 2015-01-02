var exec = require('child_process').exec,
    ui = require('./ui');

function util() { }

// Executes a command, prints the output, and
// returns an error in the case of a nonzero
// exit code
util.run = function (cmd, cb) {
  ui.run(cmd);
  var child = exec(cmd);
  child.stdout.on('data', function (data) {
    ui.info(data);
  });
  child.stderr.on('data', function (data) {
    ui.error(data);
  });
  child.on('close', function (code) {
    if (code != 0) {
      cb(new Error(code));
    } else {
      cb();
    }
  });
};

// Quickly gets the stdout of a command which is
// not expected to cause an error
util.output = function (cmd, cb) {
  exec(cmd, function (err, stdout, stderr) {
    cb(stdout);
  });
};

module.exports = util;
