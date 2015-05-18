var mongoose = require('mongoose');

exports = module.exports = function(config) {
  mongoose.connect(config.getDBUrl());
  return mongoose;
};

exports['@singleton'] = true;
exports['@require'] = ['config'];
