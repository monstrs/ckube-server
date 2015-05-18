var nconf = require('nconf');
var thrift = require('thrift');

module.exports = function(callback) {
  nconf.argv().env();

  var host = nconf.get('CKUBE_SERVER_HOST') || 'localhost';
  var port = nconf.get('CKUBE_SERVER_PORT') || 8080;

  var connection = thrift.createWSConnection(host, port, {
    transport: thrift.TBufferedTransport,
    protocol: thrift.TJSONProtocol,
    path: '/'
  });

  connection.on('open', function() {
    callback(null, connection);
  });

  connection.on('error', function(error) {
    callback(error);
  });

  connection.open();
};
