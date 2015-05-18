var swig = require('swig');

exports = module.exports = function() {
  return {
    render: function(spec, params) {
      var tpl = swig.compile(spec);
      return tpl(params);
    }
  };
};
