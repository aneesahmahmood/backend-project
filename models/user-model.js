const db = require("../db/connection");

exports.fetchAllUsers = () => {
  return db.query(`SELECT * FROM users`);
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(
      `SELECT * FROM users
      WHERE username = $1`,
      [username]
    )
    .catch((error) => {
      console.error("Error", error);
      throw error;
    });
};
