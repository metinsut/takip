import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useLoaderData, useNavigate, useRouter } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useAppForm } from "@/components/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { toast } from "@/components/ui/sonner";
import { saveProjectSchema } from "@/db/schema";
import { createProject, updateProject } from "@/functions/project";
import { getProjectQueryKey } from "@/functions/project/get-project";
import { getProjectsQueryKey } from "@/functions/project/get-projects";
import { dateFormat } from "@/helpers/date-format";

export const Route = createFileRoute("/app/projects/$projectId/")({
  component: ProjectForm,
});

function ProjectForm() {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { project } = useLoaderData({ from: "/app/projects/$projectId" });

  const form = useAppForm({
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
    },
    validators: {
      onSubmit: saveProjectSchema,
    },
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
              <FieldLegend>Proje bilgileri</FieldLegend>
              <FieldDescription>Projenizin bilgilerini giriniz.</FieldDescription>
              <FieldGroup>
                <form.AppField
                  name="name"
                  children={(field) => <field.InputForm label="First Name" />}
                />
                <form.AppField
                  name="description"
                  children={(field) => <field.TextareaForm label="Description" />}
                />
                <div className="flex justify-end">
                  <form.SubmitButton label="Değişiklikleri kaydet" />
                </div>
              </FieldGroup>
            </FieldSet>
          </form.AppForm>
        </form>
      </CardContent>
      {project ? (
        <CardFooter className="justify-between gap-3">
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <p>Oluşturulma: {dayjs(project.createdAt).format(dateFormat.DATE_TIME_FORMAT)}</p>
            <p>Son güncelleme: {dayjs(project.updatedAt).format(dateFormat.DATE_TIME_FORMAT)}</p>
          </div>
        </CardFooter>
      ) : null}
    </Card>
  );
}
