import type { BoardType } from "@/types/boards";
import { BOARD_TYPE_CONFIG, type BoardItem, type BoardItemStatus } from "@/types/board-items";

type DatabaseRow = Record<string, unknown>;

interface TableConfig {
  readonly table: string;
  readonly columns: string;
  readonly defaultStatus: BoardItemStatus;
  readonly toItem: (row: DatabaseRow) => BoardItem;
  readonly toInsert: (data: {
    userId: string;
    boardId: string;
    title: string;
    subtitle: string;
    link: string;
    position: number;
  }) => Record<string, unknown>;
  readonly toPatch: (patch: Record<string, unknown>) => Record<string, unknown>;
}

const configs: Record<BoardType, TableConfig> = {
  job: {
    table: "jobs",
    columns: "id, user_id, board_id, company, role, url, status, position, notes, created_at",
    defaultStatus: BOARD_TYPE_CONFIG.job.statuses[0],
    toItem: (row) => ({
      id: String(row.id),
      user_id: String(row.user_id),
      board_id: String(row.board_id),
      title: String(row.company ?? ""),
      subtitle: String(row.role ?? ""),
      link: String(row.url ?? ""),
      status: row.status as BoardItemStatus,
      position: Number(row.position ?? 0),
      notes: String(row.notes ?? ""),
      created_at: String(row.created_at),
    }),
    toInsert: ({ userId, boardId, title, subtitle, link, position }) => ({
      user_id: userId,
      board_id: boardId,
      company: title,
      role: subtitle,
      url: link,
      status: BOARD_TYPE_CONFIG.job.statuses[0],
      position,
    }),
    toPatch: (patch) => ({
      ...(patch.title !== undefined ? { company: patch.title } : {}),
      ...(patch.subtitle !== undefined ? { role: patch.subtitle } : {}),
      ...(patch.link !== undefined ? { url: patch.link } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.position !== undefined ? { position: patch.position } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
    }),
  },
  project: {
    table: "project_tasks",
    columns: "id, user_id, board_id, title, assignee, url, status, position, notes, created_at",
    defaultStatus: BOARD_TYPE_CONFIG.project.statuses[0],
    toItem: (row) => ({
      id: String(row.id),
      user_id: String(row.user_id),
      board_id: String(row.board_id),
      title: String(row.title ?? ""),
      subtitle: String(row.assignee ?? ""),
      link: String(row.url ?? ""),
      status: row.status as BoardItemStatus,
      position: Number(row.position ?? 0),
      notes: String(row.notes ?? ""),
      created_at: String(row.created_at),
    }),
    toInsert: ({ userId, boardId, title, subtitle, link, position }) => ({
      user_id: userId,
      board_id: boardId,
      title,
      assignee: subtitle,
      url: link,
      status: BOARD_TYPE_CONFIG.project.statuses[0],
      position,
    }),
    toPatch: (patch) => ({
      ...(patch.title !== undefined ? { title: patch.title } : {}),
      ...(patch.subtitle !== undefined ? { assignee: patch.subtitle } : {}),
      ...(patch.link !== undefined ? { url: patch.link } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.position !== undefined ? { position: patch.position } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
    }),
  },
  sales: {
    table: "sales_leads",
    columns:
      "id, user_id, board_id, company, contact_name, website, status, position, notes, created_at",
    defaultStatus: BOARD_TYPE_CONFIG.sales.statuses[0],
    toItem: (row) => ({
      id: String(row.id),
      user_id: String(row.user_id),
      board_id: String(row.board_id),
      title: String(row.company ?? ""),
      subtitle: String(row.contact_name ?? ""),
      link: String(row.website ?? ""),
      status: row.status as BoardItemStatus,
      position: Number(row.position ?? 0),
      notes: String(row.notes ?? ""),
      created_at: String(row.created_at),
    }),
    toInsert: ({ userId, boardId, title, subtitle, link, position }) => ({
      user_id: userId,
      board_id: boardId,
      company: title,
      contact_name: subtitle,
      website: link,
      status: BOARD_TYPE_CONFIG.sales.statuses[0],
      position,
    }),
    toPatch: (patch) => ({
      ...(patch.title !== undefined ? { company: patch.title } : {}),
      ...(patch.subtitle !== undefined ? { contact_name: patch.subtitle } : {}),
      ...(patch.link !== undefined ? { website: patch.link } : {}),
      ...(patch.status !== undefined ? { status: patch.status } : {}),
      ...(patch.position !== undefined ? { position: patch.position } : {}),
      ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
    }),
  },
};

export function getBoardTableConfig(boardType: BoardType): TableConfig {
  return configs[boardType];
}
