ALTER TABLE "task_label" ALTER COLUMN "task_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "project_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "task_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "project_id" SET DATA TYPE integer;