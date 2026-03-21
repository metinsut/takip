import { ChatCircleDotsIcon, ClockCounterClockwiseIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLoaderData } from "@tanstack/react-router";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTaskActivities } from "@/functions/task-activity";
import { useGetTaskComments } from "@/functions/task-comment";
import { dateFormat } from "@/helpers/date-format";
import { DEFAULT_TASK_ACTIVITY_LIMIT, describeTaskActivity } from "./-activity-helpers";

function getInitials(value?: string | null) {
  if (!value) {
    return "NA";
  }

  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getActivityBadgeVariant(type: string) {
  switch (type) {
    case "task_deleted":
    case "comment_deleted":
      return "destructive";
    case "task_created":
      return "default";
    case "comment_created":
    case "comment_updated":
      return "secondary";
    default:
      return "outline";
  }
}

export function TaskActivityPanel() {
  const { task } = useLoaderData({ from: "/app/task/$taskId" });

  if (!task) {
    return null;
  }

  const { data: activities } = useSuspenseQuery(
    useGetTaskActivities(task.id, DEFAULT_TASK_ACTIVITY_LIMIT),
  );
  const { data: comments } = useSuspenseQuery(useGetTaskComments(task.id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivite</CardTitle>
        <CardDescription>Görev geçmişi ve paylaşılan yorumlar burada listelenir.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="activity">Aktivite ({activities.length})</TabsTrigger>
            <TabsTrigger value="comments">Yorumlar ({comments.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="activity">
            {activities.length ? (
              <ItemGroup className="gap-3">
                {activities.map((activity) => {
                  const details = describeTaskActivity(activity);
                  const actorName =
                    activity.actorUser?.name ??
                    (activity.actorType === "system" ? "Sistem" : "Bilinmeyen kullanıcı");

                  return (
                    <Item key={activity.id} variant="muted" size="sm" className="items-start">
                      <ItemMedia>
                        <Avatar size="sm">
                          {activity.actorUser?.image ? (
                            <AvatarImage src={activity.actorUser.image} alt={actorName} />
                          ) : null}
                          <AvatarFallback>{getInitials(actorName)}</AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent className="min-w-0 gap-2">
                        <ItemHeader className="flex-wrap items-start gap-2">
                          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                            <ItemTitle className="w-auto">{details.title}</ItemTitle>
                            <Badge variant={getActivityBadgeVariant(activity.type)}>
                              {details.badge}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {dayjs(activity.occurredAt).format(dateFormat.DATE_TIME_FORMAT)}
                          </span>
                        </ItemHeader>
                        <ItemDescription className="line-clamp-none">
                          {actorName} tarafından işlendi
                        </ItemDescription>
                        {details.lines.length ? (
                          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            {details.lines.map((line) => (
                              <p key={`${activity.id}-${line}`} className="whitespace-pre-wrap">
                                {line}
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </ItemContent>
                    </Item>
                  );
                })}
              </ItemGroup>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ClockCounterClockwiseIcon />
                  </EmptyMedia>
                  <EmptyTitle>Henüz aktivite yok</EmptyTitle>
                  <EmptyDescription>
                    Görevde yapılan değişiklikler burada görünecek.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
          <TabsContent value="comments">
            {comments.length ? (
              <ItemGroup className="gap-3">
                {comments.map((comment) => (
                  <Item key={comment.id} variant="outline" size="sm" className="items-start">
                    <ItemMedia>
                      <Avatar size="sm">
                        {comment.author.image ? (
                          <AvatarImage src={comment.author.image} alt={comment.author.name} />
                        ) : null}
                        <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent className="min-w-0 gap-2">
                      <ItemHeader className="flex-wrap items-start gap-2">
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                          <ItemTitle className="w-auto">{comment.author.name}</ItemTitle>
                          {comment.editedAt ? <Badge variant="outline">Düzenlendi</Badge> : null}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {dayjs(comment.createdAt).format(dateFormat.DATE_TIME_FORMAT)}
                        </span>
                      </ItemHeader>
                      <p className="whitespace-pre-wrap text-sm text-foreground">{comment.body}</p>
                      {comment.editedAt ? (
                        <p className="text-xs text-muted-foreground">
                          Son düzenleme:{" "}
                          {dayjs(comment.editedAt).format(dateFormat.DATE_TIME_FORMAT)}
                        </p>
                      ) : null}
                    </ItemContent>
                  </Item>
                ))}
              </ItemGroup>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ChatCircleDotsIcon />
                  </EmptyMedia>
                  <EmptyTitle>Henüz yorum yok</EmptyTitle>
                  <EmptyDescription>İlk yorumu eklediğinde burada listelenecek.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
