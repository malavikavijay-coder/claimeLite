const mongoose = require("mongoose");
const Claim = require("../models/Claim");

describe("Claim Model Validation", () => {
  const validClaimData = {
    userId: new mongoose.Types.ObjectId(),
    claimType: "Auto",
    amount: 1500.5,
    description: "Windshield cracked from road debris on highway"
  };

  const validateClaim = async (data) => {
    try {
      const claim = new Claim(data);
      await claim.validate();
      return { claim, error: null };
    } catch (error) {
      return { error };
    }
  };

  it("should validate a valid claim object", async () => {
    const { claim, error } = await validateClaim(validClaimData);
    expect(error).toBeNull();
    expect(claim.claimType).toBe("Auto");
    expect(claim.amount).toBe(1500.5);
    expect(claim.description).toBe("Windshield cracked from road debris on highway");
  });

  it("should require userId", async () => {
    const { error } = await validateClaim({ ...validClaimData, userId: undefined });
    expect(error).toBeDefined();
    expect(error.errors.userId).toBeDefined();
  });

  it("should require claimType", async () => {
    const { error } = await validateClaim({ ...validClaimData, claimType: undefined });
    expect(error).toBeDefined();
    expect(error.errors.claimType).toBeDefined();
  });

  it("should accept valid claim types: Auto, Home, Health", async () => {
    for (const claimType of ["Auto", "Home", "Health"]) {
      const { error } = await validateClaim({ ...validClaimData, claimType });
      expect(error).toBeNull();
    }
  });

  it("should reject invalid claim types", async () => {
    const { error } = await validateClaim({ ...validClaimData, claimType: "Travel" });
    expect(error).toBeDefined();
    expect(error.errors.claimType).toBeDefined();
  });

  it("should require amount", async () => {
    const { error } = await validateClaim({ ...validClaimData, amount: undefined });
    expect(error).toBeDefined();
    expect(error.errors.amount).toBeDefined();
  });

  it("should reject amount less than 0.01", async () => {
    const { error } = await validateClaim({ ...validClaimData, amount: 0 });
    expect(error).toBeDefined();
    expect(error.errors.amount).toBeDefined();
  });

  it("should reject amount greater than 1,000,000", async () => {
    const { error } = await validateClaim({ ...validClaimData, amount: 1000001 });
    expect(error).toBeDefined();
    expect(error.errors.amount).toBeDefined();
  });

  it("should require description", async () => {
    const { error } = await validateClaim({ ...validClaimData, description: "" });
    expect(error).toBeDefined();
    expect(error.errors.description).toBeDefined();
  });

  it("should reject description shorter than 10 characters", async () => {
    const { error } = await validateClaim({ ...validClaimData, description: "Short" });
    expect(error).toBeDefined();
    expect(error.errors.description).toBeDefined();
  });

  it("should reject description longer than 500 characters", async () => {
    const { error } = await validateClaim({ ...validClaimData, description: "a".repeat(501) });
    expect(error).toBeDefined();
    expect(error.errors.description).toBeDefined();
  });

  it("should trim description", async () => {
    const claim = new Claim({
      ...validClaimData,
      description: "   Accident happened in parking lot   "
    });
    expect(claim.description).toBe("Accident happened in parking lot");
  });
});
