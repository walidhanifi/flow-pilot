"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { JOB_STATUSES, COLUMN_CONFIG } from "@/types/jobs";
import type { Job, JobStatus } from "@/types/jobs";
import { KanbanColumn } from "@/components/dashboard/kanban-column";
import { JobCard } from "@/components/dashboard/job-card";
import { AddJobModal } from "@/components/dashboard/add-job-modal";
import { Button } from "@/components/ui/button";

export function KanbanBoard() {
  const {
    jobs,
    jobsByStatus,
    isLoading,
    isError,
    error,
    refetch,
    addJob,
    updateJob,
  } = useJobs();

  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const job = jobs.find((j) => j.id === event.active.id);
      if (job) setActiveJob(job);
    },
    [jobs]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveJob(null);

      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current as
        | { type: string; job: Job }
        | undefined;
      if (!activeData || activeData.type !== "job") return;

      const draggedJob = activeData.job;

      // Determine target column
      let targetStatus: JobStatus;
      const overData = over.data.current as
        | { type: string; status?: JobStatus; job?: Job }
        | undefined;

      if (overData?.type === "column" && overData.status) {
        targetStatus = overData.status;
      } else if (overData?.type === "job" && overData.job) {
        targetStatus = overData.job.status;
      } else {
        // over.id might be a column status directly
        if (JOB_STATUSES.includes(over.id as JobStatus)) {
          targetStatus = over.id as JobStatus;
        } else {
          return;
        }
      }

      // Determine new position
      const targetJobs = jobsByStatus[targetStatus];
      let newPosition: number;

      if (overData?.type === "job" && overData.job) {
        // Dropped on a specific card — take its position
        newPosition = overData.job.position;
      } else {
        // Dropped on column — put at end
        newPosition =
          targetJobs.length > 0
            ? targetJobs[targetJobs.length - 1].position + 1
            : 0;
      }

      // Only update if something changed
      if (
        draggedJob.status === targetStatus &&
        draggedJob.position === newPosition
      ) {
        return;
      }

      updateJob.mutate({
        id: draggedJob.id,
        status: targetStatus,
        position: newPosition,
      });
    },
    [jobsByStatus, updateJob]
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your board</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag jobs between columns to update their status.
          </p>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          disabled={isError}
          className="h-10 gap-2 rounded-xl px-5 text-sm font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          <Plus className="h-4 w-4" />
          Add job
        </Button>
      </div>

      {/* Error banner — board still renders below */}
      {isError && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
          <p className="text-sm font-medium text-destructive">
            {error instanceof Error ? error.message : "Something went wrong loading your jobs."}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="ml-4 shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JOB_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              label={COLUMN_CONFIG[status].label}
              colorClass={COLUMN_CONFIG[status].color}
              jobs={jobsByStatus[status]}
              isLoading={isLoading}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeJob && <JobCard job={activeJob} isDragOverlay />}
        </DragOverlay>
      </DndContext>

      <AddJobModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        addJob={addJob}
      />
    </div>
  );
}
