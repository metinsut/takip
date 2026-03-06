import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import Cookies from "js-cookie";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeEnum, themeCookieName } from "@/functions/theme/types";
import { m } from "@/paraglide/messages";

type SettingsThemeProps = Record<string, never>;

export function Theme(_props: SettingsThemeProps) {
  const themeFromCookie = Cookies.get(themeCookieName) ?? ThemeEnum.light;
  const [isDark, setIsDark] = useState(themeFromCookie === ThemeEnum.dark);

  function handleThemeChange(checked: boolean) {
    const newTheme = checked ? ThemeEnum.dark : ThemeEnum.light;
    Cookies.set(themeCookieName, newTheme);
    setIsDark(checked);
    const root = document.documentElement;
    root.classList.remove(ThemeEnum.light, ThemeEnum.dark);
    root.classList.add(newTheme);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{m.selectTheme()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="theme-switch" className="text-sm">
            {isDark ? m.darkMode() : m.lightMode()} mode
            {isDark ? (
              <MoonIcon className="text-muted-foreground size-5" />
            ) : (
              <SunIcon className="text-muted-foreground size-5" />
            )}
          </Label>
          <Switch id="theme-switch" checked={isDark} onCheckedChange={handleThemeChange} />
        </div>
      </CardContent>
    </Card>
  );
}
