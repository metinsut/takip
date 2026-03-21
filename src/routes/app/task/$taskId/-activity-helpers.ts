import dayjs from "dayjs";
import type {
  TaskActivityFieldChange,
  TaskActivityPayload,
  TaskActivityType,
  TaskPriority,
  TaskStatus,
} from "@/db/schema";
import { taskActivityType, taskPriority, taskStatus } from "@/db/schema";
import { dateFormat } from "@/helpers/date-format";

export const DEFAULT_TASK_ACTIVITY_LIMIT = 100;

type ActivityDescriptor = {
  badge: string;
  lines: string[];
  title: string;
};

type ActivityLike = {
  payload: TaskActivityPayload;
  type: TaskActivityType;
};

function getStatusLabel(value: TaskStatus) {
  switch (value) {
    case taskStatus.todo:
      return "Yapılacak";
    case taskStatus.in_progress:
      return "Devam ediyor";
    case taskStatus.done:
      return "Tamamlandı";
  }
}

function getPriorityLabel(value: TaskPriority) {
  switch (value) {
    case taskPriority.low:
      return "Düşük";
    case taskPriority.medium:
      return "Orta";
    case taskPriority.high:
      return "Yüksek";
  }
}

function formatDate(value: string, withTime = false) {
  return dayjs(value).format(withTime ? dateFormat.DATE_TIME_FORMAT : dateFormat.DATE_FORMAT);
}

function formatFieldValue(
  field: TaskActivityFieldChange["field"],
  value: TaskActivityFieldChange["after"],
) {
  if (value === undefined) {
    return "Ayarlanmadı";
  }

  switch (field) {
    case "status":
      return getStatusLabel(value as TaskStatus);
    case "priority":
      return getPriorityLabel(value as TaskPriority);
    case "dueDate":
      return formatDate(String(value));
    case "completedAt":
      return formatDate(String(value), true);
    default:
      return String(value);
  }
}

function formatFieldChange(change: TaskActivityFieldChange) {
  switch (change.field) {
    case "description":
      return "Açıklama güncellendi";
    case "title":
      return `Başlık: ${formatFieldValue(change.field, change.before)} -> ${formatFieldValue(change.field, change.after)}`;
    case "status":
      return `Durum: ${formatFieldValue(change.field, change.before)} -> ${formatFieldValue(change.field, change.after)}`;
    case "priority":
      return `Öncelik: ${formatFieldValue(change.field, change.before)} -> ${formatFieldValue(change.field, change.after)}`;
    case "projectId":
      return `Proje: ${formatFieldValue(change.field, change.before)} -> ${formatFieldValue(change.field, change.after)}`;
    case "assigneeId":
      return `Atanan kişi: ${formatFieldValue(change.field, change.before)} -> ${formatFieldValue(change.field, change.after)}`;
    case "dueDate":
      return `Bitiş tarihi: ${formatFieldValue(change.field, change.before)} -> ${formatFieldValue(change.field, change.after)}`;
    case "completedAt":
      return `Tamamlanma tarihi: ${formatFieldValue(change.field, change.before)} -> ${formatFieldValue(change.field, change.after)}`;
  }
}

export function describeTaskActivity(activity: ActivityLike): ActivityDescriptor {
  switch (activity.type) {
    case taskActivityType.task_created: {
      const payload = activity.payload as Extract<
        TaskActivityPayload,
        {
          snapshot: {
            priority: TaskPriority;
            status: TaskStatus;
            title: string;
          };
        }
      >;

      return {
        badge: "Oluşturuldu",
        lines: [
          `Başlık: ${payload.snapshot.title}`,
          `Durum: ${getStatusLabel(payload.snapshot.status)}`,
          `Öncelik: ${getPriorityLabel(payload.snapshot.priority)}`,
        ],
        title: "Görev oluşturuldu",
      };
    }
    case taskActivityType.task_updated: {
      const payload = activity.payload as Extract<
        TaskActivityPayload,
        { changes: TaskActivityFieldChange[] }
      >;

      return {
        badge: "Güncelleme",
        lines: payload.changes.map(formatFieldChange),
        title: "Görev güncellendi",
      };
    }
    case taskActivityType.task_deleted: {
      const payload = activity.payload as Extract<
        TaskActivityPayload,
        { snapshot: { title: string } }
      >;

      return {
        badge: "Silindi",
        lines: [`Başlık: ${payload.snapshot.title}`],
        title: "Görev silindi",
      };
    }
    case taskActivityType.comment_created: {
      const payload = activity.payload as Extract<TaskActivityPayload, { body: string }>;

      return {
        badge: "Yorum",
        lines: [payload.body],
        title: "Yorum eklendi",
      };
    }
    case taskActivityType.comment_updated: {
      const payload = activity.payload as Extract<
        TaskActivityPayload,
        { afterBody: string; beforeBody: string }
      >;

      return {
        badge: "Yorum",
        lines: [`Eski yorum: ${payload.beforeBody}`, `Yeni yorum: ${payload.afterBody}`],
        title: "Yorum güncellendi",
      };
    }
    case taskActivityType.comment_deleted: {
      const payload = activity.payload as Extract<TaskActivityPayload, { body: string }>;

      return {
        badge: "Yorum",
        lines: [payload.body],
        title: "Yorum silindi",
      };
    }
  }

  return {
    badge: "Aktivite",
    lines: [],
    title: "Bilinmeyen aktivite",
  };
}
