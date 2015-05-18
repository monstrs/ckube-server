var http = require('http');

exports = module.exports = function(app) {
  return http.createServer(app);
};

exports['@singleton'] = true;
exports['@require'] = ['apiApp'];

