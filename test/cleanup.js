var exec = require('child_process').exec;

process.chdir('./test');

exec('rm -rf somepath/ .gitignore sbm.json', function () {
  console.log('Done cleaning up');
});
