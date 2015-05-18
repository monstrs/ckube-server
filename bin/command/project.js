var thrift = require('thrift');
var createConnection = require('./createConnection');
var ProjectService = require('ckube-api/lib/ProjectService');
var Project = require('ckube-api/lib/CKube_types').Project;

module.exports = {
  create: function(argv) {
    createConnection(function(error, connection) {
      if (error) {
        return;
      }

      var client = (new thrift.Multiplexer()).createClient('Project', ProjectService, connection);

      var project = new Project({
        name: argv.name,
        code: argv.code,
        description: argv.description
      });

      client.createProject(project, function(error, result) {
        if (error) {
          console.log(error);
        } else {
          console.log('Project created with id ' + result._id);
        }

        connection.close();
        process.exit(0);
      });
    });
  },

  get: function() {
    createConnection(function(error, connection) {
      if (error) {
        return;
      }

      var client = (new thrift.Multiplexer()).createClient('Project', ProjectService, connection);

      client.getProjects(function(error, projects) {
        if (error) {
          console.log(error);
        } else {
          console.log(projects);
        }

        connection.close();
        process.exit(0);
      });
    });
  }
};
