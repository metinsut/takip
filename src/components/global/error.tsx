import { WarningCircleIcon } from "@phosphor-icons/react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function ErrorComponent(props: ErrorComponentProps) {
  const { error, reset } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle />
      </CardHeader>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <WarningCircleIcon />
            </EmptyMedia>
            <EmptyTitle>Something went wrong</EmptyTitle>
            <EmptyDescription className="font-mono text-left text-xs">
              {error.message}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row gap-2">
            {reset ? (
              <Button variant="outline" onClick={reset}>
                Try again
              </Button>
            ) : null}
            <Button variant="outline" nativeButton={false} render={<Link to="/">Go home</Link>} />
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  );
}
