import { CodesandboxLogoIcon, GearIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { m } from "@/paraglide/messages";

export function NavSecondary() {
  return (
    <SidebarMenu className="mt-auto">
      <SidebarMenuItem>
        <SidebarMenuButton
          render={
            <Link to="/app/settings" activeProps={{ className: "bg-background" }}>
              <GearIcon />
              {m.settings()}
            </Link>
          }
        />
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={
            <Link to="/app/examples" activeProps={{ className: "bg-background" }}>
              <CodesandboxLogoIcon />
              {m.examples()}
            </Link>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
