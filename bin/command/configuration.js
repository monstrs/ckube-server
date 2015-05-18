var thrift = require('thrift');
var createConnection = require('./createConnection');
var Project = require('ckube-api/lib/CKube_types').Project;
var Configuration = require('ckube-api/lib/CKube_types').Configuration;
var ConfigurationSpec = require('ckube-api/lib/CKube_types').ConfigurationSpec;
var ConfigurationService = require('ckube-api/lib/ConfigurationService');

module.exports = {
  create: function(argv) {
    createConnection(function(error, connection) {
      if (error) {
        return;
      }

      var client = (new thrift.Multiplexer()).createClient('Configuration', ConfigurationService, connection);

      var specs = [];
      argv.spec.forEach(function(spec) {
        var parsed = JSON.parse(spec);

        var attributes = {
          type: parsed.type,
          content: JSON.stringify(parsed.content)
        };

        specs.push(new ConfigurationSpec(attributes));
      });

      var configuration = new Configuration({
        name: argv.name,
        project: new Project({_id: argv.project}),
        expression: argv.expression,
        specs: specs
      });

      client.createConfiguration(configuration, function(error, result) {
        if (error) {
          console.log(error);
        } else {
          console.log('Configuration created with id ' + result._id);
        }

        connection.close();
        process.exit(0);
      });
    });
  },

  get: function(argv) {
    createConnection(function(error, connection) {
      if (error) {
        return;
      }

      var client = (new thrift.Multiplexer()).createClient('Configuration', ConfigurationService, connection);
      var project = new Project({_id: argv.project});

      client.getConfigurations(project, function(error, configurations) {
        if (error) {
          console.log(error);
        } else {
          console.log(configurations);
        }

        connection.close();
        process.exit(0);
      });
    });
  },

  delete: function(argv) {
    createConnection(function(error, connection) {
      if (error) {
        return;
      }

      var client = (new thrift.Multiplexer()).createClient('Configuration', ConfigurationService, connection);
      var configuration = new Configuration({_id: argv.configuration});

      client.deleteConfiguration(configuration, function(error) {
        if (error) {
          console.log(error);
        }

        connection.close();
        process.exit(0);
      });
    });
  }
};
