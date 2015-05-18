var yargs = require('yargs');
var project = require('./command/project');
var configuration = require('./command/configuration');

yargs.usage('ckubectl <command>')
  .command('create', 'Create commands', function(yargs) {
    yargs.command('project', 'Create project command', function(yargs) {
      yargs
        .usage('Usage: $0 -n[string] -c[string] -d[string]')
        .option('n', {
          alias: 'name',
          demand: true,
          description: 'Project name'
        })
        .option('c', {
          alias: 'code',
          demand: true,
          description: 'Project code'
        })
        .option('d', {
          alias: 'description',
          description: 'Project description'
        });

      project.create(yargs.argv);
    });

    yargs.command('configuration', 'Create configuration command', function(yargs) {
      yargs
        .option('n', {
          alias: 'name',
          demand: true,
          description: 'Configuration name'
        })
        .option('p', {
          alias: 'project',
          demand: true,
          description: 'Configuration project id'
        })
        .option('e', {
          alias: 'expression',
          description: 'Configuration expression'
        })
        .option('s', {
          alias: 'spec',
          type: 'array',
          description: 'Configuration spec'
        });

      configuration.create(yargs.argv);
    });
  })
  .command('get', 'Get commands', function(yargs) {
    yargs.command('projects', 'Get projects command', function(yargs) {
      project.get(yargs.argv);
    });

    yargs.command('configurations', 'Get configurations command', function(yargs) {
      yargs
        .option('p', {
          alias: 'project',
          demand: true,
          description: 'Configuration project id'
        });

      configuration.get(yargs.argv);
    });
  })
  .command('delete', 'Delete commands', function(yargs) {
    yargs.command('configuration', 'Delete configuration command', function(yargs) {
      yargs
        .option('c', {
          alias: 'configuration',
          demand: true,
          description: 'Configuration id'
        });

      configuration.delete(yargs.argv);
    });
  }).argv;
