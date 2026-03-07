import { FoldersIcon, HouseIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { m } from "@/paraglide/messages";

export function NavPrimary() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={
            <Link
              to="/app"
              activeOptions={{ exact: true, includeSearch: false }}
              activeProps={{ className: "bg-background text-primary" }}
            >
              <HouseIcon />
              {m.home()}
            </Link>
          }
        />
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={
            <Link to="/app/projects" activeProps={{ className: "bg-background text-primary" }}>
              <FoldersIcon />
              {m.projects()}
            </Link>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
