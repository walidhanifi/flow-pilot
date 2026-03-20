import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock @supabase/ssr before importing middleware
const mockGetUser = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
  })),
}));

// Must import after mocks are set up
const { middleware } = await import("@/middleware");

function createRequest(url: string): NextRequest {
  return new NextRequest(new URL(url, "http://localhost:3000"));
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
});

describe("middleware", () => {
  describe("unauthenticated user", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
    });

    it("redirects /dashboard to /login", async () => {
      const request = createRequest("/dashboard");
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe(
        "/login"
      );
    });

    it("redirects /dashboard/settings to /login", async () => {
      const request = createRequest("/dashboard/settings");
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe(
        "/login"
      );
    });

    it("allows access to /login", async () => {
      const request = createRequest("/login");
      const response = await middleware(request);

      expect(response.status).toBe(200);
    });

    it("allows access to /signup", async () => {
      const request = createRequest("/signup");
      const response = await middleware(request);

      expect(response.status).toBe(200);
    });

    it("allows access to /auth/callback", async () => {
      const request = createRequest("/auth/callback?code=abc");
      const response = await middleware(request);

      expect(response.status).toBe(200);
    });

    it("allows access to root /", async () => {
      const request = createRequest("/");
      const response = await middleware(request);

      expect(response.status).toBe(200);
    });

    it("redirects any unknown protected route to /login", async () => {
      const request = createRequest("/settings");
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe(
        "/login"
      );
    });
  });

  describe("authenticated user", () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-1", email: "test@example.com" } },
      });
    });

    it("redirects /login to /dashboard", async () => {
      const request = createRequest("/login");
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe(
        "/dashboard"
      );
    });

    it("redirects /signup to /dashboard", async () => {
      const request = createRequest("/signup");
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe(
        "/dashboard"
      );
    });

    it("allows access to /dashboard", async () => {
      const request = createRequest("/dashboard");
      const response = await middleware(request);

      expect(response.status).toBe(200);
    });

    it("allows access to /", async () => {
      const request = createRequest("/");
      const response = await middleware(request);

      expect(response.status).toBe(200);
    });
  });
});
