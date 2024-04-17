const db = require("../db/index");


exports.fetchAllUsers = () => {
  return db.query(
    `SELECT * FROM users`
  )
}