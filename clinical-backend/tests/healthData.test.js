const request = require("supertest");
const app = require("../src/app");

describe("HealthData Endpoints", () => {
  let testUserId;
  let createdHealthDataId;

  beforeAll(async () => {
    const res = await request(app).post("/api/users").send({
      name: "Health Tester",
      email: "healthtester@example.com",
      password: "password123",
    });
    testUserId = res.body.user.id;
  });

  it("should save health data", async () => {
    const healthData = {
      userId: testUserId,
      heartRate: 80,
      bloodPressure: "120/80",
      oxygenLevel: 98,
    };

    const res = await request(app).post("/api/healthData").send(healthData);

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty(
      "message",
      "Données de santé enregistrées avec succès"
    );
    expect(res.body.healthData).toHaveProperty("_id");
    createdHealthDataId = res.body.healthData._id;
  });

  it("should retrieve health data for a user", async () => {
    const res = await request(app).get(`/api/healthData/${testUserId}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
