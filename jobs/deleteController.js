var qs = require('qs');
var async = require('async');

exports = module.exports = function(kubeClient) {
  var deletePod = function(spec, callback) {
    kubeClient.pods.delete(spec.id, true, callback);
  };

  var deleteControllerPods = function(spec, callback) {
    var query = qs.stringify(spec.desiredState.replicaSelector);
    kubeClient.pods.get({labels: query}, function(error, pods) {
      if (error) {
        return callback(error);
      }

      async.map(pods[0].items, deletePod, callback);
    });
  };

  var deleteController = function(spec, callback) {
    kubeClient.replicationControllers.delete(spec.spec.id, true, function(error) {
      if (error) {
        return callback(error);
      }

      deleteControllerPods(spec.spec, callback);
    });
  };

  return function(job, done) {
    var specs = job.data.jobs.filter(function(job) {
      return job.job === 'delete-controller';
    });

    async.map(specs, deleteController, function(error) {
      done(error, job.data);
    });
  };
};

exports['@require'] = [
  'kubeClient'
];
