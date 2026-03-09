ALTER TABLE "task_label" DROP CONSTRAINT "task_label_task_id_task_id_fk";--> statement-breakpoint
ALTER TABLE "task" DROP CONSTRAINT "task_pkey";--> statement-breakpoint
ALTER TABLE "task" RENAME COLUMN "id" TO "legacy_id";--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "id" integer;--> statement-breakpoint
WITH ordered_tasks AS (
	SELECT
		"legacy_id",
		row_number() OVER (ORDER BY "created_at", "updated_at", "legacy_id") AS "new_id"
	FROM "task"
)
UPDATE "task" AS t
SET "id" = ordered_tasks."new_id"
FROM ordered_tasks
WHERE t."legacy_id" = ordered_tasks."legacy_id";--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1);--> statement-breakpoint
SELECT setval(
	pg_get_serial_sequence('public.task', 'id'),
	COALESCE((SELECT MAX("id") FROM "task"), 1),
	COALESCE((SELECT MAX("id") IS NOT NULL FROM "task"), false)
);--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_pkey" PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "task_label" ADD COLUMN "task_id_v2" integer;--> statement-breakpoint
UPDATE "task_label" AS tl
SET "task_id_v2" = t."id"
FROM "task" AS t
WHERE tl."task_id" = t."legacy_id";--> statement-breakpoint
ALTER TABLE "task_label" DROP CONSTRAINT "task_label_task_id_label_id_pk";--> statement-breakpoint
ALTER TABLE "task_label" DROP COLUMN "task_id";--> statement-breakpoint
ALTER TABLE "task_label" RENAME COLUMN "task_id_v2" TO "task_id";--> statement-breakpoint
ALTER TABLE "task_label" ALTER COLUMN "task_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task_label" ADD CONSTRAINT "task_label_task_id_label_id_pk" PRIMARY KEY("task_id","label_id");--> statement-breakpoint
ALTER TABLE "task_label" ADD CONSTRAINT "task_label_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN "legacy_id";
