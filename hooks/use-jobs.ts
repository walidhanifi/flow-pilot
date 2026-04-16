import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Job, JobStatus, CreateJobPayload, UpdateJobPayload } from "@/types/jobs";
import { JOB_STATUSES } from "@/types/jobs";

function jobsKey(boardId: string) {
  return ["jobs", boardId] as const;
}

async function fetchJobs(boardId: string): Promise<Job[]> {
  const url = `/api/jobs?boardId=${encodeURIComponent(boardId)}`;
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error ?? "Failed to fetch jobs");
  }

  return json.data;
}

export function useJobs(boardId: string) {
  const queryClient = useQueryClient();
  const JOBS_KEY = jobsKey(boardId);

  const {
    data: jobs = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Job[]>({
    queryKey: JOBS_KEY,
    queryFn: () => fetchJobs(boardId),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: "always",
  });

  const jobsByStatus = useMemo(() => {
    const base: Record<JobStatus, Job[]> = {
      applied: [],
      interview: [],
      offer: [],
      rejected: [],
    };

    const grouped = jobs.reduce<Record<JobStatus, Job[]>>((acc, job) => {
      if (!JOB_STATUSES.includes(job.status)) return acc;
      return { ...acc, [job.status]: [...acc[job.status], job] };
    }, base);

    return Object.fromEntries(
      JOB_STATUSES.map((status) => [
        status,
        [...grouped[status]].sort((a, b) => a.position - b.position),
      ])
    ) as Record<JobStatus, Job[]>;
  }, [jobs]);

  const addJob = useMutation({
    mutationFn: async (payload: CreateJobPayload) => {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, board_id: boardId }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to create job");
      }

      return json.data as Job;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_KEY });
    },
  });

  const updateJob = useMutation({
    mutationFn: async ({ id, ...payload }: UpdateJobPayload & { id: string }) => {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to update job");
      }

      return json.data as Job;
    },
    onMutate: async ({ id, ...payload }) => {
      await queryClient.cancelQueries({ queryKey: JOBS_KEY });
      const previous = queryClient.getQueryData<Job[]>(JOBS_KEY);

      queryClient.setQueryData<Job[]>(JOBS_KEY, (old = []) =>
        old.map((job) => (job.id === id ? { ...job, ...payload } : job))
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(JOBS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_KEY });
    },
  });

  const deleteJob = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Failed to delete job");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_KEY });
    },
  });

  return {
    jobs,
    jobsByStatus,
    isLoading,
    isError,
    error,
    refetch,
    addJob,
    updateJob,
    deleteJob,
  };
}
