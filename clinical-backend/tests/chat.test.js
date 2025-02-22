const request = require("supertest");
const app = require("../src/app");

describe("Chat Medical Endpoints", () => {
  it("should return recommendations when a question is provided", async () => {
    const res = await request(app).post("/api/chat").send({
      question: "Quels sont les symptômes d'une hypertension?",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("recommendations");
  });

  it("should return 400 if question is missing", async () => {
    const res = await request(app).post("/api/chat").send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("message", "Une question est requise.");
  });
});
