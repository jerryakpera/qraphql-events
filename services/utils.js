const bcrypt = require("bcryptjs")

module.exports = {
  getHash: (password) => {
    return bcrypt.hash(password, 12)
  },
  getDateFromString: (dateString) => new Date(dateString).toISOString(),
  comparePassword: (password1, password2) => {
    return bcrypt.compare(password1, password2)
  }
}