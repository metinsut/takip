import { describe, expect, it } from "bun:test";
import { taskActivityType, taskPriority, taskStatus } from "@/db/schema";
import { describeTaskActivity } from "./-activity-helpers";

describe("describeTaskActivity", () => {
  it("formats task creation payloads for the activity feed", () => {
    expect(
      describeTaskActivity({
        payload: {
          snapshot: {
            description: "API response mappinglerini doğrula",
            priority: taskPriority.low,
            projectId: 4,
            status: taskStatus.todo,
            title: "Release notlarını hazırla",
          },
        },
        type: taskActivityType.task_created,
      }),
    ).toEqual({
      badge: "Oluşturuldu",
      lines: ["Başlık: Release notlarını hazırla", "Durum: Yapılacak", "Öncelik: Düşük"],
      title: "Görev oluşturuldu",
    });
  });

  it("formats tracked task updates with readable field labels", () => {
    expect(
      describeTaskActivity({
        payload: {
          changes: [
            {
              after: taskStatus.in_progress,
              before: taskStatus.todo,
              field: "status",
            },
            {
              after: taskPriority.high,
              before: taskPriority.medium,
              field: "priority",
            },
            {
              after: "Yeni açıklama",
              before: "Eski açıklama",
              field: "description",
            },
          ],
        },
        type: taskActivityType.task_updated,
      }),
    ).toEqual({
      badge: "Güncelleme",
      lines: [
        "Durum: Yapılacak -> Devam ediyor",
        "Öncelik: Orta -> Yüksek",
        "Açıklama güncellendi",
      ],
      title: "Görev güncellendi",
    });
  });

  it("formats comment updates with before and after content", () => {
    expect(
      describeTaskActivity({
        payload: {
          afterBody: "Yeni yorum gövdesi",
          beforeBody: "İlk yorum gövdesi",
        },
        type: taskActivityType.comment_updated,
      }),
    ).toEqual({
      badge: "Yorum",
      lines: ["Eski yorum: İlk yorum gövdesi", "Yeni yorum: Yeni yorum gövdesi"],
      title: "Yorum güncellendi",
    });
  });
});
