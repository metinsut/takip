ALTER TABLE "user" ALTER COLUMN "ban_expires" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "active_organization_id" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "active_team_id" text;