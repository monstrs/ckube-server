var IoC = require('electrolyte');

module.exports = function() {
  IoC.loader(IoC.node('config'));
  IoC.loader('model', IoC.node('model'));
  IoC.loader('handler', IoC.node('handler'));
  IoC.loader('hook', IoC.node('hook'));
  IoC.loader('service', IoC.node('service'));
  IoC.loader('utils', IoC.node('utils'));
  IoC.loader('jobs', IoC.node('jobs'));
};
