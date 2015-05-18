var async = require('async');

exports = module.exports = function(kubeClient) {
  var createService = function(spec, callback) {
    kubeClient.services.create(spec.spec, function(error) {
      callback(error);
    });
  };

  return function(job, done) {
    var specs = job.data.jobs.filter(function(job) {
      return job.job === 'create-service';
    });

    async.map(specs, createService, function(error) {
      done(error, job.data);
    });
  };
};

exports['@require'] = [
  'kubeClient'
];
