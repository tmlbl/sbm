#!/usr/bin/env node

var program = require('commander'),
	util = require('util'),
	exec = require('child_process').exec,
	ui = require('./ui'),
	config = require('./config');

program
  .version('0.0.1')

// The install command adds a dependency to the current project
program
  .command('install [repo] [path]')
  .description('add a repo to the project')
  .option('-s, --sha [sha]', 'The SHA to check out of the repo')
  .option('b. --branch [branch]', 'The branch to follow for this package')
  .action(function (repo, path, options) {
  	var sha = options.sha || 'master';
  	if (!repo) {
  		ui.error('Please supply a repository url');
  		process.exit(1);
  	}
  	if (!path) {
  		ui.error('Please supply a path');
  		process.exit(1);
  	}
    var cmd = util.format('git clone %s %s', repo, path);
    console.log(util.format('Running %s', cmd));
    exec(cmd, function (err, stdout, stderr) {
    	if (err) {
    		ui.error(stderr);
    		return process.exit(1);
    	}
    	cmd = util.format('cd %s && git rev-parse HEAD', path);
    	exec(cmd, function (err, stdout, stderr) {
    		console.log('Checked %s out @%s', repo, stdout);
        cmd = util.format('echo "%s" >> .gitignore', path);
        exec(cmd, function (err, stdout, stderr) {
          console.log(util.format('Added %s to .gitignore', path));
          config.add(repo, path, options);
        });
    	});
    });
  });

// The init command creates a blank config file in the current directory
program
  .command('init')
  .description('Initialize a project in the current directory')
  .action(function (options) {
    config.init(function (err) {
      if (err) {
        ui.error(err);
        process.exit(1);
      }
      console.log('Initialized an empty project in ' + process.cwd());
    })
  });

// The update command pulls new code for dependencies, if relevant
program
  .command('update')
  .description('Pull the latest code for all dependencies')
  .option('-r, --recursive', 'Also update dependencies\' dependencies, ad infinitum')
  .action(function (options) {

  });

program
  .command('config [path]')
  .description('Modify a dependencies\' configuration')
  .option('-b, --branch [branch]', 'Set a branch name')
  .option('-s --sha [sha]', 'Set a SHA hash')
  .action(function (path, options) {

  });

config.load(function (err) {
	if (err && process.argv.indexOf('init') == -1) {
		ui.warn(err);
	}
	program.parse(process.argv);
});

module.exports = program;
