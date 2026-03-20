import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/dashboard/header";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Header", () => {
  it("displays the user email", () => {
    render(<Header email="test@example.com" />);

    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("displays the app name", () => {
    render(<Header email="test@example.com" />);

    expect(screen.getByText("Tracker")).toBeInTheDocument();
  });

  it("renders a logout button", () => {
    render(<Header email="test@example.com" />);

    expect(
      screen.getByRole("button", { name: "Log out" })
    ).toBeInTheDocument();
  });

  it("calls logout API and redirects on click", async () => {
    mockFetch.mockResolvedValue({ ok: true });
    const user = userEvent.setup();
    render(<Header email="test@example.com" />);

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/auth/logout", {
        method: "POST",
      });
      expect(mockRefresh).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("shows loading state while logging out", async () => {
    let resolveFetch: (value: unknown) => void;
    mockFetch.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );
    const user = userEvent.setup();
    render(<Header email="test@example.com" />);

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Logging out..." })
      ).toBeDisabled();
    });

    resolveFetch!({ ok: true });
  });

  it("resets loading state on non-200 response", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });
    const user = userEvent.setup();
    render(<Header email="test@example.com" />);

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Log out" })
      ).not.toBeDisabled();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("resets loading state on network error", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));
    const user = userEvent.setup();
    render(<Header email="test@example.com" />);

    await user.click(screen.getByRole("button", { name: "Log out" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Log out" })
      ).not.toBeDisabled();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });
});
