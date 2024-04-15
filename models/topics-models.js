const db = require("../db/index");

exports.selectAllTreasures = () => {
  return db.query(`SELECT * FROM topics`);
};
