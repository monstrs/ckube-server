var TApplicationException = require('thrift').TApplicationException;
var ValidationException = require('ckube-api/lib/CKube_types').ValidationException;
var ValidationError = require('ckube-api/lib/CKube_types').ValidationError;

var DeploymentHandler = function(Deployment) {
  var processError = function(error) {
    if (error.name === "ValidationError") {
      var errors = [];
      Object.keys(error.errors).forEach(function(field) {
        var validation = error.errors[field];
        errors.push(new ValidationError({field: field, message: validation.message}));
      });
      return new ValidationException({message: error.message, errors: errors});
    } else {
      return new TApplicationException({message: error.message});
    }
  };

  return {
    getDeployments: function(configuration, result) {
      Deployment.find().populate({path: 'configuration', select: '_id name'}).exec(function(error, deployments) {
        if (error) {
          result(processError(error));
        } else {
          var related = deployments.filter(function(deployment) { return deployment.configuration._id === configuration._id; });
          var data = related.map(function (deployment) { return deployment.toTObject(); });
          result(null, data);
        }
      });
    }
  };
};

exports = module.exports = DeploymentHandler;
exports['@require'] = ['model/Deployment'];
