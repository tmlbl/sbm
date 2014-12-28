var ansi = require('ansi'),
	cursor = ansi(process.stdout);

module.exports.error = function (err) {
	cursor.red().write(err + '\n').reset();
};

module.exports.info = function (msg) {
	if (msg.indexOf('\n') == -1) {
		msg += '\n';
	}
	cursor.blue().write(msg).reset();
};

module.exports.warn = function (msg) {
  cursor.yellow().write(msg + '\n').reset();
};
