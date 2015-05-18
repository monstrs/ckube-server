var kue = require('kue');

exports = module.exports = function(config, init, deleteController, deleteService, createController, createService) {
  var queue = kue.createQueue({
    redis: {
      host: config.getRedisHost(),
      port: config.getRedisPort()
    }
  });

  queue.process('init', init);
  queue.process('delete-controller', deleteController);
  queue.process('delete-service', deleteService);
  queue.process('create-controller', createController);
  queue.process('create-service', createService);

  var processDeleteControllerJob = function(config) {
    queue.create('delete-controller', config).save();
  };

  var processDeleteServiceJob = function(config) {
    queue.create('delete-service', config).save();
  };

  var processCreateControllerJob = function(config) {
    queue.create('create-controller', config).save();
  };

  var processCreateServiceJob = function(config) {
    queue.create('create-service', config).save();
  };

  queue.on('job complete', function(id, result){
    kue.Job.get(id, function(error, job) {
      switch (job.type) {
        case 'init':
          processDeleteControllerJob(result);
          break;
        case 'delete-controller':
          processDeleteServiceJob(result);
          break;
        case 'delete-service':
          processCreateControllerJob(result);
          break;
        case 'create-controller':
          processCreateServiceJob(result);
          break;
        case 'create-service':
          console.log('final');
          break;
      }
    });
  });

  return queue;
};

exports['@singleton'] = true;
exports['@require'] = [
  'config',
  'jobs/init',
  'jobs/deleteController',
  'jobs/deleteService',
  'jobs/createController',
  'jobs/createService'
];
