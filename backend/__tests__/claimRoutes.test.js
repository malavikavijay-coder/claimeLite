const request = require("supertest");
const app = require("../app");
const Claim = require("../models/Claim");
const User = require("../models/User");

jest.mock("../models/Claim");
jest.mock("../models/User");

describe("Claim Routes Unit Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("POST /api/claims", () => {
    it("should return 400 when required fields are missing", async () => {
      const payload = {
        claimType: "Auto",
        amount: 500,
        description: "Car hit parking pole"
      };

      const response = await request(app).post("/api/claims").send(payload);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User, claim type, amount and description are required");
    });

    it("should return 404 when user is not found in database", async () => {
      User.findById.mockResolvedValueOnce(null);

      const response = await request(app)
        .post("/api/claims")
        .send({
          userId: "507f1f77bcf86cd799439011",
          claimType: "Auto",
          amount: 500,
          description: "Rear bumper damaged in collision"
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
      expect(User.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
    });

    it("should create claim and return 201 when inputs are valid", async () => {
      const mockUser = {
        _id: "507f1f77bcf86cd799439011",
        fullName: "Test User",
        email: "test@example.com"
      };
      User.findById.mockResolvedValueOnce(mockUser);

      const mockSavedClaim = {
        _id: "607f1f77bcf86cd799439022",
        userId: "507f1f77bcf86cd799439011",
        claimType: "Auto",
        amount: 800,
        description: "Rear bumper damaged in collision",
        createdAt: new Date().toISOString()
      };
      Claim.prototype.save = jest.fn().mockResolvedValueOnce(mockSavedClaim);

      const response = await request(app)
        .post("/api/claims")
        .send({
          userId: "507f1f77bcf86cd799439011",
          claimType: "Auto",
          amount: 800,
          description: "Rear bumper damaged in collision"
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockSavedClaim);
    });

    it("should return 500 when saving claim fails", async () => {
      User.findById.mockResolvedValueOnce({ _id: "507f1f77bcf86cd799439011" });
      Claim.prototype.save = jest.fn().mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app)
        .post("/api/claims")
        .send({
          userId: "507f1f77bcf86cd799439011",
          claimType: "Auto",
          amount: 800,
          description: "Rear bumper damaged in collision"
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Unable to create claim");
    });
  });

  describe("GET /api/claims", () => {
    it("should return 200 with populated claims list sorted by createdAt desc", async () => {
      const mockClaims = [
        {
          _id: "claim1",
          claimType: "Auto",
          amount: 1000,
          userId: { fullName: "Alice", email: "alice@example.com" }
        }
      ];

      const populateMock = jest.fn().mockReturnThis();
      const sortMock = jest.fn().mockResolvedValueOnce(mockClaims);
      populateMock.mockReturnValueOnce({ sort: sortMock });

      Claim.find.mockReturnValueOnce({
        populate: populateMock
      });

      const response = await request(app).get("/api/claims");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockClaims);
      expect(Claim.find).toHaveBeenCalled();
      expect(populateMock).toHaveBeenCalledWith("userId", "fullName email");
      expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
    });

    it("should return 500 when fetching claims throws an error", async () => {
      Claim.find.mockReturnValueOnce({
        populate: jest.fn().mockReturnValueOnce({
          sort: jest.fn().mockRejectedValueOnce(new Error("DB error"))
        })
      });

      const response = await request(app).get("/api/claims");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Unable to fetch claims");
    });
  });

  describe("POST /api/claims/analyze", () => {
    it("should return 400 when body is empty or description is not a string", async () => {
      const response = await request(app)
        .post("/api/claims/analyze")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Description must be between 10 and 500 characters");
    });

    it("should return 400 when description is less than 10 characters", async () => {
      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Too short" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Description must be between 10 and 500 characters");
    });

    it("should return 400 when description is more than 500 characters", async () => {
      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "a".repeat(501) });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Description must be between 10 and 500 characters");
    });

    it("should return 503 when GEMINI_API_KEY is missing", async () => {
      delete process.env.GEMINI_API_KEY;

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Valid length claim description for accident" });

      expect(response.status).toBe(503);
      expect(response.body.message).toContain("Claim analysis is not configured");
    });

    it("should return 503 when GEMINI_API_KEY is placeholder", async () => {
      process.env.GEMINI_API_KEY = "replace_with_your_gemini_api_key";

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Valid length claim description for accident" });

      expect(response.status).toBe(503);
      expect(response.body.message).toContain("Claim analysis is not configured");
    });

    it("should return 200 with claimType and riskScore when Gemini returns valid analysis", async () => {
      process.env.GEMINI_API_KEY = "test_gemini_key";

      const mockGeminiResponse = {
        candidates: [
          {
            content: {
              parts: [{ text: JSON.stringify({ claimType: "Auto", riskScore: 4 }) }]
            }
          }
        ]
      };

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockGeminiResponse
      });

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Rear bumper damaged in collision while parked" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        claimType: "Auto",
        riskScore: 4
      });
      expect(global.fetch).toHaveBeenCalled();
    });

    it("should return 503 when Gemini returns 429 (rate limit) or 503", async () => {
      process.env.GEMINI_API_KEY = "test_gemini_key";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 429
      });

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Rear bumper damaged in collision while parked" });

      expect(response.status).toBe(503);
      expect(response.body.message).toBe("Gemini is temporarily busy. Please try again shortly.");
    });

    it("should return 503 when Gemini returns 401 or 403 (invalid key)", async () => {
      process.env.GEMINI_API_KEY = "test_gemini_key";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Rear bumper damaged in collision while parked" });

      expect(response.status).toBe(503);
      expect(response.body.message).toBe("Gemini rejected the API key. Check GEMINI_API_KEY and its API access.");
    });

    it("should return 503 when Gemini model returns 404 (model unavailable)", async () => {
      process.env.GEMINI_API_KEY = "test_gemini_key";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 404
      });

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Rear bumper damaged in collision while parked" });

      expect(response.status).toBe(503);
      expect(response.body.message).toBe("The configured Gemini model is unavailable. Update GEMINI_MODEL to a supported model.");
    });

    it("should return 502 when Gemini returns non-ok status like 500", async () => {
      process.env.GEMINI_API_KEY = "test_gemini_key";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Rear bumper damaged in collision while parked" });

      expect(response.status).toBe(502);
      expect(response.body.message).toBe("The AI service could not analyze this claim. Please try again.");
    });

    it("should return 502 when Gemini returns empty response parts", async () => {
      process.env.GEMINI_API_KEY = "test_gemini_key";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ candidates: [{ content: { parts: [{}] } }] })
      });

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Rear bumper damaged in collision while parked" });

      expect(response.status).toBe(502);
      expect(response.body.message).toBe("The AI service returned an empty analysis. Please try again.");
    });

    it("should return 502 when Gemini returns invalid JSON text", async () => {
      process.env.GEMINI_API_KEY = "test_gemini_key";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: "not a valid json" }] } }]
        })
      });

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Rear bumper damaged in collision while parked" });

      expect(response.status).toBe(502);
      expect(response.body.message).toBe("The AI service returned an invalid analysis. Please try again.");
    });

    it("should return 502 when Gemini returns invalid claimType or out-of-bounds riskScore", async () => {
      process.env.GEMINI_API_KEY = "test_gemini_key";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [{ content: { parts: [{ text: JSON.stringify({ claimType: "InvalidType", riskScore: 12 }) }] } }]
        })
      });

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Rear bumper damaged in collision while parked" });

      expect(response.status).toBe(502);
      expect(response.body.message).toBe("The AI service returned an invalid analysis. Please try again.");
    });

    it("should return 504 when request times out (AbortError)", async () => {
      process.env.GEMINI_API_KEY = "test_gemini_key";

      const abortError = new Error("The operation was aborted");
      abortError.name = "AbortError";

      global.fetch = jest.fn().mockRejectedValueOnce(abortError);

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Rear bumper damaged in collision while parked" });

      expect(response.status).toBe(504);
      expect(response.body.message).toBe("Claim analysis timed out. Please try again.");
    });

    it("should return 502 on general fetch network failure with unnamed error", async () => {
      process.env.GEMINI_API_KEY = "test_gemini_key";

      const genericError = { message: "Network connection error" };
      global.fetch = jest.fn().mockRejectedValueOnce(genericError);

      const response = await request(app)
        .post("/api/claims/analyze")
        .send({ description: "Rear bumper damaged in collision while parked" });

      expect(response.status).toBe(502);
      expect(response.body.message).toBe("Unable to reach the AI service. Please try again.");
    });
  });
});
