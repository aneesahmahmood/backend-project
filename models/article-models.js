const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
      SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      WHERE articles.article_id = $1
      GROUP BY 
      articles.article_id 
      ORDER BY 
      articles.created_at DESC
      `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.selectAllArticles = (topic, sort_by = "created_at", order = "desc") => {
  let queries = [];
  const validQueries = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "article_img_url",
    "comment_count",
  ];

  const validOrders = ["asc", "desc"];

  if (!validQueries.includes(sort_by) || !validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid request received" });
  } else {
    let sqlQuery = `
    SELECT 
      articles.article_id,
      articles.author, 
      articles.title, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url, 
      CAST(COUNT(comments.comment_id) AS INT) as comment_count
    FROM 
      articles
    LEFT JOIN 
      comments ON comments.article_id = articles.article_id
  `;

    if (topic) {
      sqlQuery += ` WHERE topic = $1`;
      queries.push(topic);
    }

    sqlQuery += `
    GROUP BY 
      articles.article_id 
    ORDER BY 
      ${sort_by} ${order};
  `;

    return db.query(sqlQuery, queries).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No articles found" });
      }
      return rows;
    });
  }
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `
  SELECT * FROM articles
  WHERE article_id = $1`,
      [article_id]
    )
    .then(({ rows: article }) => {
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
    });
};

exports.addComment = (newComment, article_id) => {
  const { username, body } = newComment;
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *; 
  `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db.query(
    `
 SELECT
    comment_id,votes, created_at, author, body, article_id
FROM comments
WHERE article_id = $1
ORDER BY created_at DESC 
 `,
    [article_id]
  );
};
