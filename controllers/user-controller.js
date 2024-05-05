const { fetchAllUsers, fetchUserByUsername } = require("../models/user-model");

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

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then(({ rows }) => {
      const user = rows;
      res.status(200).send({ user: user[0] });
    })
    .catch((err) => {
      next(err);
    });
};
