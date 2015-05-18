var nconf = require('nconf');

exports = module.exports = function() {
  nconf.argv().env();

  nconf.getDBUrl = function() {
    var host = nconf.get('CKUBE_MONGO_SERVICE_HOST') || '0.0.0.0';
    var port = nconf.get('CKUBE_MONGO_SERVICE_PORT') || 27017;

    return 'mongodb://' + host + ':' + port + '/sky_controls';
  };

  nconf.getRedisHost = function() {
    return nconf.get('CKUBE_REDIS_SERVICE_HOST') || '0.0.0.0';
  };

  nconf.getRedisPort = function() {
    return nconf.get('CKUBE_REDIS_SERVICE_PORT') || 6379;
  };

  return nconf;
};

exports["@singleton"] = true;
