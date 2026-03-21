import { describe, expect, it } from "bun:test";
import { type TaskPriority, type TaskStatus, taskPriority, taskStatus } from "@/db/schema";
import {
  buildCommentCreatedPayload,
  buildCommentDeletedPayload,
  buildCommentUpdatedPayload,
  buildTaskCreatedPayload,
  buildTaskDeletedPayload,
  buildTaskUpdateChanges,
} from "./build-task-activity-payload";

type TaskState = {
  assigneeId?: string;
  completedAt?: Date;
  description: string;
  dueDate?: Date;
  priority: TaskPriority;
  projectId: number;
  status: TaskStatus;
  title: string;
};

function createTaskState(overrides?: Partial<TaskState>): TaskState {
  return {
    projectId: 7,
    title: "Draft release post",
    description: "Prepare and publish launch notes",
    status: taskStatus.todo,
    priority: taskPriority.medium,
    assigneeId: "user_1",
    dueDate: new Date("2026-04-02T12:00:00.000Z"),
    ...overrides,
  };
}

describe("buildTaskUpdateChanges", () => {
  it("returns only tracked field changes with before/after values", () => {
    const before = createTaskState();
    const after = createTaskState({
      title: "Publish release post",
      status: taskStatus.done,
      assigneeId: undefined,
      dueDate: new Date("2026-04-03T12:00:00.000Z"),
      completedAt: new Date("2026-04-01T09:30:00.000Z"),
    });

    expect(buildTaskUpdateChanges({ before, after })).toEqual([
      {
        field: "title",
        before: "Draft release post",
        after: "Publish release post",
      },
      {
        field: "status",
        before: taskStatus.todo,
        after: taskStatus.done,
      },
      {
        field: "assigneeId",
        before: "user_1",
        after: undefined,
      },
      {
        field: "dueDate",
        before: "2026-04-02T12:00:00.000Z",
        after: "2026-04-03T12:00:00.000Z",
      },
      {
        field: "completedAt",
        before: undefined,
        after: "2026-04-01T09:30:00.000Z",
      },
    ]);
  });

  it("returns an empty list for no-op updates", () => {
    const before = createTaskState();
    const after = createTaskState();

    expect(buildTaskUpdateChanges({ before, after })).toEqual([]);
  });
});

describe("task activity payload builders", () => {
  it("builds task create and delete snapshots with ISO timestamps", () => {
    const task = createTaskState({ completedAt: new Date("2026-04-01T09:30:00.000Z") });

    expect(buildTaskCreatedPayload(task)).toEqual({
      snapshot: {
        assigneeId: "user_1",
        completedAt: "2026-04-01T09:30:00.000Z",
        description: "Prepare and publish launch notes",
        dueDate: "2026-04-02T12:00:00.000Z",
        priority: taskPriority.medium,
        projectId: 7,
        status: taskStatus.todo,
        title: "Draft release post",
      },
    });

    expect(buildTaskDeletedPayload(task)).toEqual({
      snapshot: {
        assigneeId: "user_1",
        completedAt: "2026-04-01T09:30:00.000Z",
        description: "Prepare and publish launch notes",
        dueDate: "2026-04-02T12:00:00.000Z",
        priority: taskPriority.medium,
        projectId: 7,
        status: taskStatus.todo,
        title: "Draft release post",
      },
    });
  });

  it("builds comment activity payloads with previous and next content", () => {
    expect(buildCommentCreatedPayload({ body: "First note" })).toEqual({
      body: "First note",
    });

    expect(
      buildCommentUpdatedPayload({
        beforeBody: "First note",
        afterBody: "Updated note",
      }),
    ).toEqual({
      beforeBody: "First note",
      afterBody: "Updated note",
    });

    expect(buildCommentDeletedPayload({ body: "Updated note" })).toEqual({
      body: "Updated note",
    });
  });
});
