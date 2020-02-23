// Config
const currentEnv = require("../../../config/env").env
const config = require(`../../../config/${currentEnv}config.json`)

const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectID,
      ref: "Event"
    }
  ]
}, {
  versionKey: false,
  timestamps: true
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model("User", userSchema)