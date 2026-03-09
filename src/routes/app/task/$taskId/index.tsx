import { CheckCircleIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate, useLoaderData } from "@tanstack/react-router";
import dayjs from "dayjs";
import { InputForm } from "@/components/forms/input-form";
import { TextareaForm } from "@/components/forms/textarea-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import type { CreateTaskType } from "@/db/schema";
import type { TaskStatus, TaskPriority } from "@/db/schema";
import { createTask, updateTask, useGetTask } from "@/functions/task";
import { dateFormat } from "@/helpers/date-format";

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "Yapılacak" },
  { value: "in_progress", label: "Devam ediyor" },
  { value: "done", label: "Tamamlandı" },
];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Düşük" },
  { value: "medium", label: "Orta" },
  { value: "high", label: "Yüksek" },
];

type TaskFormValues = Omit<CreateTaskType, "dueDate"> & {
  id?: string;
  dueDate?: string;
};

export const Route = createFileRoute("/app/task/$taskId/")({
  component: TaskForm,
  validateSearch: (search: Record<string, unknown>) => ({
    projectId: (search.projectId as string | undefined) ?? undefined,
  }),
  loader: async ({ context, params }) => {
    const { taskId } = params;
    if (taskId === "add") return { task: null };
    const task = await context.queryClient.fetchQuery(useGetTask(taskId));
    return { task };
  },
});

function TaskForm() {
  const { taskId } = Route.useParams();
  const { projectId: searchProjectId } = Route.useSearch();
  const navigate = useNavigate();
  const { task } = useLoaderData({ from: "/app/task/$taskId/" });
  const { projects, activeProjectId } = useLoaderData({ from: "__root__" });

  const isAdd = taskId === "add";
  const defaultProjectId = searchProjectId ?? activeProjectId ?? projects?.[0]?.id ?? "";

  const form = useForm({
    defaultValues: {
      ...(task ? { id: task.id } : {}),
      projectId: task?.projectId ?? defaultProjectId,
      title: task?.title ?? "",
      description: task?.description ?? undefined,
      status: (task?.status ?? "todo") as TaskStatus,
      priority: (task?.priority ?? "medium") as TaskPriority,
      dueDate: task?.dueDate
        ? dayjs(task.dueDate).format("YYYY-MM-DD")
        : "",
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
              {isAdd && projects?.length ? (
                <form.Field name="projectId">
                  {(field) => (
                    <Field>
                      <label htmlFor="task-project" className="text-sm font-medium">
                        Proje
                      </label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v: string | null) => field.handleChange(v ?? "")}
                      >
                        <SelectTrigger id="task-project" className="w-full">
                          <SelectValue placeholder="Proje seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                </form.Field>
              ) : null}

              <form.Field name="title">
                {(field) => (
                  <InputForm
                    field={field}
                    label="Başlık"
                    placeholder="Görev başlığı"
                  />
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <TextareaForm
                    field={field}
                    label="Açıklama"
                    placeholder="Görev detayları"
                  />
                )}
              </form.Field>

              <form.Field name="status">
                {(field) => (
                  <Field>
                    <label htmlFor="task-status" className="text-sm font-medium">
                      Durum
                    </label>
                    <Select
                      value={field.state.value}
                      onValueChange={(v: string | null) =>
                        field.handleChange((v ?? "todo") as TaskStatus)
                      }
                    >
                      <SelectTrigger id="task-status" className="w-full">
                        <SelectValue placeholder="Durum" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </form.Field>

              <form.Field name="priority">
                {(field) => (
                  <Field>
                    <label htmlFor="task-priority" className="text-sm font-medium">
                      Öncelik
                    </label>
                    <Select
                      value={field.state.value}
                      onValueChange={(v: string | null) =>
                        field.handleChange((v ?? "medium") as TaskPriority)
                      }
                    >
                      <SelectTrigger id="task-priority" className="w-full">
                        <SelectValue placeholder="Öncelik" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRIORITY_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
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

