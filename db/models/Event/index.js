// Config
const currentEnv = require("../../../config/env").env
const config = require(`../../../config/${currentEnv}config.json`)

const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

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
  },
  creator: {
    type: Schema.Types.ObjectID,
    required: true,
    ref: "User"
  }
}, {
  versionKey: false,
  timestamps: true
})

eventSchema.plugin(uniqueValidator)

module.exports = mongoose.model("Event", eventSchema)