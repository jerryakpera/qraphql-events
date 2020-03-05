const express = require("express")
const bodyParser = require("body-parser")
const graphqlHttp = require("express-graphql")
const schema = require("./graphql/schema")
const resolvers = require("./graphql/resolvers")

const app = express()
// console.log(resolvers)
app.use(bodyParser.json())

// Create graphql endpoint 
app.use("/graphql", graphqlHttp({
  // Schema points to schemas
  schema: schema,
  // rootValue Points to resolvers
  rootValue: resolvers,
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