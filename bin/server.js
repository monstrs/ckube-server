var app = require('../index');

app.boot(function(error) {
  if (error) {
    console.log(error.message);
    console.log(error.stack);
    process.exit(-1);
  }
});
