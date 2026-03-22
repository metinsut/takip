import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ArrowsOutCardinalIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { taskStatus } from "@/db/schema";
import type { BoardTaskListItem } from "@/functions/project-board";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { type BoardColumnStatus, getBoardColumnId, getBoardTaskId } from "./board-dnd-helpers";
import { SortableBoardTaskCard } from "./sortable-board-task-card";

const boardColumnCopy: Record<
  BoardColumnStatus,
  {
    description: string;
    empty: string;
    label: string;
  }
> = {
  [taskStatus.todo]: {
    description: "Board'a alınmış ama henüz başlanmamış işler.",
    empty: "Henüz yapılacak kolonunda görev yok.",
    label: m.todo(),
  },
  [taskStatus.in_progress]: {
    description: "Şu anda üzerinde çalışılan aktif işler.",
    empty: "Devam eden görev bulunmuyor.",
    label: m.in_progress(),
  },
  [taskStatus.done]: {
    description: "Son 72 saatte tamamlanan ve board'da kalan işler.",
    empty: "Yakın zamanda tamamlanan görev yok.",
    label: m.done(),
  },
};

export function BoardTaskColumn(props: {
  disabled: boolean;
  tasks: BoardTaskListItem[];
  status: BoardColumnStatus;
}) {
  const { disabled, status, tasks } = props;
  const copy = boardColumnCopy[status];
  const { isOver, setNodeRef } = useDroppable({
    id: getBoardColumnId(status),
    disabled,
  });

  return (
    <div ref={setNodeRef} className="flex min-h-112 flex-col">
      <Card className={cn("flex min-h-full flex-1", isOver && "ring-2 ring-primary/15")}>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between gap-3">
            <span>{copy.label}</span>
            <Badge variant="secondary">{tasks.length}</Badge>
          </CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3">
          <SortableContext
            items={tasks.map((task) => getBoardTaskId(task.id))}
            strategy={verticalListSortingStrategy}
          >
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <SortableBoardTaskCard key={task.id} task={task} disabled={disabled} />
              ))
            ) : (
              <Empty className="min-h-52 border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ArrowsOutCardinalIcon />
                  </EmptyMedia>
                  <EmptyTitle>{copy.label}</EmptyTitle>
                  <EmptyDescription>{copy.empty}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}
