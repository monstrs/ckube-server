var IoC = require('electrolyte');
var expect = require('chai').expect;
var faker = require('faker');
var thrift = require('thrift');
var app = require('../index');
var ProjectService = require('ckube-api/lib/ProjectService');
var Project = require('ckube-api/lib/CKube_types').Project;
var ValidationException = require('ckube-api/lib/CKube_types').ValidationException;

describe("ProjectService", function() {
  var connection = null;
  var Client = null;
  var project = null;

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
        Client = Multiplexer.createClient('Project', ProjectService, connection);
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

  it('check validate project', function(done) {
    Client.createProject(new Project(), function(error) {
      expect(error).to.be.an.instanceof(ValidationException);
      expect(error.errors).to.have.deep.property('[0].field', 'code');
      expect(error.errors).to.have.deep.property('[1].field', 'name');
      done();
    });
  });

  it('check create project', function(done) {
    project = new Project({
      name: faker.random.uuid(),
      code: faker.random.uuid()
    });

    Client.createProject(project, function(error, result) {
      expect(result.name).to.equal(project.name);
      expect(result._id).to.exist();
      project = result;
      done();
    });
  });

  it('check update project', function(done) {
    project.name = faker.random.uuid();
    Client.updateProject(project, function(error, result) {
      expect(result.name).to.equal(project.name);
      expect(result._id).to.equal(project._id);
      project = result;
      done();
    });
  });

  it('check get list projects', function(done) {
    Client.getProjects(function(error, projects) {
      expect(projects).to.deep.include.members([project]);
      done();
    });
  });

  it('check delete project', function(done) {
    Client.deleteProject(project, function(error) {
      expect(error).to.not.exist();
      done();
    });
  });
});
