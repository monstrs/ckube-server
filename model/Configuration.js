var _ = require('lodash');
var CKubeTypes = require('ckube-api/lib/CKube_types');

exports = module.exports = function(db, specModel) {
  var Schema = db.Schema;

  var ConfigurationSchema = new Schema({
    _id: String,
    name: {
      type: String,
      required: true
    },
    expression: {
      type: String
    },
    project: {
      type: db.Schema.ObjectId,
      ref: 'Project',
      required: true
    },
    specs: [specModel.schema]
  });

  ConfigurationSchema.methods = CKubeTypes.Configuration.prototype;
  ConfigurationSchema.methods.toTObject = function() {
    var relations = {};

    if (this.specs) {
      relations.specs = [];
      this.specs.forEach(function(spec) {
        relations.specs.push(new CKubeTypes.ConfigurationSpec(spec.toObject()));
      });
    }

    if (this.project) {
      relations.project = new CKubeTypes.Project(this.project.toObject());
    }

    return new CKubeTypes.Configuration(_.assign(this.toObject(), relations));
  };

  ConfigurationSchema.pre('save', function(next) {
    if (!this._id) {
      this._id = new db.mongo.ObjectID();
    }

    next();
  });

  return db.model('Configuration', ConfigurationSchema);
};

exports['@singleton'] = true;
exports['@require'] = ['db', 'model/ConfigurationSpec'];
