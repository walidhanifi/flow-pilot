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

const { PATCH, DELETE } = await import("@/app/api/jobs/[id]/route");

beforeEach(() => {
  vi.clearAllMocks();
});

const MOCK_USER = { id: "user-1", email: "test@example.com" };
const JOB_ID = "job-abc-123";

function createParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function createPatchRequest(body: unknown): NextRequest {
  return new NextRequest(`http://localhost:3000/api/jobs/${JOB_ID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function createChain(finalResult: { data?: unknown; error?: unknown }) {
  const chain = {
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(finalResult),
  };
  return chain;
}

describe("PATCH /api/jobs/[id]", () => {
  it("returns 401 when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const request = createPatchRequest({ status: "interview" });
    const response = await PATCH(request, createParams(JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ success: false, error: "Unauthorized" });
  });

  it("returns 400 for malformed JSON", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });

    const request = new NextRequest(
      `http://localhost:3000/api/jobs/${JOB_ID}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: "not-json",
      }
    );
    const response = await PATCH(request, createParams(JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ success: false, error: "Invalid JSON body" });
  });

  it("returns 400 for empty body (no fields)", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });

    const request = createPatchRequest({});
    const response = await PATCH(request, createParams(JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("returns 400 for invalid status", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });

    const request = createPatchRequest({ status: "invalid_status" });
    const response = await PATCH(request, createParams(JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it("updates status successfully", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });

    const updatedJob = {
      id: JOB_ID,
      user_id: MOCK_USER.id,
      company: "Acme",
      role: "Engineer",
      status: "interview",
      position: 0,
    };
    const chain = createChain({ data: updatedJob, error: null });
    mockFrom.mockReturnValue(chain);

    const request = createPatchRequest({ status: "interview" });
    const response = await PATCH(request, createParams(JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, data: updatedJob });
    expect(chain.eq).toHaveBeenCalledWith("id", JOB_ID);
    expect(chain.eq).toHaveBeenCalledWith("user_id", MOCK_USER.id);
  });

  it("updates position successfully", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });

    const updatedJob = {
      id: JOB_ID,
      status: "applied",
      position: 5,
    };
    const chain = createChain({ data: updatedJob, error: null });
    mockFrom.mockReturnValue(chain);

    const request = createPatchRequest({ position: 5 });
    const response = await PATCH(request, createParams(JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });

  it("returns 500 with generic message on database error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });
    const chain = createChain({
      data: null,
      error: { message: "PGRST116: could not find row" },
    });
    mockFrom.mockReturnValue(chain);

    const request = createPatchRequest({ status: "offer" });
    const response = await PATCH(request, createParams(JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ success: false, error: "Failed to update job" });
    expect(body.error).not.toContain("PGRST");
  });
});

describe("DELETE /api/jobs/[id]", () => {
  it("returns 401 when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const request = new NextRequest(
      `http://localhost:3000/api/jobs/${JOB_ID}`,
      { method: "DELETE" }
    );
    const response = await DELETE(request, createParams(JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ success: false, error: "Unauthorized" });
  });

  it("deletes a job successfully", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });
    const chain = createChain({ data: { id: JOB_ID }, error: null });
    mockFrom.mockReturnValue(chain);

    const request = new NextRequest(
      `http://localhost:3000/api/jobs/${JOB_ID}`,
      { method: "DELETE" }
    );
    const response = await DELETE(request, createParams(JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(chain.eq).toHaveBeenCalledWith("id", JOB_ID);
    expect(chain.eq).toHaveBeenCalledWith("user_id", MOCK_USER.id);
  });

  it("returns 500 with generic message on database error", async () => {
    mockGetUser.mockResolvedValue({ data: { user: MOCK_USER } });
    const chain = createChain({
      data: null,
      error: { message: "foreign key constraint violation" },
    });
    mockFrom.mockReturnValue(chain);

    const request = new NextRequest(
      `http://localhost:3000/api/jobs/${JOB_ID}`,
      { method: "DELETE" }
    );
    const response = await DELETE(request, createParams(JOB_ID));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({ success: false, error: "Failed to delete job" });
    expect(body.error).not.toContain("foreign key");
  });
});
