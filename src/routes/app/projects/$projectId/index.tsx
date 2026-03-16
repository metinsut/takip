import { formOptions } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useLoaderData, useNavigate, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useAppForm, withForm } from "@/components/new-form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/sonner";
import type { CreateProjectType } from "@/db/schema";
import { createProjectSchema } from "@/db/schema";
import { createProject, updateProject } from "@/functions/project";
import { getProjectQueryKey } from "@/functions/project/get-project";
import { getProjectsQueryKey } from "@/functions/project/get-projects";
import { dateFormat } from "@/helpers/date-format";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/app/projects/$projectId/")({
  component: ProjectForm,
});

const projectFormOptions = formOptions({
  defaultValues: {
    name: "",
    description: undefined,
  } as CreateProjectType,
  validators: {
    onSubmit: createProjectSchema,
  },
});

const ProjectDetailsFields = withForm({
  ...projectFormOptions,
  render: ({ form }) => (
    <FieldGroup>
      <form.AppField name="name">
        {(field) => (
          <field.InputField label={m.projectName()} placeholder="Örn. Takip mobil uygulaması" />
        )}
      </form.AppField>

      <form.AppField name="description">
        {(field) => (
          <field.TextareaField
            label={m.projectDescription()}
            placeholder="Bu projede neyi takip etmek istiyorsun?"
          />
        )}
      </form.AppField>
    </FieldGroup>
  ),
});

function ProjectForm() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { project } = useLoaderData({ from: "/app/projects/$projectId" });

  const form = useAppForm({
    ...projectFormOptions,
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? undefined,
    } as CreateProjectType,
    onSubmit: async ({ value }) => {
      if (project) {
        await updateProject({
          data: { id: project.id, name: value.name, description: value.description },
        });
        await queryClient.invalidateQueries({
          queryKey: [getProjectQueryKey, project.id],
        });
        toast.success("Proje başarıyla güncellendi.");
      } else {
        await createProject({ data: { name: value.name, description: value.description } });
        toast.success("Proje başarıyla oluşturuldu.");
      }

      await queryClient.invalidateQueries({ queryKey: [getProjectsQueryKey] });
      await router.invalidate();
      navigate({ to: "/app/projects" });
    },
  });

  return (
    <div className="grid gap-4">
      <Card className="max-w-xl">
        <CardContent>
          <form.AppForm>
            <form
              noValidate
              className="flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit();
              }}
            >
              <ProjectDetailsFields form={form} />

              <div className="flex justify-end">
                <form.SubmitButton>Değişiklikleri kaydet</form.SubmitButton>
              </div>
            </form>
          </form.AppForm>
        </CardContent>
        {project ? (
          <CardFooter className="justify-between gap-3">
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <p>Oluşturulma: {dayjs(project.createdAt).format(dateFormat.DATETIME_FORMAT)}</p>
              <p>Son güncelleme: {dayjs(project.updatedAt).format(dateFormat.DATETIME_FORMAT)}</p>
            </div>
          </CardFooter>
        ) : null}
      </Card>
    </div>
  );
}
