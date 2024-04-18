
const db = require("../db/connection");

exports.selectAllTreasures = () => {
  return db.query(`SELECT * FROM topics`);
};
