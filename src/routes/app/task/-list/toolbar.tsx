import { PlusIcon } from "@phosphor-icons/react";
import { Link, useLoaderData } from "@tanstack/react-router";

export function Toolbar() {
  const { activeProjectId } = useLoaderData({ from: "__root__" });

  return (
    <div className="flex justify-end">
      <Link
        to="/app/task/$taskId"
        params={{ taskId: "add" }}
        search={{ projectId: activeProjectId ?? undefined }}
        className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <PlusIcon />
        Görev Ekle
      </Link>
    </div>
  );
}
