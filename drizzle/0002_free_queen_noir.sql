CREATE TABLE "project_board_task" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_board_task_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" integer NOT NULL,
	"task_id" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL,
	"done_at" timestamp with time zone,
	"removed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_board_task" ADD CONSTRAINT "project_board_task_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_board_task" ADD CONSTRAINT "project_board_task_task_id_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."task"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "project_board_task_task_id_unique" ON "project_board_task" USING btree ("task_id");--> statement-breakpoint
CREATE INDEX "project_board_task_project_removed_sort_idx" ON "project_board_task" USING btree ("project_id","removed_at","sort_order");--> statement-breakpoint
CREATE INDEX "project_board_task_project_done_idx" ON "project_board_task" USING btree ("project_id","done_at");