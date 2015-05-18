var _ = require('lodash');
var async = require('async');

exports = module.exports = function(kubeClient) {
  var processController = function(spec, callback) {
    var jobs = [];
    var content = JSON.parse(spec.content);
    kubeClient.replicationControllers.getBy({name: content.id, namespace: 'default'}, function(error) {
      if (error) {
        jobs.push({
          job: 'create-controller',
          spec: content
        });
      } else {
        jobs.push({
          job: 'delete-controller',
          spec: content
        });

        jobs.push({
          job: 'create-controller',
          spec: content
        });
      }

      callback(null, jobs);
    });
  };

  var processService = function(spec, callback) {
    var jobs = [];
    var content = JSON.parse(spec.content);
    kubeClient.services.getBy({name: content.id, namespace: 'default'}, function(error) {
      if (error) {
        jobs.push({
          job: 'create-service',
          spec: content
        });
      } else {
        jobs.push({
          job: 'delete-service',
          spec: content
        });

        jobs.push({
          job: 'create-service',
          spec: content
        });
      }

      callback(null, jobs);
    });
  };

  var processSpec = function(spec, callback) {
    if (spec.type === 1) {
      processController(spec, callback);
    } else if (spec.type === 2) {
      processService(spec, callback);
    }
  };

  return function(job, done) {
    async.map(job.data.specs, processSpec, function(error, jobs) {
      done(error, {
        deployment: job.data,
        jobs: _.flatten(jobs)
      });
    });
  };
};

exports['@require'] = [
  'kubeClient'
];
