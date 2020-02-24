const User = require("../../db/models/User")
const Event = require("../../db/models/Event")
const _ = require("../../services/utils")

const transformEvent = event => {
  return {
    ...event,
    date: _.getDateFromString(event.date),
    createdAt: _.getDateFromString(event.createdAt),
    updatedAt: _.getDateFromString(event.updatedAt),
    creator: user.bind(this, event.creator)
  }
}

const events = eventIDs => {
  return Event.find({
      _id: {
        $in: eventIDs
      }
    })
    .then(events => {
      return events.map(event => {
        return transformEvent(event._doc)
      })
    })
    .catch(err => {
      throw err
    })
}

const user = userID => {
  return User.findById(userID)
    .then(user => {
      return transformUser(user._doc)
    })
    .catch(err => {
      throw err
    })
}

const findEvent = eventID => {
  return Event.findById(eventID)
  .then(event => {
    return transformEvent(event._doc)
  })
}

const transformBooking = booking => {
  return {
    ...booking,
    createdAt: _.getDateFromString(booking.createdAt),
    updatedAt: _.getDateFromString(booking.updatedAt),
    event: findEvent.bind(this, booking.event),
    user: user.bind(this, booking.user)
  }
}

const transformUser = user => {
  return {
    ...user,
    password: null,
    createdAt: _.getDateFromString(user.createdAt),
    updatedAt: _.getDateFromString(user.updatedAt),
    createdEvents: events.bind(this, user.createdEvents)
  }
}


exports.events = events
exports.user = user
exports.findEvent = findEvent
exports.transformEvent = transformEvent
exports.transformBooking = transformBooking
exports.transformUser = transformUser