var IoC = require('electrolyte');
var expect = require('chai').expect;
var faker = require('faker');
var request = require('request');
var thrift = require('thrift');
var app = require('../index');
var ProjectService = require('ckube-api/lib/ProjectService');
var Project = require('ckube-api/lib/CKube_types').Project;
var ConfigurationService = require('ckube-api/lib/ConfigurationService');
var Configuration = require('ckube-api/lib/CKube_types').Configuration;
var ConfigurationSpec = require('ckube-api/lib/CKube_types').ConfigurationSpec;
var ConfigurationSpecType = require('ckube-api/lib/CKube_types').ConfigurationSpecType;
var DeploymentService = require('ckube-api/lib/DeploymentService');

describe("DeploymentService", function() {
  var connection = null;
  var ProjectClient = null;
  var ConfigurationClient = null;
  var Client = null;
  var configuration = null;

  before(function(done) {
    app.boot(function(error) {
      if (error) {
        console.log(error.message);
        console.log(error.stack);
      }

      IoC.create('queue').testMode.enter();

      connection = thrift.createWSConnection('localhost', 8080, {
        transport: thrift.TBufferedTransport,
        protocol: thrift.TJSONProtocol,
        path: '/'
      });

      connection.on('open', function() {
        var Multiplexer = new thrift.Multiplexer();
        ProjectClient = Multiplexer.createClient('Project', ProjectService, connection);
        ConfigurationClient = Multiplexer.createClient('Configuration', ConfigurationService, connection);
        Client = Multiplexer.createClient('Deployment', DeploymentService, connection);
        done();
      });

      connection.on('error', function(error) {
        console.log(error);
        done();
      });

      connection.open();
    });
  });

  after(function() {
    connection.close();
    IoC.create('server').close();
    IoC.create('apiServer').close();
    IoC.create('queue').testMode.exit();
  });

  it('check trigger drone hook', function(done) {
    var project = new Project({
      name: faker.random.uuid(),
      code: faker.random.uuid()
    });

    ProjectClient.createProject(project, function(error, project) {
      var controller = new ConfigurationSpec({
        type: ConfigurationSpecType.CONTROLLER,
        content: JSON.stringify(require('./fixtures/controller.json'))
      });

      var service = new ConfigurationSpec({
        type: ConfigurationSpecType.SERVICE,
        content: JSON.stringify(require('./fixtures/service.json'))
      });

      configuration = new Configuration({
        name: faker.random.uuid(),
        project: project,
        specs: [controller, service]
      });

      ConfigurationClient.createConfiguration(configuration, function(error, result) {
        var url = 'http://localhost:3000/api/hooks/drone/' + project.code;
        var json = require('./fixtures/hook.json');
        configuration = result;

        request.post({url: url, json: json}, function(error) {
          expect(error).to.equal(null);
          expect(IoC.create('queue').testMode.jobs.length).to.equal(1);
          expect(IoC.create('queue').testMode.jobs[0].data.configuration._id).to.equal(configuration._id);
          done();
        });
      });
    });
  });

  it('check get list deployments', function(done) {
    Client.getDeployments(configuration, function(error, deployments) {
      expect(deployments[0].configuration._id).to.equal(configuration._id);
      done();
    });
  });
});
