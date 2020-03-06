const jwt = require("jsonwebtoken")
// Config
const currentEnv = require("../config/env").env
const config = require(`../config/${currentEnv}config.json`)

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization")
  if (!authHeader) {
    req.isAuth = false
    return next()
  }
  
  const token = authHeader.split(" ")[1]
  if (!token || token === "") {
    req.isAuth = false
    return next()
  }
  let decodedToken
  try {
    decodedToken = jwt.verify(token, config.secret)
  } catch(err) {
    req.isAuth = false
    return next()
  }
  
  if (!decodedToken) {
    req.isAuth = false
    return next()
  }

  req.isAuth = true
  req.userID = decodedToken.userID
  next()
}