var program = require('commander'),
	util = require('util'),
	exec = require('child_process').exec,
	ui = require('./ui'),
	config = require('./config');

program
  .version('0.0.1')

// The init command creates a blank config file in the current directory
program
  .command('init')
  .description('Initialize a project in the current directory')
  .action(require('./init'));

// The install command adds a dependency to the current project
program
  .command('add [repo] [path]')
  .description('Add a git repository as a dependency')
  .option('-s, --sha [sha]', 'The SHA to check out of the repo')
  .option('-b, --branch [branch]', 'The branch to follow for this package')
  .action(require('./add'));

// The sync command pulls new code for dependencies, if relevant
program
  .command('sync [path]')
  .description('Pull the latest code for all dependencies')
  .option('-r, --recursive', 'Also sync dependencies\' dependencies, ad infinitum')
  .action(require('./sync'));

// The rm command removes a dependency from the project
program
  .command('rm [path]')
  .description('Remove a dependency')
  .action(require('./rm'));

module.exports = program;
