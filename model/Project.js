var CKubeTypes = require('ckube-api/lib/CKube_types');

exports = module.exports = function(db) {
  var Schema = db.Schema;

  var ProjectSchema = new Schema({
    _id: String,
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      index: {
        unique: true
      }
    },
    description: String
  });

  ProjectSchema.methods = CKubeTypes.Project.prototype;

  ProjectSchema.pre('save', function(next) {
    if (!this._id) {
      this._id = new db.mongo.ObjectID();
    }

    next();
  });

  return db.model('Project', ProjectSchema);
};

exports['@singleton'] = true;
exports['@require'] = [ 'db'];
