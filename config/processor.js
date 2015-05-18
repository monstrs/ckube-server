var thrift = require('thrift');
var ProjectService = require('ckube-api/lib/ProjectService');
var ConfigurationService = require('ckube-api/lib/ConfigurationService');
var DeploymentService = require('ckube-api/lib/DeploymentService');

exports = module.exports = function(ProjectHandler, ConfigurationHandler, DeploymentHandler) {
  var processor = new thrift.MultiplexedProcessor();
  processor.registerProcessor('Project', new ProjectService.Processor(ProjectHandler));
  processor.registerProcessor('Configuration', new ConfigurationService.Processor(ConfigurationHandler));
  processor.registerProcessor('Deployment', new DeploymentService.Processor(DeploymentHandler));
  return processor;
};

exports['@singleton'] = true;
exports['@require'] = ['handler/Project', 'handler/Configuration', 'handler/Deployment'];
