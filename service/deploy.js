var async = require('async');

exports = module.exports = function(Project, Configuration, Deployment, template, queue) {
  var createDeployment = function(configuration, params) {
    return function(callback) {
      var data = {
        configuration: configuration,
        params: JSON.stringify(params),
        specs: []
      };

      configuration.specs.forEach(function(spec) {
        data.specs.push({
          type: spec.type,
          content: template.render(spec.content, params)
        });
      });

      Deployment.create(data, function(error, deployment) {
        if (error) {
          callback(error);
        } else {
          callback(error, deployment);
        }
      });
    };
  };

  return function(project, params, callback) {
    Project.findOne({code: project}, function(error, project) {
      if (error) {
        return callback(error);
      }

      Configuration.find({'project': project._id}, function(error, configurations) {
        if (error) {
          return callback(error);
        } else if (!project) {
          return callback('Project not found');
        }

        var tasks = [];
        configurations.forEach(function(configuration) {
          tasks.push(createDeployment(configuration, params));
        });

        async.parallel(tasks, function(error, deployments) {
          if (error) {
            return callback(error);
          }

          var iterator = function(deployment, callback) {
            queue.create('init', deployment).save(callback);
          };

          async.map(deployments, iterator, function(error) {
            callback(error);
          });
        });
      });
    });
  };
};

exports['@singleton'] = true;
exports['@require'] = [
  'model/Project',
  'model/Configuration',
  'model/Deployment',
  'utils/template',
  'queue'
];
