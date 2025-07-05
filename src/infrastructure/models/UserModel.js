const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  names: String,
  lastName: String,
  username: String,
  email: { type: String, unique: true },
  password: String,
  provider: String,
  providerId: String,
  avatarUrl: String,
  topLanguages: [String],
  token: String
});

module.exports = mongoose.model('users', UserSchema);
