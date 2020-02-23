const bcryptjs = require("bcryptjs")

module.exports = {
  getHash: (password) => {
    return bcryptjs.hash(password, 12)
  },
  getDateFromString: (dateString) => new Date(dateString).toISOString()
}