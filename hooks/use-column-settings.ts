"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { BOARD_TYPE_CONFIG, type BoardItemStatus } from "@/types/board-items";
import type { BoardType } from "@/types/boards";

export interface ColumnSetting {
  readonly status: BoardItemStatus;
  readonly label: string;
  readonly color: string;
  readonly visible: boolean;
}

function buildDefaults(boardType: BoardType): ColumnSetting[] {
  return BOARD_TYPE_CONFIG[boardType].columns.map((column) => ({
    status: column.status,
    label: column.label,
    color: column.color,
    visible: true,
  }));
}

function persist(storageKey: string, settings: ColumnSetting[]) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {}
}

export function useColumnSettings(boardType: BoardType) {
  const storageKey = `flow-pilot:column-settings:${boardType}`;
  const defaults = useMemo(() => buildDefaults(boardType), [boardType]);
  const [settings, setSettings] = useState<ColumnSetting[]>(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating localStorage-backed preferences
        setSettings(defaults);
        return;
      }

      const parsed: ColumnSetting[] = JSON.parse(raw);
      const merged = defaults.map((def) => {
        const saved = parsed.find((p) => p.status === def.status);
        return saved ? { ...def, label: saved.label, visible: saved.visible } : def;
      });

      setSettings(merged);
    } catch {
      setSettings(defaults);
    }
  }, [defaults, storageKey]);

  const renameColumn = useCallback(
    (status: BoardItemStatus, label: string) => {
      setSettings((prev) => {
        const next = prev.map((s) => (s.status === status ? { ...s, label } : s));
        persist(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const toggleColumn = useCallback(
    (status: BoardItemStatus) => {
      setSettings((prev) => {
        const next = prev.map((s) => (s.status === status ? { ...s, visible: !s.visible } : s));
        persist(storageKey, next);
        return next;
      });
    },
    [storageKey]
  );

  const resetToDefaults = useCallback(() => {
    setSettings(defaults);
    persist(storageKey, defaults);
  }, [defaults, storageKey]);

  const visibleSettings = settings.filter((s) => s.visible);
  const hiddenCount = settings.filter((s) => !s.visible).length;

  return { settings, visibleSettings, hiddenCount, renameColumn, toggleColumn, resetToDefaults };
}
