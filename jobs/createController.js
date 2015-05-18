var qs = require('qs');
var async = require('async');

exports = module.exports = function(kubeClient) {
  var retries = 50;
  var retryTimeout = 4000;

  var waitPods = function(spec, callback) {
    var currentRetry = 0;
    var running = false;
    var query = qs.stringify(spec.desiredState.replicaSelector);

    async.until(function () {
      return running;
    }, function (callback) {
      kubeClient.pods.get({labels: query}, function(error, pods) {
        if (error) {
          return callback(error);
        }

        currentRetry++;

        var items = pods[0].items;

        if (items.length === 0) {
          return setTimeout(callback, retryTimeout);
        }

        var runned = items.filter(function (item) {
          console.log('Status for pod ' + item.id + ' ' + item.currentState.status);
          return item.currentState.status === 'Running';
        });

        running = runned.length === items.length;

        if (currentRetry === retries) {
          callback('Timeout');
        } else {
          setTimeout(callback, retryTimeout);
        }
      });
    }, function (error) {
      callback(error);
    });
  };

  var createController = function(spec, callback) {
    kubeClient.replicationControllers.create(spec.spec, function(error) {
      if (error) {
        return callback(error);
      }

      waitPods(spec.spec, callback);
    });
  };

  return function(job, done) {
    var specs = job.data.jobs.filter(function(job) {
      return job.job === 'create-controller';
    });

    async.map(specs, createController, function(error) {
      done(error, job.data);
    });
  };
};

exports['@require'] = [
  'kubeClient'
];
