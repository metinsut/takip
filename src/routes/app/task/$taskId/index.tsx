import { CheckCircleIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { InputForm } from "@/components/forms/input-form";
import { SelectForm } from "@/components/forms/select-form";
import { TextareaForm } from "@/components/forms/textarea-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import type { CreateTaskType, TaskPriority, TaskStatus } from "@/db/schema";
import { taskPriority, taskStatus } from "@/db/schema";
import { createTask, updateTask } from "@/functions/task";
import { dateFormat } from "@/helpers/date-format";
import { m } from "@/paraglide/messages";

const PRIORITY_OPTIONS = {
  low: {
    label: m.low(),
    value: taskPriority.low,
  },
  medium: {
    label: m.medium(),
    value: taskPriority.medium,
  },
  high: {
    label: m.high(),
    value: taskPriority.high,
  },
};

const STATUS_OPTIONS = {
  todo: {
    label: m.todo(),
    value: taskStatus.todo,
  },
  in_progress: {
    label: m.in_progress(),
    value: taskStatus.in_progress,
  },
  done: {
    label: m.done(),
    value: taskStatus.done,
  },
};

type TaskFormValues = Omit<CreateTaskType, "dueDate"> & {
  id?: number;
  dueDate?: string;
};

export const Route = createFileRoute("/app/task/$taskId/")({
  component: TaskForm,
});

function TaskForm() {
  const navigate = useNavigate();
  const { task } = useLoaderData({ from: "/app/task/$taskId" });
  const { activeProjectId } = useLoaderData({ from: "__root__" });

  const form = useForm({
    defaultValues: {
      ...task,
      projectId: task?.projectId ?? activeProjectId,
      title: task?.title ?? "",
      description: task?.description ?? undefined,
      status: (task?.status ?? "todo") as TaskStatus,
      priority: (task?.priority ?? "medium") as TaskPriority,
      dueDate: task?.dueDate ? dayjs(task.dueDate).format("YYYY-MM-DD") : "",
    } as TaskFormValues,
    onSubmit: async ({ value }) => {
      if (task) {
        await updateTask({
          data: {
            id: task.id,
            title: value.title,
            description: value.description ?? null,
            status: value.status,
            priority: value.priority,
            dueDate: value.dueDate ? new Date(value.dueDate) : null,
          },
        });
        toast.success("Görev başarıyla güncellendi.");
      } else {
        if (!value.projectId) {
          toast.error("Lütfen bir proje seçin.");
          return;
        }
        await createTask({
          data: {
            projectId: value.projectId,
            title: value.title,
            description: value.description,
            status: value.status,
            priority: value.priority,
            dueDate: value.dueDate ? new Date(value.dueDate) : undefined,
          },
        });
        toast.success("Görev başarıyla oluşturuldu.");
      }
      navigate({ to: "/app/task" });
    },
  });

  return (
    <div className="grid gap-4">
      <Card className="max-w-xl">
        <CardContent>
          <form
            noValidate
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field name="title">
                {(field) => <InputForm field={field} label="My Input" placeholder="Placeholder" />}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <TextareaForm field={field} label="Açıklama" placeholder="Görev detayları" />
                )}
              </form.Field>

              <form.Field name="status">
                {(field) => (
                  <SelectForm
                    field={field}
                    label="Durum"
                    placeholder="Durum"
                    options={Object.values(STATUS_OPTIONS)}
                    emptyValue={taskStatus.todo}
                  />
                )}
              </form.Field>

              <form.Field name="priority">
                {(field) => (
                  <SelectForm
                    field={field}
                    label="Öncelik"
                    placeholder="Öncelik"
                    options={Object.values(PRIORITY_OPTIONS)}
                    emptyValue={taskPriority.medium}
                  />
                )}
              </form.Field>

              <form.Field name="dueDate">
                {(field) => (
                  <Field>
                    <label htmlFor="task-dueDate" className="text-sm font-medium">
                      Bitiş tarihi
                    </label>
                    <input
                      id="task-dueDate"
                      type="date"
                      className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value || undefined)}
                      onBlur={field.handleBlur}
                    />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>

            <div className="flex justify-end">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
                children={([canSubmit, isSubmitting, isDirty]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting || !isDirty}>
                    {isSubmitting ? <Spinner /> : <CheckCircleIcon />}
                    Değişiklikleri kaydet
                  </Button>
                )}
              />
            </div>
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
    </div>
  );
}
