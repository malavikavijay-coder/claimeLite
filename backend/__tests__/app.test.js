const request = require("supertest");
const app = require("../app");

describe("App Endpoints & Middleware", () => {
  it("GET /api/test should return 200 with status message", async () => {
    const response = await request(app).get("/api/test");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "ClaimLite backend is working!"
    });
  });

  it("should return 404 for unknown endpoints", async () => {
    const response = await request(app).get("/api/unknown-endpoint");
    expect(response.status).toBe(404);
  });
});
