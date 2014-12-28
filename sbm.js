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
  .action(require('./install'));

// The init command creates a blank config file in the current directory
program
  .command('init')
  .description('Initialize a project in the current directory')
  .action(require('./init'));

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
    process.exit(1);
	}
	program.parse(process.argv);
});

module.exports = program;
