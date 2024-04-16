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
