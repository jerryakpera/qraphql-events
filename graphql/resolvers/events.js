const Event = require("../../db/models/Event")
const User = require("../../db/models/User")
const { transformEvent } = require("./merge")

module.exports = {
  events: () => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return transformEvent(event._doc)
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
    return event.save()
      .then(result => {
        createdEvent = transformEvent(result._doc)
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
}