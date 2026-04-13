import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("shows rename button when onRename is provided", () => {
    render(
      <KanbanColumn
        status="applied"
        label="Applied"
        colorClass="bg-primary"
        jobs={[]}
        isLoading={false}
        onRename={vi.fn()}
      />
    );
    expect(screen.getByTitle("Rename column")).toBeInTheDocument();
  });

  it("shows hide button when onHide is provided", () => {
    render(
      <KanbanColumn
        status="applied"
        label="Applied"
        colorClass="bg-primary"
        jobs={[]}
        isLoading={false}
        onHide={vi.fn()}
      />
    );
    expect(screen.getByTitle("Hide column")).toBeInTheDocument();
  });

  it("enters rename editing mode on pencil click", async () => {
    const user = userEvent.setup();
    render(
      <KanbanColumn
        status="applied"
        label="Applied"
        colorClass="bg-primary"
        jobs={[]}
        isLoading={false}
        onRename={vi.fn()}
      />
    );
    await user.click(screen.getByTitle("Rename column"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("calls onRename when edit is committed", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(
      <KanbanColumn
        status="applied"
        label="Applied"
        colorClass="bg-primary"
        jobs={[]}
        isLoading={false}
        onRename={onRename}
      />
    );
    await user.click(screen.getByTitle("Rename column"));
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "New Name");
    await user.keyboard("{Enter}");
    expect(onRename).toHaveBeenCalledWith("applied", "New Name");
  });
});
