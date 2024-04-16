const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db");
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

  test("GET 200: return an empty array if the article has no associated comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.rows).toHaveLength(0);
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

test("GET 400: Responds with an error message when the id is invalid", () => {
  return request(app)
    .get("/api/articles/invalid_id")
    .expect(400)
    .then(({ body }) => {
      const { msg } = body;
      expect(msg).toBe("bad request");
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
