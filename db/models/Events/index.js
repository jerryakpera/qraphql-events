// Config
const currentEnv = require("../../../config/env").env
const config = require(`../../../config/${currentEnv}config.json`)

const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, {
  versionKey: false,
  timestamps: true
})

eventSchema.plugin(uniqueValidator)

module.exports = mongoose.model("Events", eventSchema)