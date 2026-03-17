import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useLoaderData, useNavigate, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useAppForm } from "@/components/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { toast } from "@/components/ui/sonner";
import type { SaveTaskType } from "@/db/schema";
import { saveTaskSchema, taskPriority, taskStatus } from "@/db/schema";
import { createTask, getTaskQueryKey, getTasksQueryKey, updateTask } from "@/functions/task";
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

export const Route = createFileRoute("/app/task/$taskId/")({
  component: TaskForm,
});

function TaskForm() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { task } = useLoaderData({ from: "/app/task/$taskId" });
  const { activeProjectId } = useLoaderData({ from: "__root__" });

  const defaultValues: SaveTaskType = {
    projectId: task?.projectId ?? activeProjectId ?? 0,
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? taskStatus.todo,
    priority: task?.priority ?? taskPriority.medium,
    dueDate: task?.dueDate ? dayjs(task.dueDate).toDate() : undefined,
    assigneeId: task?.assigneeId ?? undefined,
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
            id: task.id,
            projectId: value.projectId,
            title: value.title,
            description: value.description,
            status: value.status,
            priority: value.priority,
            dueDate: value.dueDate,
            assigneeId: value.assigneeId,
          },
        });
        toast.success("Görev başarıyla güncellendi.");
      } else {
        await createTask({
          data: {
            projectId: value.projectId,
            title: value.title,
            description: value.description,
            status: value.status,
            priority: value.priority,
            dueDate: value.dueDate,
            assigneeId: value.assigneeId,
          },
        });
        toast.success("Görev başarıyla oluşturuldu.");
      }

      await queryClient.invalidateQueries({ queryKey: [getTaskQueryKey] });
      await queryClient.invalidateQueries({ queryKey: [getTasksQueryKey] });
      await router.invalidate();
      navigate({ to: "/app/task" });
    },
  });

  return (
    <Card>
      <CardContent>
        <form
          noValidate
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <FieldSet>
              <FieldLegend>Görev bilgileri</FieldLegend>
              <FieldDescription>Görevinizin bilgilerini giriniz.</FieldDescription>
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
            <p>Oluşturulma: {dayjs(task.createdAt).format(dateFormat.DATETIME_FORMAT)}</p>
            <p>Son güncelleme: {dayjs(task.updatedAt).format(dateFormat.DATETIME_FORMAT)}</p>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
