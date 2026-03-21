import { useQueryClient } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import { useAppForm } from "@/components/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup, FieldSet } from "@/components/ui/field";
import { toast } from "@/components/ui/sonner";
import { createTaskCommentSchema } from "@/db/schema";
import { getTaskActivitiesQueryKey } from "@/functions/task-activity";
import { createTaskComment, getTaskCommentsQueryKey } from "@/functions/task-comment";

const commentFormSchema = createTaskCommentSchema.pick({
  body: true,
});

export function TaskCommentComposer() {
  const queryClient = useQueryClient();
  const { task } = useLoaderData({ from: "/app/task/$taskId" });

  const form = useAppForm({
    defaultValues: {
      body: "",
    },
    validators: {
      onSubmit: commentFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!task) {
        return;
      }

      try {
        await createTaskComment({
          data: {
            body: value.body,
            taskId: task.id,
          },
        });

        await queryClient.invalidateQueries({ queryKey: [getTaskCommentsQueryKey, task.id] });
        await queryClient.invalidateQueries({ queryKey: [getTaskActivitiesQueryKey, task.id] });
        form.reset();
        toast.success("Yorum eklendi.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Yorum eklenemedi.");
      }
    },
  });

  if (!task) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yorum ekle</CardTitle>
        <CardDescription>Bu alan yalnızca yeni yorum göndermek için kullanılır.</CardDescription>
      </CardHeader>
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
              <FieldGroup>
                <form.AppField
                  name="body"
                  children={(field) => (
                    <field.TextareaForm label="Yorum" placeholder="Görevle ilgili notunu yaz..." />
                  )}
                />
                <div className="flex justify-end">
                  <form.SubmitButton label="Yorumu gönder" />
                </div>
              </FieldGroup>
            </FieldSet>
          </form.AppForm>
        </form>
      </CardContent>
    </Card>
  );
}
