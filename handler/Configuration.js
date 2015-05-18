var TApplicationException = require('thrift').TApplicationException;
var ValidationException = require('ckube-api/lib/CKube_types').ValidationException;
var ValidationError = require('ckube-api/lib/CKube_types').ValidationError;

var ConfigurationHandler = function(Configuration) {
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
    getConfigurations: function(project, result) {
      Configuration.find({'project': project._id}).populate({path: 'project'}).exec(function(error, configurations) {
        if (error) {
          result(processError(error));
        } else {
          var data = configurations.map(function (configuration) { return configuration.toTObject(); });
          result(null, data);
        }
      });
    },

    createConfiguration: function(data, result) {
      Configuration.create(data, function(error, configuration) {
        if (error) {
          result(processError(error));
        } else {
          configuration.populate({path: 'project'}, function(error, configuration) {
            if (error) {
              result(processError(error));
            } else {
              result(null, configuration.toTObject());
            }
          });
        }
      });
    },

    updateConfiguration: function(data, result) {
      Configuration.findById(data._id, function(error, configuration) {
        configuration.name = data.name;
        configuration.save(function(error) {
          if (error) {
            result(processError(error));
          } else {
            result(null, configuration);
          }
        });
      });
    },

    deleteConfiguration: function(data, result) {
      Configuration.remove({_id: data._id}, function(error) {
        result(error);
      });
    }
  };
};

exports = module.exports = ConfigurationHandler;
exports['@require'] = ['model/Configuration'];
