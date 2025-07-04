const User = require('../../../domain/models/User');
const mongoose = require('mongoose');

class MongoUserRepository {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async save(user) {
    const created = await this.userModel.create(user);
    return new User({ id: created._id.toString(), ...created._doc });
  }

  async findByEmail(email) {
    const doc = await this.userModel.findOne({ email });
    return doc ? new User({ id: doc._id.toString(), ...doc._doc }) : null;
  }

  async findById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await this.userModel.findById(id);
    return doc ? new User({ id: doc._id.toString(), ...doc._doc }) : null;
  }
  async findAll() {
    const docs = await this.userModel.find({});
    return docs.map(doc => new User({ id: doc._id.toString(), ...doc._doc }));
  }

  async updateById(id, input) {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const updated = await this.userModel.findByIdAndUpdate(id, input, { new: true });
    return updated ? new User({ id: updated._id.toString(), ...updated._doc }) : null;
  }

}

module.exports = MongoUserRepository;
