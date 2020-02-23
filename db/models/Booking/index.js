const mongoose = require("mongoose")

const Schema = mongoose.Schema

const bookingSchema = new mongoose.Schema({
  event: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Event"
  },
  user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
}, {
  versionKey: false,
  timestamps: true
})

module.exports = mongoose.model("Booking", bookingSchema)