import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { useJobs } from "@/hooks/use-jobs";
import type { Job } from "@/types/jobs";

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    user_id: "user-1",
    company: "Acme Corp",
    role: "Frontend Engineer",
    url: "https://acme.com/jobs/1",
    status: "applied",
    position: 0,
    created_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "2",
    user_id: "user-1",
    company: "Beta Inc",
    role: "Full Stack Dev",
    url: "",
    status: "interview",
    position: 0,
    created_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "3",
    user_id: "user-1",
    company: "Gamma LLC",
    role: "Backend Engineer",
    url: "https://gamma.com/careers",
    status: "applied",
    position: 1,
    created_at: "2026-01-03T00:00:00Z",
  },
  {
    id: "4",
    user_id: "user-1",
    company: "Delta Co",
    role: "Senior Dev",
    url: "",
    status: "offer",
    position: 0,
    created_at: "2026-01-04T00:00:00Z",
  },
];

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
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

describe("useJobs", () => {
  it("fetches jobs and returns them", async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.jobs).toEqual(MOCK_JOBS);
    expect(result.current.isError).toBe(false);
  });

  it("groups jobs by status", async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const { jobsByStatus } = result.current;
    expect(jobsByStatus.applied).toHaveLength(2);
    expect(jobsByStatus.interview).toHaveLength(1);
    expect(jobsByStatus.offer).toHaveLength(1);
    expect(jobsByStatus.rejected).toHaveLength(0);
  });

  it("sorts jobs within each status by position", async () => {
    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const applied = result.current.jobsByStatus.applied;
    expect(applied[0].id).toBe("1"); // position 0
    expect(applied[1].id).toBe("3"); // position 1
  });

  it("sets isError on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () =>
          Promise.resolve({ success: false, error: "Failed to fetch jobs" }),
      })
    );

    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("returns empty arrays for all statuses when no jobs exist", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true, data: [] }),
      })
    );

    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const { jobsByStatus } = result.current;
    expect(jobsByStatus.applied).toHaveLength(0);
    expect(jobsByStatus.interview).toHaveLength(0);
    expect(jobsByStatus.offer).toHaveLength(0);
    expect(jobsByStatus.rejected).toHaveLength(0);
  });

  it("addJob mutation calls POST /api/jobs", async () => {
    const mockFetch = vi.fn();
    // First call: GET jobs
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: MOCK_JOBS }),
    });
    // Second call: POST new job
    const newJob: Job = {
      id: "5",
      user_id: "user-1",
      company: "New Corp",
      role: "New Role",
      url: "",
      status: "applied",
      position: 2,
      created_at: "2026-01-05T00:00:00Z",
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: newJob }),
    });
    // Third call: refetch after mutation
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({ success: true, data: [...MOCK_JOBS, newJob] }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.addJob.mutate({
      company: "New Corp",
      role: "New Role",
      url: "",
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: "New Corp",
          role: "New Role",
          url: "",
        }),
      });
    });
  });

  it("updateJob mutation calls PATCH /api/jobs/[id]", async () => {
    const mockFetch = vi.fn();
    // GET
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: MOCK_JOBS }),
    });
    // PATCH
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          success: true,
          data: { ...MOCK_JOBS[0], status: "interview" },
        }),
    });
    // Refetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: MOCK_JOBS }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.updateJob.mutate({
      id: "1",
      status: "interview",
      position: 0,
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/jobs/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "interview", position: 0 }),
      });
    });
  });

  it("deleteJob mutation calls DELETE /api/jobs/[id]", async () => {
    const mockFetch = vi.fn();
    // GET
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, data: MOCK_JOBS }),
    });
    // DELETE
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    });
    // Refetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, data: MOCK_JOBS.slice(1) }),
    });
    vi.stubGlobal("fetch", mockFetch);

    const { result } = renderHook(() => useJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.deleteJob.mutate("1");

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/jobs/1", {
        method: "DELETE",
      });
    });
  });
});
