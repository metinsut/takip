import { CheckCircleIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { InputForm } from "@/components/forms/input-form";
import { TextareaForm } from "@/components/forms/textarea-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { toast } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import type { CreateProjectType } from "@/db/schema";
import { createProjectSchema } from "@/db/schema";
import { createProject, updateProject, useGetProject } from "@/functions/project";
import { dateFormat } from "@/helpers/date-format";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/app/projects/$projectId/")({
  component: ProjectForm,
});

function ProjectForm() {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const { data: project } = useSuspenseQuery(useGetProject(projectId));

  const form = useForm({
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? undefined,
    } as CreateProjectType,
    validators: {
      onSubmit: createProjectSchema,
    },
    onSubmit: async ({ value }) => {
      if (project) {
        await updateProject({
          data: { id: project.id, name: value.name, description: value.description },
        });
        toast.success("Proje başarıyla güncellendi.");
      } else {
        await createProject({ data: { name: value.name, description: value.description } });
        toast.success("Proje başarıyla oluşturuldu.");
      }
      navigate({ to: "/app/projects" });
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
              <form.Field name="name">
                {(field) => (
                  <InputForm
                    field={field}
                    label={m.projectName()}
                    placeholder="Örn. Takip mobil uygulaması"
                  />
                )}
              </form.Field>

              <form.Field name="description">
                {(field) => (
                  <TextareaForm
                    field={field}
                    label={m.projectDescription()}
                    placeholder="Bu projede neyi takip etmek istiyorsun?"
                  />
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
