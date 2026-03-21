CREATE TYPE "public"."task_activity_actor_type" AS ENUM('user', 'system');--> statement-breakpoint
CREATE TYPE "public"."task_activity_type" AS ENUM('task_created', 'task_updated', 'task_deleted', 'comment_created', 'comment_updated', 'comment_deleted');--> statement-breakpoint
CREATE TABLE "task_activity" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "task_activity_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"task_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	"comment_id" integer,
	"type" "task_activity_type" NOT NULL,
	"actor_type" "task_activity_actor_type" DEFAULT 'user' NOT NULL,
	"actor_id" text,
	"payload" jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_comment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "task_comment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"task_id" integer NOT NULL,
	"author_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"edited_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"deleted_by" text
);
--> statement-breakpoint
ALTER TABLE "project" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task_comment" ADD CONSTRAINT "task_comment_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_comment" ADD CONSTRAINT "task_comment_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_comment" ADD CONSTRAINT "task_comment_deleted_by_user_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "task_activity_task_occurred_idx" ON "task_activity" USING btree ("task_id","occurred_at");--> statement-breakpoint
CREATE INDEX "task_activity_project_occurred_idx" ON "task_activity" USING btree ("project_id","occurred_at");--> statement-breakpoint
CREATE INDEX "task_activity_comment_occurred_idx" ON "task_activity" USING btree ("comment_id","occurred_at");--> statement-breakpoint
CREATE INDEX "task_comment_task_deleted_created_idx" ON "task_comment" USING btree ("task_id","deleted_at","created_at");--> statement-breakpoint
CREATE INDEX "task_comment_author_created_idx" ON "task_comment" USING btree ("author_id","created_at");