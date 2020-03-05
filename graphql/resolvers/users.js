const jwt = require("jsonwebtoken")
const User = require("../../db/models/User")
const _ = require("../../services/utils")
const {
  transformUser
} = require("./merge")
// Config
const currentEnv = require("../../config/env").env
const config = require(`../../config/${currentEnv}config.json`)

module.exports = {
  users: () => {
    return User.find({})
      .then(users => {
        return users.map(user => {
          return transformUser(user._doc)
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
        return transformUser(user._doc)
      }).catch(err => {
        throw err
      })
    }).catch(err => {
      throw err
    })
  },
  login: async ({
    email,
    password
  }) => {
    const user = await User.findOne({
      email: email
    })

    if (!user) {
      throw new Error("Invalid credentials!")
    }
    
    const isEqual = await _.comparePassword(password, user.password)
    
    if (!isEqual) {
      throw new Error("Invalid credentials!")
    }

    const token = jwt.sign({
        userID: user._id,
        email: user.email
      },
      config.secret, {
        expiresIn: "1h"
      }
    )

    return {
      userID: user._id,
      token,
      tokenExpiration: 1
    }
  }
}