var express = require('express');
var bodyParser = require('body-parser');

exports = module.exports = function(droneHook) {
  var app = express();

  app.use(bodyParser.json());

  app.use(droneHook);

  return app;
};

exports['@singleton'] = true;
exports['@require'] = ['hook/drone'];
