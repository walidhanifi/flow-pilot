import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { KanbanColumn } from "@/components/dashboard/kanban-column";
import type { Job } from "@/types/jobs";

// Mock dnd-kit
vi.mock("@dnd-kit/core", () => ({
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  verticalListSortingStrategy: {},
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
  CSS: { Transform: { toString: () => undefined } },
}));

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    user_id: "user-1",
    company: "Acme Corp",
    role: "Frontend Engineer",
    url: "https://acme.com",
    status: "applied",
    position: 0,
    notes: "",
    created_at: "2026-01-01",
  },
  {
    id: "2",
    user_id: "user-1",
    company: "Beta Inc",
    role: "Backend Dev",
    url: "",
    status: "applied",
    position: 1,
    notes: "",
    created_at: "2026-01-02",
  },
];

describe("KanbanColumn", () => {
  it("renders column label", () => {
    render(
      <KanbanColumn
        status="applied"
        label="Applied"
        colorClass="bg-primary"
        jobs={MOCK_JOBS}
        isLoading={false}
      />
    );
    expect(screen.getByText("Applied")).toBeInTheDocument();
  });

  it("renders job count badge", () => {
    render(
      <KanbanColumn
        status="applied"
        label="Applied"
        colorClass="bg-primary"
        jobs={MOCK_JOBS}
        isLoading={false}
      />
    );
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders job cards", () => {
    render(
      <KanbanColumn
        status="applied"
        label="Applied"
        colorClass="bg-primary"
        jobs={MOCK_JOBS}
        isLoading={false}
      />
    );
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Beta Inc")).toBeInTheDocument();
  });

  it("shows empty state when no jobs", () => {
    render(
      <KanbanColumn
        status="applied"
        label="Applied"
        colorClass="bg-primary"
        jobs={[]}
        isLoading={false}
      />
    );
    expect(screen.getByText("No jobs yet")).toBeInTheDocument();
  });

  it("shows skeletons when loading", () => {
    const { container } = render(
      <KanbanColumn
        status="applied"
        label="Applied"
        colorClass="bg-primary"
        jobs={[]}
        isLoading={true}
      />
    );
    // JobCardSkeleton renders 3 skeleton cards by default
    const skeletons = container.querySelectorAll("[data-slot='skeleton']");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("does not show empty state when loading", () => {
    render(
      <KanbanColumn
        status="applied"
        label="Applied"
        colorClass="bg-primary"
        jobs={[]}
        isLoading={true}
      />
    );
    expect(screen.queryByText("No jobs yet")).not.toBeInTheDocument();
  });
});
