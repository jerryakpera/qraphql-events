const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  hash: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  versionKey: false
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)