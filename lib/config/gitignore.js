var fs = require('fs'),
    util = require('util');

var gitignore = function () {

}

gitignore.load = function (cb) {
  var self = this;
  fs.readFile('.gitignore', function (err, data) {
    self.string = data ? String(data) : '';
    cb(err, self);
  });
};

gitignore.contains = function (path) {
  var lines = this.string.split('\n');
  return lines.indexOf(path) != -1;
};

gitignore.add = function (path, cb) {
  this.load(function (err, self) {
    if (!self.contains(path)) {
      var data = self.string ? self.string + '\n' +
        path + '\n' : path + '\n';
      self._write(data, cb);
    } else {
      cb();
    }
  });
};

gitignore.remove = function (path, cb) {
  this.load(function (err, self) {
    if (self.contains(path)) {
      var lines = self.string.split('\n');
      var index = lines.indexOf(path);
      lines.splice(index, 1);
      self._write(lines.join('\n'), cb);
    }
  });
};

gitignore._write = function (data, cb) {
  fs.writeFile('.gitignore', data, cb);
};

module.exports = gitignore;
