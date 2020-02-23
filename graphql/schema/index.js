const { buildSchema } = require("graphql")

module.exports = buildSchema(`
type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
  createdAt: String!
  updatedAt: String!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdEvents: [Event!]
  createdAt: String!
  updatedAt: String!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: String!
}

input UserInput {
  email: String!
  password: String!
}

type RootQuery {
  users: [User!]!
  events: [Event!]!
}

type RootMutation {
  createUser(userInput: UserInput): User
  createEvent(eventInput: EventInput): Event
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`)