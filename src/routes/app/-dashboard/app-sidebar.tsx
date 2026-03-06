import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { getLocale } from "@/paraglide/runtime";
import { NavFooter } from "./nav-footer";
import { NavHeader } from "./nav-header";
import { NavPrimary } from "./nav-primary";
import { NavSecondary } from "./nav-secondary";

export function AppSidebar() {
  const locale = getLocale();

  const dir = locale === "ar" ? "rtl" : "ltr";
  const side = dir === "rtl" ? "right" : "left";

  return (
    <Sidebar variant="inset" dir={dir} side={side}>
      <NavHeader />
      <SidebarContent>
        <NavPrimary />
        <NavSecondary />
      </SidebarContent>
      <NavFooter />
      <SidebarRail />
    </Sidebar>
  );
}
