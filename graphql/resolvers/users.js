const User = require("../../db/models/User")
const _ = require("../../services/utils")
const { transformUser  } = require("./merge")

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
  login: ({email, password}) => {
    User.findOne({email})
    .then(user => {
      if (!user) {
        throw new Error("Invalid credentials")
      }
      _.comparePassword(password, user.password).then(isEqual => {
        if (!isEqual) {
          throw new Error("Invalid credentials")
        }
        
      })
      .catch(err => {
        throw err
      })
    })
    .catch(err => {
      throw err
    })
  }
}