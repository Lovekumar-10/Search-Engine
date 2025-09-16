
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // optional Google login
  githubId: { type: String, unique: true, sparse: true }, // optional GitHub login
  email: { type: String },  // now optional
  name: { type: String },
  photo: { type: String },
  refreshTokenHash: { type: String, default: null },
  tokenVersion: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
module.exports = User;


