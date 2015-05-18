var IoC = require('electrolyte');
var bootable = require('bootable');

var app = bootable({});
app.phase(bootable.initializers('ioc', app));

app.phase(function(done) {
  IoC.create('server').listen(8080, function() {
    console.log('Listening server on port 8080');
  });

  IoC.create('apiServer').listen(3000, function() {
    console.log('Listening apiServer on port 3000');
  });

  done();
});

module.exports = app;
