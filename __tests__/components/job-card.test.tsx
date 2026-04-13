import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { JobCard } from "@/components/dashboard/job-card";
import type { Job } from "@/types/jobs";

// Mock dnd-kit sortable
vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: () => undefined,
    },
  },
}));

const MOCK_JOB: Job = {
  id: "job-1",
  user_id: "user-1",
  company: "Acme Corp",
  role: "Frontend Engineer",
  url: "https://acme.com/jobs/1",
  status: "applied",
  position: 0,
  notes: "",
  created_at: "2026-01-01T00:00:00Z",
};

describe("JobCard", () => {
  it("renders company name", () => {
    render(<JobCard job={MOCK_JOB} />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
  });

  it("renders role", () => {
    render(<JobCard job={MOCK_JOB} />);
    expect(screen.getByText("Frontend Engineer")).toBeInTheDocument();
  });

  it("renders url as a link when present", () => {
    render(<JobCard job={MOCK_JOB} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://acme.com/jobs/1");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders domain name in url chip", () => {
    render(<JobCard job={MOCK_JOB} />);
    expect(screen.getByText("acme.com")).toBeInTheDocument();
  });

  it("does not render url link when url is empty", () => {
    const jobWithoutUrl: Job = { ...MOCK_JOB, url: "" };
    render(<JobCard job={jobWithoutUrl} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("applies drag overlay styles when isDragOverlay is true", () => {
    const { container } = render(<JobCard job={MOCK_JOB} isDragOverlay />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("rotate-2");
    expect(card.className).toContain("shadow-xl");
  });

  it("applies hover styles by default", () => {
    const { container } = render(<JobCard job={MOCK_JOB} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("hover:-translate-y-0.5");
  });

  it("shows delete button on hover when onDelete is provided", () => {
    render(<JobCard job={MOCK_JOB} onDelete={vi.fn()} />);
    const btn = screen.getByRole("button");
    expect(btn).toBeInTheDocument();
  });

  it("shows confirm state after first delete click", async () => {
    const user = userEvent.setup();
    render(<JobCard job={MOCK_JOB} onDelete={vi.fn()} />);
    const btn = screen.getByRole("button");
    await user.click(btn);
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("calls onDelete after second click", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<JobCard job={MOCK_JOB} onDelete={onDelete} />);
    const btn = screen.getByRole("button");
    await user.click(btn);
    await user.click(btn);
    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("shows notes icon when job has notes", () => {
    const jobWithNotes: Job = { ...MOCK_JOB, notes: "Follow up Monday" };
    render(<JobCard job={jobWithNotes} />);
    expect(document.querySelector("[title='Has notes']")).toBeInTheDocument();
  });
});
