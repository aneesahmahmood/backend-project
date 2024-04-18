const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET 200: Responds with all topics and their details", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ _body }) => {
        const topics = _body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });

  test("GET 200: filters the results by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("GET 200: filters the results by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  test("GET 404: responds with an error message when a valid but non existant topic is passed", () => {
    return request(app)
      .get("/api/articles?topic=grapes")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("No articles found");
      });
  });
});

describe("/api", () => {
  test("GET 200: Responds with the contents of the file", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: Responds with the appropriate article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body;
        expect(article).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("GET 404: Responds with an error message when the id does not exist on the database", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });

  test("GET 400: Responds with an error message for invalid article ID format", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });

  test("GET 200: should also respond with a comment_count for the article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
      });
  });

  test("GET 404: Responds with an error message when the id does not exist on the database", () => {
    return request(app)
      .get("/api/articles/15426")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("not found");
      });
  });

  test("GET 400: Responds with an error message for invalid article ID format", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: Responds with all articles with the additional property of comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });

  test("GET 200: Results are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles/")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("GET 400: Responds with an error message when the id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: return all comments for the appropriate article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        comments.rows.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });

  test("GET 200: Results are sorted by comments in a descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.rows).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("GET 200: return an empty array if the article has no associated comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.rows).toHaveLength(0);
      });
  });

  test("POST 201: Successfully adds a comment for an article", () => {
    const testComment = {
      username: "butter_bridge",
      body: "test comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(testComment)
      .expect(201)
      .then(({ _body }) => {
        const { comment } = _body;
        expect(comment.comment_id).toBe(19);
        expect(comment.body).toBe("test comment");
      });
  });

  test("POST:400 responds with a status and error message when provided with no username", () => {
    const testComment = {
      body: "test comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        const msg = body;
        expect(msg).toEqual({ msg: "bad request" });
      });
  });

  test("POST:404 responds with a status and error message when provided with a non-existent id", () => {
    const testComment = {
      username: "butter_bridge",
      body: "test comment",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        const msg = body;
        expect(msg).toEqual({ msg: "not found!" });
      });
  });
});

describe("returns an error when the file is not found", () => {
  test("GET 404: Responds with a 404 error if not found", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found!");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("PATCH 200: Successfully increments the votes", () => {
    const testPatch = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("PATCH 200: Successfully decrements the votes", () => {
    const testPatch = { inc_votes: -10 };
    return request(app)
      .patch("/api/articles/1")
      .send(testPatch)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 90,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("PATCH 400: Invalid article_id input", () => {
    const testPatch = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/invalid_input")
      .send(testPatch)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });

  test("PATCH 404: article_id not found", () => {
    const testPatch = { inc_votes: 1 };
    return request(app)
      .patch("/api/treasures/764837")
      .send(testPatch)
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found!");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: successfully removes the comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("DELETE 404: comment_id not found", () => {
    return request(app)
      .delete("/api/treasures/90837")
      .expect(404)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Not found!");
      });
  });

  test("DELETE 400: Invalid comment_id input", () => {
    return request(app)
      .delete("/api/comments/invalid_input")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET 200: responds with all users and their properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.rows.length).toBe(4);
        users.rows.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});
