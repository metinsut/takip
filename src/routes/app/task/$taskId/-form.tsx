import { useQueryClient } from "@tanstack/react-query";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useAppForm } from "@/components/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { toast } from "@/components/ui/sonner";
import type { SaveTaskType } from "@/db/schema";
import { saveTaskSchema, taskPriority, taskStatus } from "@/db/schema";
import { createTask, getTaskQueryKey, updateTask } from "@/functions/task";
import { getTaskActivitiesQueryKey } from "@/functions/task-activity/shared";
import { dateFormat } from "@/helpers/date-format";
import { m } from "@/paraglide/messages";

const PRIORITY_OPTIONS = [
  {
    label: m.low(),
    value: taskPriority.low,
  },
  {
    label: m.medium(),
    value: taskPriority.medium,
  },
  {
    label: m.high(),
    value: taskPriority.high,
  },
];

const STATUS_OPTIONS = [
  {
    label: m.todo(),
    value: taskStatus.todo,
  },
  {
    label: m.in_progress(),
    value: taskStatus.in_progress,
  },
  {
    label: m.done(),
    value: taskStatus.done,
  },
];

export function TaskFormSection() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { task } = useLoaderData({ from: "/app/task/$taskId" });
  const { activeProjectId } = useLoaderData({ from: "__root__" });

  const defaultValues: SaveTaskType = {
    assigneeId: task?.assigneeId ?? undefined,
    description: task?.description ?? "",
    dueDate: task?.dueDate ? dayjs(task.dueDate).toDate() : undefined,
    priority: task?.priority ?? taskPriority.medium,
    projectId: task?.projectId ?? activeProjectId ?? 0,
    status: task?.status ?? taskStatus.todo,
    title: task?.title ?? "",
  };

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: saveTaskSchema,
    },
    onSubmit: async ({ value }) => {
      if (!value.projectId) {
        toast.error("Lütfen bir proje seçin.");
        return;
      }

      if (task) {
        await updateTask({
          data: {
            assigneeId: value.assigneeId,
            description: value.description,
            dueDate: value.dueDate,
            id: task.id,
            priority: value.priority,
            projectId: value.projectId,
            status: value.status,
            title: value.title,
          },
        });
        toast.success("Görev başarıyla güncellendi.");
      } else {
        const createdTask = await createTask({
          data: {
            assigneeId: value.assigneeId,
            description: value.description,
            dueDate: value.dueDate,
            priority: value.priority,
            projectId: value.projectId,
            status: value.status,
            title: value.title,
          },
        });
        if (createdTask?.id) {
          navigate({ to: "/app/task/$taskId", params: { taskId: createdTask.id.toString() } });
        }
        toast.success("Görev başarıyla oluşturuldu.");
      }

      await queryClient.invalidateQueries({ queryKey: [getTaskQueryKey] });
      await queryClient.invalidateQueries({ queryKey: [getTaskActivitiesQueryKey] });
    },
  });

  const addedByDateAgo = task
    ? m.addedByDateAgo({
        date: dayjs(task.createdAt).format(dateFormat.DATE_TIME_FORMAT),
        user: task.createdByUser?.name ?? task.createdBy,
      })
    : undefined;

  return (
    <Card>
      <CardContent>
        <form
          noValidate
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <FieldSet>
              <FieldLegend>{task?.title ?? m.createTask()}</FieldLegend>
              {addedByDateAgo ? <FieldDescription>{addedByDateAgo}</FieldDescription> : null}
              <FieldGroup>
                <form.AppField
                  name="title"
                  children={(field) => (
                    <field.InputForm label="Başlık" placeholder="Görev başlığı" />
                  )}
                />
                <form.AppField
                  name="description"
                  children={(field) => (
                    <field.TextareaForm label="Açıklama" placeholder="Görev detayları" />
                  )}
                />
                <div className="flex flex-col gap-3 md:flex-row">
                  <form.AppField
                    name="status"
                    children={(field) => (
                      <field.SelectForm
                        label="Durum"
                        placeholder="Durum seçin"
                        options={STATUS_OPTIONS}
                      />
                    )}
                  />
                  <form.AppField
                    name="priority"
                    children={(field) => (
                      <field.SelectForm
                        label="Öncelik"
                        placeholder="Öncelik seçin"
                        options={PRIORITY_OPTIONS}
                      />
                    )}
                  />
                  <form.AppField
                    name="dueDate"
                    children={(field) => (
                      <field.DateForm label="Bitiş tarihi" placeholder="Tarih seçin" />
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <form.SubmitButton label="Değişiklikleri kaydet" />
                </div>
              </FieldGroup>
            </FieldSet>
          </form.AppForm>
        </form>
      </CardContent>
      {task ? (
        <CardFooter className="justify-between gap-3">
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <p>Oluşturulma: {dayjs(task.createdAt).format(dateFormat.DATE_TIME_FORMAT)}</p>
            <p>Son güncelleme: {dayjs(task.updatedAt).format(dateFormat.DATE_TIME_FORMAT)}</p>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
