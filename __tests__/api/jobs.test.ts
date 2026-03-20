import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() =>
    Promise.resolve({
      auth: { getUser: mockGetUser },
      from: mockFrom,
    })
  ),
}));

const { GET, POST } = await import("@/app/api/jobs/route");

beforeEach(() => {
  vi.clearAllMocks();
});

const MOCK_USER = { id: "user-1", email: "test@example.com" };

function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function createChain(
  finalResult: { data?: unknown; error?: unknown },
  options?: { terminator?: "limit" | "single" | "maybeSingle" }
) {
  const terminator = options?.terminator ?? "limit";
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
  };
  if (terminator === "limit") {
    chain.limit.mockResolvedValue(finalResult);
  } else if (terminator === "maybeSingle") {
    chain.maybeSingle.mockResolvedValue(finalResult);
  } else {
    chain.single.mockResolvedValue(finalResult);
  }
  return chain;
}

describe("GET /api/jobs", () => {
  it("returns 401 when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ success: false, error: "Unauthorized" });
  });

  it("returns jobs for authenticated user", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });
    const jobs = [
      { id: "1", company: "Acme", role: "Engineer", status: "applied", position: 0 },
    ];
    const chain = createChain({ data: jobs, error: null });
    mockFrom.mockReturnValue(chain);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, data: jobs });
    expect(mockFrom).toHaveBeenCalledWith("jobs");
    expect(chain.eq).toHaveBeenCalledWith("user_id", MOCK_USER.id);
    expect(chain.limit).toHaveBeenCalledWith(200);
  });

  it("returns 500 with generic message on database error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });
    const chain = createChain({
      data: null,
      error: { message: "relation \"jobs\" does not exist" },
    });
    mockFrom.mockReturnValue(chain);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Could not load your jobs. Please try again.");
    // Must NOT leak the actual database error
    expect(body.error).not.toContain("relation");
  });
});

describe("POST /api/jobs", () => {
  it("returns 401 when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const request = createRequest({
      company: "Acme",
      role: "Engineer",
      url: "",
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ success: false, error: "Unauthorized" });
  });

  it("returns 400 for invalid body", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });

    const request = createRequest({ company: "", role: "", url: "" });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error).toBeDefined();
  });

  it("returns 400 for malformed JSON", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });

    const request = new NextRequest("http://localhost:3000/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not json{{{",
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ success: false, error: "Invalid JSON body" });
  });

  it("creates a job with correct position", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });

    const newJob = {
      id: "new-1",
      user_id: MOCK_USER.id,
      company: "Acme",
      role: "Engineer",
      url: "",
      status: "applied",
      position: 3,
      created_at: "2026-01-01",
    };

    // First call: get max position (terminates with .maybeSingle())
    const positionChain = createChain(
      { data: { position: 2 }, error: null },
      { terminator: "maybeSingle" }
    );
    // Second call: insert (terminates with .single())
    const insertChain = createChain(
      { data: newJob, error: null },
      { terminator: "single" }
    );

    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? positionChain : insertChain;
    });

    const request = createRequest({
      company: "Acme",
      role: "Engineer",
      url: "",
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body).toEqual({ success: true, data: newJob });
  });

  it("returns 500 with generic message on insert error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });

    const positionChain = createChain(
      { data: null, error: null },
      { terminator: "maybeSingle" }
    );
    const insertChain = createChain(
      {
        data: null,
        error: { message: "duplicate key value violates unique constraint" },
      },
      { terminator: "single" }
    );

    let callCount = 0;
    mockFrom.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? positionChain : insertChain;
    });

    const request = createRequest({
      company: "Acme",
      role: "Engineer",
      url: "",
    });
    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Could not create job. Please try again.");
    expect(body.error).not.toContain("duplicate");
  });
});
