const User = require("../../db/models/User")
const Event = require("../../db/models/Event")

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
          date: new Date(event._doc.date).toISOString(),
          createdAt: new Date(event._doc.createdAt).toISOString(),
          updatedAt: new Date(event._doc.updatedAt).toISOString(),
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
        createdAt: new Date(user._doc.createdAt).toISOString(),
        updatedAt: new Date(user._doc.updatedAt).toISOString(),
        createdEvents: events.bind(this, user.createdEvents)
      }
    })
    .catch(err => {
      throw err
    })
}

module.exports = {
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
            date: new Date(event._doc.date).toISOString(),
            createdAt: new Date(event._doc.createdAt).toISOString(),
            updatedAt: new Date(event._doc.updatedAt).toISOString(),
            creator: user.bind(this, event._doc.creator)
          }
        })
      }).catch(err => {
        throw err
      })
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
    return event.save().then(result => {
      createdEvent = {
        ...result._doc,
        date: new Date(result._doc.date).toISOString(),
        createdAt: new Date(result._doc.createdAt).toISOString(),
        updatedAt: new Date(result._doc.updatedAt).toISOString(),
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
          createdAt: new Date(result._doc.createdAt).toISOString(),
          updatedAt: new Date(result._doc.updatedAt).toISOString(),
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