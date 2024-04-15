const { selectAllTreasures } = require("../models/topics-models");
exports.getAllTopics = (req, res, next) => {
  selectAllTreasures()
    .then(({ rows }) => {
      const topics = rows;
      res.status(200).send(topics);
    })
    .catch((error) => {
      next(error);
    });
};
