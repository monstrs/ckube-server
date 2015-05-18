var UrlPattern = require('url-pattern');

exports = module.exports = function(deploy) {
  return function (req, res, next) {
    var pattern = new UrlPattern('/api/hooks/drone/*');
    var match = pattern.match(req.url);

    if (!(match && match._)) {
      return next();
    }

    console.log(req.body);

    deploy(match._, req.body, function (error) {
      if (error) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  };
};

exports['@singleton'] = true;
exports['@require'] = ['service/deploy'];
