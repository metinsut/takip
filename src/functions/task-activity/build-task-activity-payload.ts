import type { TaskPriority, TaskStatus } from "@/db/schema";

type ActivityScalar = number | string | undefined;

export type TaskActivitySnapshot = {
  assigneeId?: string;
  completedAt?: string;
  description: string;
  dueDate?: string;
  priority: TaskPriority;
  projectId: number;
  status: TaskStatus;
  title: string;
};

export type TaskActivityFieldChange = {
  after: ActivityScalar;
  before: ActivityScalar;
  field: keyof TaskActivitySnapshot;
};

type TaskActivityState = {
  assigneeId?: string;
  completedAt?: Date;
  description: string;
  dueDate?: Date;
  priority: TaskPriority;
  projectId: number;
  status: TaskStatus;
  title: string;
};

const trackedTaskFields: Array<keyof TaskActivitySnapshot> = [
  "projectId",
  "title",
  "description",
  "status",
  "priority",
  "assigneeId",
  "dueDate",
  "completedAt",
];

function toOptionalIsoString(value?: Date): string | undefined {
  return value instanceof Date ? value.toISOString() : undefined;
}

function buildTaskSnapshot(task: TaskActivityState): TaskActivitySnapshot {
  return {
    projectId: task.projectId,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId,
    dueDate: toOptionalIsoString(task.dueDate),
    completedAt: toOptionalIsoString(task.completedAt),
  };
}

export function buildTaskUpdateChanges(args: {
  after: TaskActivityState;
  before: TaskActivityState;
}): TaskActivityFieldChange[] {
  const beforeSnapshot = buildTaskSnapshot(args.before);
  const afterSnapshot = buildTaskSnapshot(args.after);

  return trackedTaskFields.flatMap((field) => {
    const before = beforeSnapshot[field];
    const after = afterSnapshot[field];

    if (before === after) {
      return [];
    }

    return [{ field, before, after }];
  });
}

export function buildTaskCreatedPayload(task: TaskActivityState) {
  return {
    snapshot: buildTaskSnapshot(task),
  };
}

export function buildTaskDeletedPayload(task: TaskActivityState) {
  return {
    snapshot: buildTaskSnapshot(task),
  };
}

export function buildCommentCreatedPayload(args: { body: string }) {
  return {
    body: args.body,
  };
}

export function buildCommentUpdatedPayload(args: { afterBody: string; beforeBody: string }) {
  return {
    beforeBody: args.beforeBody,
    afterBody: args.afterBody,
  };
}

export function buildCommentDeletedPayload(args: { body: string }) {
  return {
    body: args.body,
  };
}
