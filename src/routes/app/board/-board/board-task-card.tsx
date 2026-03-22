import { CalendarDotsIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import dayjs from "dayjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { taskPriority } from "@/db/schema";
import type { BoardTaskListItem } from "@/functions/project-board";
import { dateFormat } from "@/helpers/date-format";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";

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

export function BoardTaskCard(props: { isDragging?: boolean; task: BoardTaskListItem }) {
  const { isDragging = false, task } = props;
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
