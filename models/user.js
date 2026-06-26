// Update user.js model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  facebookId: { type: String, unique: true, sparse: true },
  numero: {type: String, required: true},
  
  // Add registration tracking fields
  registrationEventId: { type: String },
  metaUserId: { type: String } // For Meta tracking if needed
  
}, { 
  timestamps: true // This adds createdAt and updatedAt automatically
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);
