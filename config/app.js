var thrift = require('thrift');

exports = module.exports = function(processor) {
  return {
    services: {
      "/": {
        transport: thrift.TBufferedTransport,
        protocol: thrift.TJSONProtocol,
        processor: processor
      }
    }
  };
};

exports['@singleton'] = true;
exports['@require'] = ['processor'];
