var IoC = require('electrolyte');
var thrift = require('thrift');
var expect = require('chai').expect;
var faker = require('faker');
var app = require('../index');
var ProjectService = require('ckube-api/lib/ProjectService');
var Project = require('ckube-api/lib/CKube_types').Project;
var ConfigurationService = require('ckube-api/lib/ConfigurationService');
var Configuration = require('ckube-api/lib/CKube_types').Configuration;
var ConfigurationSpec = require('ckube-api/lib/CKube_types').ConfigurationSpec;
var ConfigurationSpecType = require('ckube-api/lib/CKube_types').ConfigurationSpecType;
var ValidationException = require('ckube-api/lib/CKube_types').ValidationException;

describe("ConfigurationService", function() {
  var connection = null;
  var ProjectClient = null;
  var Client = null;
  var configuration = null;

  before(function(done) {
    app.boot(function(error) {
      if (error) {
        console.log(error.message);
        console.log(error.stack);
      }

      connection = thrift.createWSConnection('localhost', 8080, {
        transport: thrift.TBufferedTransport,
        protocol: thrift.TJSONProtocol,
        path: '/'
      });

      connection.on('open', function() {
        var Multiplexer = new thrift.Multiplexer();
        ProjectClient = Multiplexer.createClient('Project', ProjectService, connection);
        Client = Multiplexer.createClient('Configuration', ConfigurationService, connection);
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
  });

  it('check validate configuration', function(done) {
    Client.createConfiguration(new Configuration(), function(error) {
      expect(error).to.be.an.instanceof(ValidationException);
      expect(error.errors).to.have.deep.property('[0].field', 'project');
      expect(error.errors).to.have.deep.property('[1].field', 'name');
      done();
    });
  });

  it('check create configuration', function(done) {
    var project = new Project({
      name: faker.random.uuid(),
      code: faker.random.uuid()
    });

    ProjectClient.createProject(project, function(error, project) {
      var controller = new ConfigurationSpec({
        type: ConfigurationSpecType.CONTROLLER,
        content: "{}"
      });

      var service = new ConfigurationSpec({
        type: ConfigurationSpecType.SERVICE,
        content: "{}"
      });

      configuration = new Configuration({
        name: faker.random.uuid(),
        project: project,
        specs: [controller, service]
      });

      Client.createConfiguration(configuration, function(error, result) {
        expect(result.name).to.equal(configuration.name);
        expect(result._id).to.exist();
        configuration = result;
        done();
      });
    });
  });

  it('check get list configuration', function(done) {
    Client.getConfigurations(configuration.project, function(error, configurations) {
      expect(configurations).to.deep.include.members([configuration]);
      done();
    });
  });

  it('check delete configuration', function(done) {
    Client.deleteConfiguration(configuration, function(error) {
      expect(error).to.not.exist();
      done();
    });
  });
});
