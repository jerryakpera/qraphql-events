// Config
const currentEnv = require("./config/env").env
const config = require(`./config/${currentEnv}config.json`)

const app = require("./app")

const port = config.port

const db = require("./db/db")

app.listen(port, () => {
  console.log(`App now listening to ${port}`)
})