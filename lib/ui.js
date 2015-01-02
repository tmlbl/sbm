var ansi = require('ansi'),
	cursor = ansi(process.stdout);

function ui() { }

ui.error = function (err) {
	cursor.red().write(err + '\n').reset();
};

ui.info = function (msg) {
  msg += '\n';
	cursor.blue().write(msg).reset();
};

ui.warn = function (msg) {
  cursor.yellow().write(msg + '\n').reset();
};

ui.run = function (cmd) {
  cursor
    .green()
    .write('RUN: ')
    .reset()
    .write(cmd + '\n')
    .reset()
};

ui.loading = function () {
  this.isLoading = true;
  var self = this;
  var count = 1;
  function loader() {
    if (self.isLoading) {
      var bar = '~';
      count++;
      if (count > 10) {
        count = 0;
      }
      for (var i = 0; i < count; i++) {
        bar += '~';
      }
      cursor.green()
        .horizontalAbsolute(0)
        .eraseLine()
        .write(bar)
    }
  }
  this. loadInterval = setInterval(loader, 30);
};

ui.doneLoading = function () {
  this.isLoading = false;
  cursor
    .horizontalAbsolute(0)
    .eraseLine()
    .reset();
  clearInterval(this.loadInterval);
}

module.exports = ui;
