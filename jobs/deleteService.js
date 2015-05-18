var async = require('async');

exports = module.exports = function(kubeClient) {
  var deleteService = function(spec, callback) {
    kubeClient.services.delete(spec.spec.id, function(error) {
      callback(error);
    });
  };

  return function(job, done) {
    var specs = job.data.jobs.filter(function(job) {
      return job.job === 'delete-service';
    });

    async.map(specs, deleteService, function(error) {
      done(error, job.data);
    });
  };
};

exports['@require'] = [
  'kubeClient'
];
