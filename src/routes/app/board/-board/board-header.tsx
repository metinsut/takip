import { KanbanIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ProjectBoardHeader(props: { taskCount: number }) {
  const { taskCount } = props;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex max-w-2xl flex-col gap-1">
        <div className="flex items-center gap-2">
          <KanbanIcon />
          <h1 className="text-lg font-semibold">Board</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Aktif projedeki board görevlerini durum bazında yönetin. Kartları kolon içinde veya
          kolonlar arasında sürükleyerek anında güncelleyebilirsiniz.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{taskCount} aktif görev</Badge>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link to="/app/task">Backlog'u aç</Link>}
        />
      </div>
    </div>
  );
}
