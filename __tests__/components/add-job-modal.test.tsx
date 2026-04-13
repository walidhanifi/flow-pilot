import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddJobModal } from "@/components/dashboard/add-job-modal";
import type { UseMutationResult } from "@tanstack/react-query";
import type { Job, CreateJobPayload } from "@/types/jobs";

function createMockAddJob(
  overrides: Partial<UseMutationResult<Job, Error, CreateJobPayload>> = {}
): UseMutationResult<Job, Error, CreateJobPayload> {
  return {
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue({
      id: "new-1",
      user_id: "user-1",
      company: "Acme",
      role: "Engineer",
      url: "",
      status: "applied",
      position: 0,
      notes: "",
      created_at: "2026-01-01",
    }),
    isPending: false,
    isError: false,
    isIdle: true,
    isSuccess: false,
    error: null,
    data: undefined,
    variables: undefined,
    status: "idle",
    failureCount: 0,
    failureReason: null,
    reset: vi.fn(),
    context: undefined,
    submittedAt: 0,
    ...overrides,
  } as unknown as UseMutationResult<Job, Error, CreateJobPayload>;
}

describe("AddJobModal", () => {
  let mockOnOpenChange: (open: boolean) => void;
  let mockAddJob: UseMutationResult<Job, Error, CreateJobPayload>;

  beforeEach(() => {
    mockOnOpenChange = vi.fn() as unknown as (open: boolean) => void;
    mockAddJob = createMockAddJob();
  });

  it("renders when open", () => {
    render(<AddJobModal open={true} onOpenChange={mockOnOpenChange} addJob={mockAddJob} />);

    expect(screen.getByRole("heading", { name: "Add item" })).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(<AddJobModal open={false} onOpenChange={mockOnOpenChange} addJob={mockAddJob} />);

    expect(screen.queryByRole("heading", { name: "Add item" })).not.toBeInTheDocument();
  });

  it("shows validation error for empty company", async () => {
    render(<AddJobModal open={true} onOpenChange={mockOnOpenChange} addJob={mockAddJob} />);

    const form = screen.getByRole("button", { name: /add item/i }).closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("Company name is required")).toBeInTheDocument();
    });

    expect(mockAddJob.mutateAsync).not.toHaveBeenCalled();
  });

  it("shows validation error for empty role", async () => {
    const user = userEvent.setup();
    render(<AddJobModal open={true} onOpenChange={mockOnOpenChange} addJob={mockAddJob} />);

    await user.type(screen.getByLabelText(/company/i), "Acme Corp");
    const form = screen.getByRole("button", { name: /add item/i }).closest("form")!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText("Role is required")).toBeInTheDocument();
    });
  });

  it("submits valid form data and closes", async () => {
    const user = userEvent.setup();
    render(<AddJobModal open={true} onOpenChange={mockOnOpenChange} addJob={mockAddJob} />);

    await user.type(screen.getByLabelText(/company/i), "Acme Corp");
    await user.type(screen.getByLabelText(/role/i), "Frontend Engineer");

    const submitButton = screen.getByRole("button", { name: /add item/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddJob.mutateAsync).toHaveBeenCalledWith({
        company: "Acme Corp",
        role: "Frontend Engineer",
        url: "",
      });
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it("shows error message when mutation fails", async () => {
    const failingAddJob = createMockAddJob({
      mutateAsync: vi.fn().mockRejectedValue(new Error("Server error")),
    });
    const user = userEvent.setup();

    render(<AddJobModal open={true} onOpenChange={mockOnOpenChange} addJob={failingAddJob} />);

    await user.type(screen.getByLabelText(/company/i), "Acme Corp");
    await user.type(screen.getByLabelText(/role/i), "Engineer");

    const submitButton = screen.getByRole("button", { name: /add item/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to add item. Please try again.")).toBeInTheDocument();
    });

    expect(mockOnOpenChange).not.toHaveBeenCalledWith(false);
  });

  it("shows 'Adding...' text when pending", () => {
    const pendingAddJob = createMockAddJob({ isPending: true });

    render(<AddJobModal open={true} onOpenChange={mockOnOpenChange} addJob={pendingAddJob} />);

    expect(screen.getByRole("button", { name: /adding/i })).toBeDisabled();
  });

  it("shows URL validation error for invalid url", async () => {
    const user = userEvent.setup();
    render(<AddJobModal open={true} onOpenChange={mockOnOpenChange} addJob={mockAddJob} />);

    await user.type(screen.getByLabelText(/company/i), "Acme");
    await user.type(screen.getByLabelText(/role/i), "Dev");
    await user.type(screen.getByPlaceholderText(/example\.com/), "not-a-url");

    const submitButton = screen.getByRole("button", { name: /add item/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddJob.mutateAsync).not.toHaveBeenCalled();
    });
  });
});
