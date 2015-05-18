var Client = require('node-kubernetes-client');

exports = module.exports = function(config) {
  return new Client({
    host: config.get('KUBERNETES_MASTER_SERVICE_HOST') + ':' + config.get('KUBERNETES_MASTER_SERVICE_PORT'),
    protocol: 'http',
    version: 'v1beta1'
  });
};

exports['@singleton'] = true;
exports['@require'] = ['config'];
