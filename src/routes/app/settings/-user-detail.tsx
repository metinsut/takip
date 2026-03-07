import { useSuspenseQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetUser } from "@/functions/auth/get-user";
import { m } from "@/paraglide/messages";

export function UserDetail() {
  const { data: user } = useSuspenseQuery(useGetUser());
  return (
    <Card>
      <CardHeader>
        <CardTitle>{user?.name}</CardTitle>
        <CardDescription>{user?.email}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {m.joinedAt()}: {dayjs(user?.createdAt).format("DD.MM.YYYY HH:mm")}
        </p>
      </CardContent>
    </Card>
  );
}
