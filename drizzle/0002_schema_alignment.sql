DO $$ BEGIN
 IF EXISTS (
  SELECT 1
  FROM pg_type t
  JOIN pg_namespace n ON n.oid = t.typnamespace
  WHERE n.nspname = 'public' AND t.typname = 'task_priority'
 ) AND NOT EXISTS (
  SELECT 1
  FROM pg_type t
  JOIN pg_namespace n ON n.oid = t.typnamespace
  WHERE n.nspname = 'public' AND t.typname = 'priority'
 ) THEN
  ALTER TYPE "public"."task_priority" RENAME TO "priority";
 END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (
  SELECT 1
  FROM pg_type t
  JOIN pg_namespace n ON n.oid = t.typnamespace
  WHERE n.nspname = 'public' AND t.typname = 'task_status'
 ) AND NOT EXISTS (
  SELECT 1
  FROM pg_type t
  JOIN pg_namespace n ON n.oid = t.typnamespace
  WHERE n.nspname = 'public' AND t.typname = 'status'
 ) THEN
  ALTER TYPE "public"."task_status" RENAME TO "status";
 END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "active_organization_id" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN IF NOT EXISTS "active_team_id" text;--> statement-breakpoint
DO $$ BEGIN
 IF EXISTS (
  SELECT 1
  FROM information_schema.columns
  WHERE table_schema = 'public'
   AND table_name = 'user'
   AND column_name = 'ban_expires'
   AND data_type <> 'timestamp with time zone'
 ) THEN
  ALTER TABLE "user" ALTER COLUMN "ban_expires" SET DATA TYPE timestamp with time zone;
 END IF;
END $$;
