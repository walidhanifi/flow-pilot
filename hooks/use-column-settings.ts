"use client";

import { useState, useEffect, useCallback } from "react";
import { COLUMN_CONFIG, JOB_STATUSES, type JobStatus } from "@/types/jobs";

export interface ColumnSetting {
  readonly status: JobStatus;
  readonly label: string;
  readonly color: string;
  readonly visible: boolean;
}

const STORAGE_KEY = "flow-pilot:column-settings";

const DEFAULTS: ColumnSetting[] = JOB_STATUSES.map((status) => ({
  status,
  label: COLUMN_CONFIG[status].label,
  color: COLUMN_CONFIG[status].color,
  visible: true,
}));

function persist(settings: ColumnSetting[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export function useColumnSettings() {
  const [settings, setSettings] = useState<ColumnSetting[]>(DEFAULTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: ColumnSetting[] = JSON.parse(raw);
      const merged = DEFAULTS.map((def) => {
        const saved = parsed.find((p) => p.status === def.status);
        return saved ? { ...def, label: saved.label, visible: saved.visible } : def;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR-safe localStorage hydration
      setSettings(merged);
    } catch {}
  }, []);

  const renameColumn = useCallback((status: JobStatus, label: string) => {
    setSettings((prev) => {
      const next = prev.map((s) => (s.status === status ? { ...s, label } : s));
      persist(next);
      return next;
    });
  }, []);

  const toggleColumn = useCallback((status: JobStatus) => {
    setSettings((prev) => {
      const next = prev.map((s) => (s.status === status ? { ...s, visible: !s.visible } : s));
      persist(next);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULTS);
    persist(DEFAULTS);
  }, []);

  const visibleSettings = settings.filter((s) => s.visible);
  const hiddenCount = settings.filter((s) => !s.visible).length;

  return { settings, visibleSettings, hiddenCount, renameColumn, toggleColumn, resetToDefaults };
}
