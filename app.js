const express = require("express")
const bodyParser = require("body-parser")
const graphqlHttp = require("express-graphql")
const { buildSchema } = require("graphql")

const app = express()

app.use(bodyParser.json())

const Event = require("./db/models/Events")

// Create graphql endpoint 
app.use("/graphql", graphqlHttp({
  // Schema points to schemas
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }
  
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  // rootValue Points to resolvers
  rootValue: {
    events: () => {
      return Event.find().then(events => {
        return events.map(event => {
          return { ...event._doc }
        })
      }).catch(err => {
        console.log(err)
        throw err
      })
    },
    createEvent: (args) => {
      const event = new Event ({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date)
      })

      return event.save().then(result => {
        return { ...result._doc }
      }).catch(err => {
        console.log(err)
        throw err
      })
    }
  },
  graphiql: true
}))

// ERROR Middleware
// Handles routes that are not handled by our application
app.use((req, res, next) => {
  const err = new Error("Not found!")
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    }
  })
})



module.exports = app