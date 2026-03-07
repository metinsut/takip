import { CheckCircleIcon } from "@phosphor-icons/react";
import { useForm } from "@tanstack/react-form";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { CreateProjectType } from "@/db/schema";
import { createProjectSchema } from "@/db/schema";
import { createProject, updateProject, useGetProject } from "@/functions/projects";
import { dateFormat } from "@/helpers/date-format";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/app/projects/$projectId/")({
  component: ProjectForm,
});

function ProjectForm() {
  const { projectId } = Route.useParams();
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
      } else {
        await createProject({ data: { name: value.name, description: value.description } });
      }
    },
  });

  return (
    <div className="grid gap-4">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>{project?.name ?? m.addProject()}</CardTitle>
        </CardHeader>
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
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  const errors = field.state.meta.errors;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{m.projectName()}</FieldLabel>
                      <FieldDescription>
                        Projede görünecek kısa ve anlaşılır adı yaz.
                      </FieldDescription>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        placeholder="Örn. Takip mobil uygulaması"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid ? <FieldError errors={errors} /> : null}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="description">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  const errors = field.state.meta.errors;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{m.projectDescription()}</FieldLabel>
                      <FieldDescription>
                        İsteğe bağlı. Proje kapsamını birkaç cümleyle özetle.
                      </FieldDescription>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value || undefined)}
                        placeholder="Bu projede neyi takip etmek istiyorsun?"
                        rows={6}
                        aria-invalid={isInvalid}
                      />
                      {isInvalid ? <FieldError errors={errors} /> : null}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>

            <div className="flex justify-end">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
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
