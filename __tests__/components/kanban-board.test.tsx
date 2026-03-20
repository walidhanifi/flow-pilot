import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import type { Job } from "@/types/jobs";

// Mock dnd-kit
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DragOverlay: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  PointerSensor: class {},
  KeyboardSensor: class {},
  closestCorners: vi.fn(),
  useSensor: () => ({}),
  useSensors: () => [],
  useDroppable: () => ({ setNodeRef: vi.fn(), isOver: false }),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  verticalListSortingStrategy: {},
  sortableKeyboardCoordinates: vi.fn(),
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
    url: "",
    status: "applied",
    position: 0,
    created_at: "2026-01-01",
  },
  {
    id: "2",
    user_id: "user-1",
    company: "Beta Inc",
    role: "Backend Dev",
    url: "",
    status: "interview",
    position: 0,
    created_at: "2026-01-02",
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: MOCK_JOBS }),
    })
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("KanbanBoard", () => {
  it("renders the board header", async () => {
    render(<KanbanBoard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Your board")).toBeInTheDocument();
    });
  });

  it("renders all four columns", async () => {
    render(<KanbanBoard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Applied")).toBeInTheDocument();
    });
    expect(screen.getByText("Interview")).toBeInTheDocument();
    expect(screen.getByText("Offer")).toBeInTheDocument();
    expect(screen.getByText("Rejected")).toBeInTheDocument();
  });

  it("renders job cards after loading", async () => {
    render(<KanbanBoard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    });
    expect(screen.getByText("Beta Inc")).toBeInTheDocument();
  });

  it("renders Add job button", async () => {
    render(<KanbanBoard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add job/i })
      ).toBeInTheDocument();
    });
  });

  it("opens modal when Add job is clicked", async () => {
    const user = userEvent.setup();
    render(<KanbanBoard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add job/i })
      ).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /add job/i }));

    await waitFor(() => {
      expect(screen.getByText("Add a job")).toBeInTheDocument();
    });
  });

  it("shows error state with retry button on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({ success: false, error: "Failed to fetch jobs" }),
      })
    );

    render(<KanbanBoard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Failed to fetch jobs")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: /retry/i })
    ).toBeInTheDocument();
  });

  it("shows drag hint text", async () => {
    render(<KanbanBoard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(
        screen.getByText(/drag jobs between columns/i)
      ).toBeInTheDocument();
    });
  });
});
