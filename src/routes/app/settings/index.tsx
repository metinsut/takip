import { createFileRoute } from "@tanstack/react-router";
import { m } from "@/paraglide/messages";
import { Lang } from "./-lang";
import { Theme } from "./-theme";
import { UserDetail } from "./-user-detail";

export const Route = createFileRoute("/app/settings/")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="grid gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{m.settings()}</h1>
        <p className="text-muted-foreground text-sm">{m.settingsDescription()}</p>
      </div>
      <UserDetail />
      <div className="flex flex-wrap gap-3">
        <Theme />
        <Lang />
      </div>
    </div>
  );
}
