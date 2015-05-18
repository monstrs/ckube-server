var thrift = require('thrift');

exports = module.exports = function(app) {
  return thrift.createWebServer(app);
};

exports['@singleton'] = true;
exports['@require'] = ['app'];
