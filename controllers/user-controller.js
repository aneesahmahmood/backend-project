const { fetchAllUsers } = require("../models/user-model");

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
    .then(({ rows }) => {
      const users = rows;
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};
