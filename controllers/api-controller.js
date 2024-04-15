const endpoints = require("../endpoints.json");

exports.getAllApis = (req, res, next) => {
  res.status(200).send(endpoints);
};
