const User = require("../../db/models/User")
const Event = require("../../db/models/Event")
const Booking = require("../../db/models/Booking")

// Helper functions
const _ = require("../../services/utils")

const events = eventIDs => {
  return Event.find({
      _id: {
        $in: eventIDs
      }
    })
    .then(events => {
      return events.map(event => {
        return {
          ...event._doc,
          date: _.getDateFromString(event._doc.date),
          createdAt: _.getDateFromString(event._doc.createdAt),
          updatedAt: _.getDateFromString(event._doc.updatedAt),
          creator: user.bind(this, event.creator)
        }
      })
    })
    .catch(err => {
      throw err
    })
}

const user = userID => {
  return User.findById(userID)
    .then(user => {
      return {
        ...user._doc,
        password: null,
        createdAt: _.getDateFromString(user._doc.createdAt),
        updatedAt: _.getDateFromString(user._doc.updatedAt),
        createdEvents: events.bind(this, user.createdEvents)
      }
    })
    .catch(err => {
      throw err
    })
}

const findEvent = eventID => {
  return Event.findById(eventID)
  .then(event => {
    return {
      ...event._doc,
      date: _.getDateFromString(event._doc.date),
      createdAt: _.getDateFromString(event._doc.createdAt),
      updatedAt: _.getDateFromString(event._doc.updatedAt),
      creator: user.bind(this, event.creator)
    }
  })
}

module.exports = {
  bookings: () => {
    return Booking.find()
      .then(bookings => {
        return bookings.map(booking => {
          return {
            ...booking._doc,
            createdAt: _.getDateFromString(booking._doc.createdAt),
            updatedAt: _.getDateFromString(booking._doc.updatedAt),
            event: findEvent.bind(this, booking._doc.event),
            user: user.bind(this, booking._doc.user)
          }
        })
      })
  },
  users: () => {
    return User.find({})
      .then(users => {
        return users.map(user => {
          return {
            ...user._doc,
            createdAt: new Date(user._doc.createdAt).toISOString(),
            updatedAt: new Date(user._doc.updatedAt).toISOString(),
            createdEvents: events.bind(this, user._doc.createdEvents)
          }
        })
      }).catch(err => {
        throw err
      })
  },
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            date: _.getDateFromString(event._doc.date),
            createdAt: _.getDateFromString(event._doc.createdAt),
            updatedAt: _.getDateFromString(event._doc.updatedAt),
            creator: user.bind(this, event._doc.creator)
          }
        })
      }).catch(err => {
        throw err
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
        createdBooking = {
          ...result._doc,
          createdAt: _.getDateFromString(result._doc.createdAt),
          updatedAt: _.getDateFromString(result._doc.updatedAt),
          event: findEvent.bind(this, result._doc.event),
          user: user.bind(this, result._doc.user)
        }
        return createdBooking
      })
  },
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingID).populate("event")
      const event = { 
        ...booking.event._doc,
        creator: user.bind(this, booking.event._doc.creator),
        createdAt: _.getDateFromString(booking.createdAt),
        updatedAt: _.getDateFromString(booking.updatedAt)
      }
      await Booking.deleteOne({_id: args.bookingID})
      return event
    } catch(err) {
      throw err
    }
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: args.eventInput.creator
    })
    let createdEvent
    return event.save()
      .then(result => {
        createdEvent = {
          ...result._doc,
          date: new Date(result._doc.date).toISOString(),
          createdAt: _.getDateFromString(result._doc.createdAt),
          updatedAt: _.getDateFromString(result._doc.updatedAt),
          creator: user.bind(this, result.creator)
        }
        return User.findById(event.creator).then(user => {
          if (!user) {
            throw new Error("User does not exist")
          }
          user.createdEvents.push(event)
          return user.save().then(doc => {
            return createdEvent
          })
        })
      }).catch(err => {
        throw err
      })
  },
  createUser: (args) => {
    return _.getHash(args.userInput.password).then(hash => {
      const user = new User({
        email: args.userInput.email,
        password: hash
      })

      return user.save().then(result => {
        return {
          ...result._doc,
          createdAt: _.getDateFromString(result._doc.createdAt),
          updatedAt: _.getDateFromString(result._doc.updatedAt),
          password: null
        }
      }).catch(err => {
        throw err
      })
    }).catch(err => {
      throw err
    })
  }
}