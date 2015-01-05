var exec = require('child_process').exec;

exec('rm -rf somepath/ .gitignore sbm.json', function () {
  console.log('Done cleaning up');
});
