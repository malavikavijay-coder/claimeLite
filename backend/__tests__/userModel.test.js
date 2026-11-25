const User = require("../models/User");

describe("User Model Validation", () => {
  const validUserData = {
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "1234567890"
  };

  const validateUser = async (data) => {
    try {
      const user = new User(data);
      await user.validate();
      return { user, error: null };
    } catch (error) {
      return { error };
    }
  };

  it("should validate a valid user object", async () => {
    const { user, error } = await validateUser(validUserData);
    expect(error).toBeNull();
    expect(user.fullName).toBe("Jane Doe");
    expect(user.email).toBe("jane.doe@example.com");
    expect(user.phone).toBe("1234567890");
  });

  it("should require fullName", async () => {
    const { error } = await validateUser({ ...validUserData, fullName: "" });
    expect(error).toBeDefined();
    expect(error.errors.fullName).toBeDefined();
  });

  it("should require fullName minlength of 2", async () => {
    const { error } = await validateUser({ ...validUserData, fullName: "J" });
    expect(error).toBeDefined();
    expect(error.errors.fullName).toBeDefined();
  });

  it("should require fullName maxlength of 50", async () => {
    const { error } = await validateUser({ ...validUserData, fullName: "A".repeat(51) });
    expect(error).toBeDefined();
    expect(error.errors.fullName).toBeDefined();
  });

  it("should require email", async () => {
    const { error } = await validateUser({ ...validUserData, email: "" });
    expect(error).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it("should trim and lowercase email", async () => {
    const user = new User({ ...validUserData, email: "  TEST.USER@EXAMPLE.COM  " });
    expect(user.email).toBe("test.user@example.com");
  });

  it("should require phone", async () => {
    const { error } = await validateUser({ ...validUserData, phone: "" });
    expect(error).toBeDefined();
    expect(error.errors.phone).toBeDefined();
  });

  it("should reject invalid phone format (not 10 digits)", async () => {
    const invalidPhones = ["12345", "12345678901", "abcdefghij", "123-456-7890"];
    for (const phone of invalidPhones) {
      const { error } = await validateUser({ ...validUserData, phone });
      expect(error).toBeDefined();
      expect(error.errors.phone).toBeDefined();
    }
  });

  it("should accept valid 10-digit phone numbers", async () => {
    const { error } = await validateUser({ ...validUserData, phone: "9876543210" });
    expect(error).toBeNull();
  });
});
