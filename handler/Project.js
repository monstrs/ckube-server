var TApplicationException = require('thrift').TApplicationException;
var ValidationException = require('ckube-api/lib/CKube_types').ValidationException;
var ValidationError = require('ckube-api/lib/CKube_types').ValidationError;

var ProjectHandler = function(Project) {
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
    getProjects: function(result) {
      Project.find({}, function(error, projects) {
        if (error) {
          result(processError(error));
        } else {
          result(null, projects);
        }
      });
    },

    createProject: function(data, result) {
      Project.create(data, function(error, project) {
        if (error) {
          result(processError(error));
        } else {
          result(null, project);
        }
      });
    },

    updateProject: function(data, result) {
      Project.findById(data._id, function(error, project) {
        project.name = data.name;
        project.save(function(error) {
          if (error) {
            result(processError(error));
          } else {
            result(null, project);
          }
        });
      });
    },

    deleteProject: function(data, result) {
      Project.remove({_id: data._id}, function(error) {
        result(error);
      });
    }
  };
};

exports = module.exports = ProjectHandler;
exports['@require'] = ['model/Project'];
