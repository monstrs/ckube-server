var _ = require('lodash');
var CKubeTypes = require('ckube-api/lib/CKube_types');

exports = module.exports = function(db, specModel) {
  var Schema = db.Schema;

  var DeploymentSchema = new Schema({
    _id: String,
    params: {
      type: String,
      required: true
    },
    configuration: {
      type: db.Schema.ObjectId,
      ref: 'Configuration',
      required: true
    },
    specs: [specModel.schema]
  });

  DeploymentSchema.methods = CKubeTypes.Deployment.prototype;
  DeploymentSchema.methods.toTObject = function() {
    var specs = [];
    this.specs.forEach(function(spec) {
      specs.push(new CKubeTypes.ConfigurationSpec(spec.toObject()));
    });

    var configuration = new CKubeTypes.Configuration(this.configuration.toTObject());

    return new CKubeTypes.Deployment(_.assign(this.toObject(), {configuration: configuration, specs: specs}));
  };

  DeploymentSchema.pre('save', function(next) {
    if (!this._id) {
      this._id = new db.mongo.ObjectID();
    }

    next();
  });

  return db.model('Deployment', DeploymentSchema);
};

exports['@singleton'] = true;
exports['@require'] = ['db', 'model/ConfigurationSpec'];
