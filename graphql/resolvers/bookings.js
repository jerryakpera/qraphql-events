const Booking = require("../../db/models/Booking")
// Helper functions
const _ = require("../../services/utils")
const { transformBooking, transformEvent } = require("./merge")

module.exports = {
  bookings: () => {
    return Booking.find()
      .then(bookings => {
        return bookings.map(booking => {
          return transformBooking(booking._doc)
        })
      })
  },
  bookEvent: (args) => {
    const booking = new Booking({
      event: args.bookingInput.event,
      user: args.bookingInput.user
    })
    let createdBooking
    return booking.save()
      .then(result => {
        createdBooking = transformBooking(result._doc)
        return createdBooking
      })
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingID).populate("event")
      const event = transformEvent(booking.event._doc)
      await Booking.deleteOne({_id: args.bookingID})
      return event
    } catch(err) {
      throw err
    }
  }
}