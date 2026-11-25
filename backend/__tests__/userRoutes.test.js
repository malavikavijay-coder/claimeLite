const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

// Mock User model methods
jest.mock("../models/User");

describe("User Routes Unit Tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("POST /api/users", () => {
    it("should return 400 when fullName is missing", async () => {
      const response = await request(app)
        .post("/api/users")
        .send({ email: "test@example.com", phone: "1234567890" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Full name, email and phone are required");
    });

    it("should return 400 when email is missing", async () => {
      const response = await request(app)
        .post("/api/users")
        .send({ fullName: "Test User", phone: "1234567890" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Full name, email and phone are required");
    });

    it("should return 400 when phone is missing", async () => {
      const response = await request(app)
        .post("/api/users")
        .send({ fullName: "Test User", email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Full name, email and phone are required");
    });

    it("should return 409 if a user with the same email already exists", async () => {
      User.findOne.mockResolvedValueOnce({
        _id: "507f1f77bcf86cd799439011",
        email: "existing@example.com"
      });

      const response = await request(app)
        .post("/api/users")
        .send({
          fullName: "Existing User",
          email: "existing@example.com",
          phone: "1234567890"
        });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe("A user with this email is already registered");
      expect(User.findOne).toHaveBeenCalledWith({ email: "existing@example.com" });
    });

    it("should create and return 201 with saved user on valid input", async () => {
      User.findOne.mockResolvedValueOnce(null);

      const mockSavedUser = {
        _id: "507f1f77bcf86cd799439011",
        fullName: "John Doe",
        email: "john@example.com",
        phone: "9876543210",
        createdAt: new Date().toISOString()
      };

      // Mock User constructor save method
      User.prototype.save = jest.fn().mockResolvedValueOnce(mockSavedUser);

      const response = await request(app)
        .post("/api/users")
        .send({
          fullName: "John Doe",
          email: "john@example.com",
          phone: "9876543210"
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(mockSavedUser);
      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
    });

    it("should return 500 when saving user throws an error", async () => {
      User.findOne.mockResolvedValueOnce(null);
      User.prototype.save = jest.fn().mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app)
        .post("/api/users")
        .send({
          fullName: "Error User",
          email: "error@example.com",
          phone: "9876543210"
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Unable to create user");
    });
  });

  describe("GET /api/users", () => {
    it("should return 200 and list of users sorted by createdAt descending", async () => {
      const mockUsers = [
        {
          _id: "1",
          fullName: "User One",
          email: "one@example.com",
          phone: "1111111111"
        },
        {
          _id: "2",
          fullName: "User Two",
          email: "two@example.com",
          phone: "2222222222"
        }
      ];

      User.find.mockReturnValueOnce({
        sort: jest.fn().mockResolvedValueOnce(mockUsers)
      });

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalled();
    });

    it("should return 500 when fetching users throws an error", async () => {
      User.find.mockReturnValueOnce({
        sort: jest.fn().mockRejectedValueOnce(new Error("Database failure"))
      });

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Unable to fetch users");
    });
  });
});
