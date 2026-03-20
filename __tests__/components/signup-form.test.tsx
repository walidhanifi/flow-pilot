import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "@/components/forms/signup-form";

const mockPush = vi.fn();
const mockRefresh = vi.fn();
const mockSignUp = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabaseClient: () => ({
    auth: {
      signUp: mockSignUp,
    },
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("SignupForm", () => {
  it("renders email, password, and confirm password fields", () => {
    render(<SignupForm />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign up" })
    ).toBeInTheDocument();
  });

  it("renders link to login page", () => {
    render(<SignupForm />);

    const link = screen.getByRole("link", { name: "Log in" });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("shows validation error for mismatched passwords", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(
      screen.getByLabelText("Confirm password"),
      "different123"
    );
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(
        screen.getByText("Passwords do not match")
      ).toBeInTheDocument();
    });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("shows validation errors for short passwords", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "short");
    await user.type(screen.getByLabelText("Confirm password"), "short");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      const errors = screen.getAllByText(
        "Password must be at least 8 characters"
      );
      expect(errors.length).toBeGreaterThanOrEqual(1);
    });
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("redirects to /dashboard when session is returned (no email confirmation)", async () => {
    mockSignUp.mockResolvedValue({
      data: { session: { access_token: "token" } },
      error: null,
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(
      screen.getByLabelText("Confirm password"),
      "password123"
    );
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("shows confirmation message when email confirmation is required", async () => {
    mockSignUp.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(
      screen.getByLabelText("Confirm password"),
      "password123"
    );
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(screen.getByText("Check your email")).toBeInTheDocument();
      expect(screen.getByText(/user@example.com/)).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("shows generic error on signup failure", async () => {
    mockSignUp.mockResolvedValue({
      data: { session: null },
      error: { message: "User already registered" },
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(
      screen.getByLabelText("Confirm password"),
      "password123"
    );
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(
        screen.getByText("Could not create account. Please try again.")
      ).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("passes emailRedirectTo option to signUp", async () => {
    mockSignUp.mockResolvedValue({
      data: { session: null },
      error: null,
    });
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(
      screen.getByLabelText("Confirm password"),
      "password123"
    );
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password123",
        options: {
          emailRedirectTo: expect.stringContaining("/auth/callback"),
        },
      });
    });
  });

  it("disables button while loading", async () => {
    let resolveSignUp: (value: unknown) => void;
    mockSignUp.mockReturnValue(
      new Promise((resolve) => {
        resolveSignUp = resolve;
      })
    );
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText("Email"), "user@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(
      screen.getByLabelText("Confirm password"),
      "password123"
    );
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Creating account..." })
      ).toBeDisabled();
    });

    resolveSignUp!({ data: { session: null }, error: null });
  });
});
