var CKubeTypes = require('ckube-api/lib/CKube_types');

exports = module.exports = function(db) {
  var Schema = db.Schema;

  var ConfigurationSpecSchema = new Schema({
    _id: String,
    type: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  });

  ConfigurationSpecSchema.methods = CKubeTypes.ConfigurationSpec.prototype;

  ConfigurationSpecSchema.pre('save', function(next) {
    if (!this._id) {
      this._id = new db.mongo.ObjectID();
    }

    next();
  });

  return db.model('ConfigurationSpec', ConfigurationSpecSchema);
};

exports['@singleton'] = true;
exports['@require'] = ['db'];
