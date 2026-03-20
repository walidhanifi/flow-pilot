import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockExchangeCodeForSession = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        exchangeCodeForSession: mockExchangeCodeForSession,
      },
    })
  ),
}));

const { GET } = await import("@/app/auth/callback/route");

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
});

describe("GET /auth/callback", () => {
  it("redirects to /dashboard on valid code exchange", async () => {
    mockExchangeCodeForSession.mockResolvedValue({ error: null });

    const request = new NextRequest(
      new URL(
        "/auth/callback?code=valid-code-that-is-long-enough",
        "http://localhost:3000"
      )
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/dashboard"
    );
    expect(mockExchangeCodeForSession).toHaveBeenCalledWith(
      "valid-code-that-is-long-enough"
    );
  });

  it("redirects to /login with error when code exchange fails", async () => {
    mockExchangeCodeForSession.mockResolvedValue({
      error: new Error("Invalid code"),
    });

    const request = new NextRequest(
      new URL(
        "/auth/callback?code=invalid-code-that-is-long",
        "http://localhost:3000"
      )
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?error=auth_callback_failed"
    );
  });

  it("redirects to /login with error when no code param", async () => {
    const request = new NextRequest(
      new URL("/auth/callback", "http://localhost:3000")
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?error=auth_callback_failed"
    );
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("redirects to /login with error when code is too short", async () => {
    const request = new NextRequest(
      new URL("/auth/callback?code=short", "http://localhost:3000")
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?error=auth_callback_failed"
    );
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("redirects to /login with error when code is empty", async () => {
    const request = new NextRequest(
      new URL("/auth/callback?code=", "http://localhost:3000")
    );
    const response = await GET(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "http://localhost:3000/login?error=auth_callback_failed"
    );
    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
  });

  it("uses NEXT_PUBLIC_APP_URL for redirect, not request origin", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://tracker.example.com";
    mockExchangeCodeForSession.mockResolvedValue({ error: null });

    const request = new NextRequest(
      new URL(
        "/auth/callback?code=valid-code-that-is-long-enough",
        "http://evil.com"
      )
    );
    const response = await GET(request);

    expect(response.headers.get("location")).toBe(
      "https://tracker.example.com/dashboard"
    );
  });
});
