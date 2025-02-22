const request = require("supertest");
const app = require("../src/app");

describe("User Endpoints", () => {
  let createdUserId;
  const testUser = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
  };

  it("should create a new user", async () => {
    const res = await request(app).post("/api/users").send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty(
      "message",
      "Utilisateur enregistré avec succès"
    );
    expect(res.body.user).toHaveProperty("id");
    createdUserId = res.body.user.id;
  });

  it("should retrieve users (excluding password)", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should login the created user", async () => {
    const res = await request(app).post("/api/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Connexion réussie");
    expect(res.body.user).toHaveProperty("id");
  });
});
