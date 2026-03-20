import { describe, it, expect } from "vitest";
import { createJobSchema, updateJobSchema } from "@/types/jobs";

describe("createJobSchema", () => {
  it("accepts valid job with company, role, and url", () => {
    const result = createJobSchema.safeParse({
      company: "Acme Corp",
      role: "Frontend Engineer",
      url: "https://example.com/jobs/123",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid job with empty url", () => {
    const result = createJobSchema.safeParse({
      company: "Acme Corp",
      role: "Frontend Engineer",
      url: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty company", () => {
    const result = createJobSchema.safeParse({
      company: "",
      role: "Frontend Engineer",
      url: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const companyError = result.error.issues.find(
        (i) => i.path[0] === "company"
      );
      expect(companyError?.message).toBe("Company name is required");
    }
  });

  it("rejects empty role", () => {
    const result = createJobSchema.safeParse({
      company: "Acme Corp",
      role: "",
      url: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const roleError = result.error.issues.find(
        (i) => i.path[0] === "role"
      );
      expect(roleError?.message).toBe("Role is required");
    }
  });

  it("rejects invalid url format", () => {
    const result = createJobSchema.safeParse({
      company: "Acme Corp",
      role: "Engineer",
      url: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("rejects javascript: protocol url", () => {
    const result = createJobSchema.safeParse({
      company: "Acme Corp",
      role: "Engineer",
      url: "javascript:alert(1)",
    });
    expect(result.success).toBe(false);
  });

  it("accepts http:// url", () => {
    const result = createJobSchema.safeParse({
      company: "Acme Corp",
      role: "Engineer",
      url: "http://example.com/job",
    });
    expect(result.success).toBe(true);
  });

  it("accepts https:// url", () => {
    const result = createJobSchema.safeParse({
      company: "Acme Corp",
      role: "Engineer",
      url: "https://example.com/job",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing fields", () => {
    const result = createJobSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects null values", () => {
    const result = createJobSchema.safeParse({
      company: null,
      role: null,
      url: null,
    });
    expect(result.success).toBe(false);
  });
});

describe("updateJobSchema", () => {
  it("accepts valid status", () => {
    const result = updateJobSchema.safeParse({ status: "interview" });
    expect(result.success).toBe(true);
  });

  it("accepts valid position", () => {
    const result = updateJobSchema.safeParse({ position: 5 });
    expect(result.success).toBe(true);
  });

  it("accepts both status and position", () => {
    const result = updateJobSchema.safeParse({
      status: "offer",
      position: 0,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty object (no fields provided)", () => {
    const result = updateJobSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects invalid status", () => {
    const result = updateJobSchema.safeParse({ status: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects negative position", () => {
    const result = updateJobSchema.safeParse({ position: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer position", () => {
    const result = updateJobSchema.safeParse({ position: 1.5 });
    expect(result.success).toBe(false);
  });

  it("accepts all valid statuses", () => {
    for (const status of ["applied", "interview", "offer", "rejected"]) {
      const result = updateJobSchema.safeParse({ status });
      expect(result.success).toBe(true);
    }
  });

  it("accepts position zero", () => {
    const result = updateJobSchema.safeParse({ position: 0 });
    expect(result.success).toBe(true);
  });
});
