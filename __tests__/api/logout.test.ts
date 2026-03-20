import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGetUser = vi.fn();
const mockSignOut = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        getUser: mockGetUser,
        signOut: mockSignOut,
      },
    })
  ),
}));

const { POST } = await import("@/app/api/auth/logout/route");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/logout", () => {
  it("returns 401 when user is not authenticated", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body).toEqual({ success: false, error: "Unauthorized" });
    expect(mockSignOut).not.toHaveBeenCalled();
  });

  it("signs out authenticated user and returns success", async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1", email: "test@example.com" } },
    });
    mockSignOut.mockResolvedValue({ error: null });

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(mockSignOut).toHaveBeenCalledOnce();
  });

  it("calls getUser before signOut (auth check first)", async () => {
    const callOrder: string[] = [];
    mockGetUser.mockImplementation(async () => {
      callOrder.push("getUser");
      return { data: { user: { id: "user-1" } } };
    });
    mockSignOut.mockImplementation(async () => {
      callOrder.push("signOut");
      return { error: null };
    });

    await POST();

    expect(callOrder).toEqual(["getUser", "signOut"]);
  });
});
