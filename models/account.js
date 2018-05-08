const db = require('./database')
const bcrypt = require('bcrypt')
const score = require('./score')
const saltRounds = 10

class Account {
  constructor (username = undefined, password = undefined, userID = undefined) {
    this.username = username
    this.password = password
    this.userID = userID
    this.currentScore = new score.Score()
  }

  /**
   * @desc [To be determined]
   * @returns {undefined}
   */
  login (username, password) {
    console.log(username)
    console.log(password)
    return new Promise((resolve, reject) => {
      db.executeQuery(`SELECT * FROM public."ACCOUNTS" WHERE "USERNAME" = '${username}';`).then((queryResult) => {
        let result = JSON.parse(queryResult)
        if (bcrypt.compareSync(password, result[0].PASSWORD)) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  encryptPassword (password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10).then((hash) => {
        resolve(hash)
      })
    })
  }

  /**
   * @desc [To be determined]
   * @returns {undefined}
   */
  register (username, password) {
    return new Promise((resolve, reject) => {
      this.encryptPassword(password).then((result) => {
        db.executeQuery(`INSERT INTO public."ACCOUNTS"("USERNAME", "PASSWORD") VALUES ('${username}', '${result}');`).then((result) => {
          resolve(result)
        })
      })
    })
  }

  validateUsername (USERNAME) {
    return new Promise((resolve, reject) => {
      db.executeQuery('SELECT "USERNAME" FROM "ACCOUNTS"').then((result) => {
        let userArray = JSON.parse(result)
        var found = userArray.some(function (el) {
          return el.USERNAME === USERNAME
        })
        resolve(!found)
      })
    })
  }

  toJSON () {
    return {
      'username': this.username,
      'password': this.password,
      'userID': this.userID,
      'currentScore': this.currentScore.toJSON()
    }
  }

  validatePassword (pass) {
    let numbers = pass.match(/\d+/g)
    let uppers = pass.match(/[A-Z]/)
    let lowers = pass.match(/[a-z]/)
    let lengths = pass.length >= 6
    let valid = undefined

    if (numbers === null || uppers === null || lowers === null || lengths === false) valid = false

    if (numbers !== null && uppers !== null && lowers !== null && lengths) valid = true

    return valid
  }
}

module.exports = {
  Account
}
