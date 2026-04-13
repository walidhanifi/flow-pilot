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
import { Plus, Eye } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { useColumnSettings } from "@/hooks/use-column-settings";
import { JOB_STATUSES } from "@/types/jobs";
import type { Job, JobStatus } from "@/types/jobs";
import { KanbanColumn } from "@/components/dashboard/kanban-column";
import { JobCard } from "@/components/dashboard/job-card";
import { AddJobModal } from "@/components/dashboard/add-job-modal";
import { Button } from "@/components/ui/button";

export function KanbanBoard() {
  const { jobs, jobsByStatus, isLoading, isError, error, refetch, addJob, updateJob, deleteJob } =
    useJobs();

  const { visibleSettings, settings, hiddenCount, renameColumn, toggleColumn } =
    useColumnSettings();

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

      const activeData = active.data.current as { type: string; job: Job } | undefined;
      if (!activeData || activeData.type !== "job") return;

      const draggedJob = activeData.job;

      let targetStatus: JobStatus;
      const overData = over.data.current as
        | { type: string; status?: JobStatus; job?: Job }
        | undefined;

      if (overData?.type === "column" && overData.status) {
        targetStatus = overData.status;
      } else if (overData?.type === "job" && overData.job) {
        targetStatus = overData.job.status;
      } else {
        if (JOB_STATUSES.includes(over.id as JobStatus)) {
          targetStatus = over.id as JobStatus;
        } else {
          return;
        }
      }

      const targetJobs = jobsByStatus[targetStatus];
      let newPosition: number;

      if (overData?.type === "job" && overData.job) {
        newPosition = overData.job.position;
      } else {
        newPosition = targetJobs.length > 0 ? targetJobs[targetJobs.length - 1].position + 1 : 0;
      }

      if (draggedJob.status === targetStatus && draggedJob.position === newPosition) return;

      updateJob.mutate({ id: draggedJob.id, status: targetStatus, position: newPosition });
    },
    [jobsByStatus, updateJob]
  );

  const hiddenSettings = settings.filter((s) => !s.visible);

  return (
    <div className="flex h-full flex-col p-6">
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

      {/* Error banner */}
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

      {/* Hidden columns restore bar */}
      {hiddenCount > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-4 py-2.5">
          <span className="text-xs text-muted-foreground">
            {hiddenCount} hidden column{hiddenCount > 1 ? "s" : ""}
          </span>
          {hiddenSettings.map((s) => (
            <button
              key={s.status}
              onClick={() => toggleColumn(s.status)}
              className="flex items-center gap-1 rounded-md border border-border/60 bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              <Eye size={11} />
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Board — horizontal scroll */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {visibleSettings.map((setting) => (
            <div key={setting.status} className="w-72 shrink-0">
              <KanbanColumn
                status={setting.status}
                label={setting.label}
                colorClass={setting.color}
                jobs={jobsByStatus[setting.status]}
                isLoading={isLoading}
                onDeleteJob={(id) => deleteJob.mutate(id)}
                deletingJobId={deleteJob.isPending ? (deleteJob.variables as string) : undefined}
                onRename={renameColumn}
                onHide={toggleColumn}
              />
            </div>
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeJob && <JobCard job={activeJob} isDragOverlay />}
        </DragOverlay>
      </DndContext>

      <AddJobModal open={modalOpen} onOpenChange={setModalOpen} addJob={addJob} />
    </div>
  );
}
