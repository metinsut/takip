import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  type UniqueIdentifier,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowsOutCardinalIcon,
  CalendarDotsIcon,
  DotsSixVerticalIcon,
  KanbanIcon,
} from "@phosphor-icons/react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLoaderData } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { toast } from "@/components/ui/sonner";
import { taskPriority, taskStatus } from "@/db/schema";
import {
  type BoardTaskListItem,
  getBoardTasksQueryKey,
  moveBoardTask,
  useGetBoardTasks,
} from "@/functions/project-board";
import { getTaskQueryKey, getTasksQueryKey } from "@/functions/task";
import { dateFormat } from "@/helpers/date-format";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import {
  type BoardColumnStatus,
  buildBoardColumns,
  getBoardColumnId,
  getBoardDropTarget,
  getBoardTaskId,
  moveBoardTaskLocally,
} from "./task-board-view-helpers";

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

function getPriorityLabel(priority: BoardTaskListItem["priority"]) {
  switch (priority) {
    case taskPriority.high:
      return m.high();
    case taskPriority.low:
      return m.low();
    default:
      return m.medium();
  }
}

function getPriorityVariant(priority: BoardTaskListItem["priority"]) {
  switch (priority) {
    case taskPriority.high:
      return "destructive" as const;
    case taskPriority.low:
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

function normalizeDragId(id: UniqueIdentifier | null | undefined) {
  if (typeof id === "string") {
    return id;
  }

  if (typeof id === "number") {
    return String(id);
  }

  return undefined;
}

function BoardTaskCard(props: {
  action?: React.ReactNode;
  isDragging?: boolean;
  task: BoardTaskListItem;
}) {
  const { action, isDragging = false, task } = props;
  const dueDateLabel = task.dueDate
    ? dayjs(task.dueDate).format(dateFormat.DATE_FORMAT)
    : "Tarihsiz";

  return (
    <Card
      size="sm"
      className={cn(
        "border border-border/70 bg-background py-3 shadow-sm transition-shadow",
        isDragging && "shadow-lg ring-2 ring-primary/15",
      )}
    >
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-sm">
          <span className="truncate">{task.title}</span>
          <Badge variant="outline">#{task.id}</Badge>
        </CardTitle>
        <CardDescription className="line-clamp-3 whitespace-pre-wrap">
          {task.description}
        </CardDescription>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={getPriorityVariant(task.priority)}>
            {getPriorityLabel(task.priority)}
          </Badge>
          <Badge variant="secondary">
            <CalendarDotsIcon />
            {dueDateLabel}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          {dayjs(task.updatedAt).format(dateFormat.DATE_TIME_FORMAT)}
        </div>
        <Button
          variant="outline"
          size="xs"
          nativeButton={false}
          render={
            <Link to="/app/task/$taskId" params={{ taskId: String(task.id) }}>
              Detay
            </Link>
          }
        />
      </CardFooter>
    </Card>
  );
}

function SortableBoardTaskCard(props: { disabled: boolean; task: BoardTaskListItem }) {
  const { disabled, task } = props;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: getBoardTaskId(task.id),
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <BoardTaskCard
        task={task}
        isDragging={isDragging}
        action={
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Görevi taşı"
            className="touch-none"
            disabled={disabled}
            {...attributes}
            {...listeners}
          >
            <DotsSixVerticalIcon />
          </Button>
        }
      />
    </div>
  );
}

function BoardColumn(props: {
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
    <div ref={setNodeRef} className="flex min-h-[28rem] flex-col">
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

export function TaskBoard() {
  const queryClient = useQueryClient();
  const { activeProjectId } = useLoaderData({ from: "__root__" });
  const { data: boardTasks } = useSuspenseQuery(useGetBoardTasks(activeProjectId));
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tasks, setTasks] = useState(boardTasks);

  useEffect(() => {
    setTasks(boardTasks);
  }, [boardTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const columns = buildBoardColumns(tasks);
  const activeTask = activeTaskId ? tasks.find((task) => task.id === activeTaskId) : undefined;

  const handleDragStart = (event: DragStartEvent) => {
    if (isSyncing) {
      return;
    }

    const activeId = normalizeDragId(event.active.id);

    if (!activeId?.startsWith("task:")) {
      return;
    }

    const taskId = Number(activeId.replace("task:", ""));

    if (Number.isInteger(taskId)) {
      setActiveTaskId(taskId);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const nextActiveTaskId = activeTaskId;

    setActiveTaskId(null);

    if (!nextActiveTaskId || isSyncing) {
      return;
    }

    const dropTarget = getBoardDropTarget(columns, {
      activeTaskId: nextActiveTaskId,
      overId: normalizeDragId(event.over?.id),
    });

    if (!dropTarget) {
      return;
    }

    const previousTasks = tasks;
    const nextTasks = moveBoardTaskLocally(previousTasks, {
      status: dropTarget.status,
      targetIndex: dropTarget.targetIndex,
      taskId: nextActiveTaskId,
    });

    if (JSON.stringify(previousTasks) === JSON.stringify(nextTasks)) {
      return;
    }

    setTasks(nextTasks);
    setIsSyncing(true);

    try {
      await moveBoardTask({
        data: {
          status: dropTarget.status,
          targetIndex: dropTarget.targetIndex,
          taskId: nextActiveTaskId,
        },
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [getBoardTasksQueryKey] }),
        queryClient.invalidateQueries({ queryKey: [getTasksQueryKey] }),
        queryClient.invalidateQueries({ queryKey: [getTaskQueryKey] }),
      ]);
    } catch (error) {
      setTasks(previousTasks);
      toast.error(error instanceof Error ? error.message : "Board güncellenemedi.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
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
          <Badge variant="secondary">{tasks.length} aktif görev</Badge>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/app/task">Backlog'u aç</Link>}
          />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveTaskId(null)}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => (
            <BoardColumn
              key={column.status}
              status={column.status}
              tasks={column.tasks}
              disabled={isSyncing}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div className="w-[min(100vw-2rem,24rem)] rotate-1 opacity-95">
              <BoardTaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
