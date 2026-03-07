import { HouseIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { m } from "@/paraglide/messages";

export function NavPrimary() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={
            <Link to="/app" activeProps={{ className: "bg-background" }}>
              <HouseIcon />
              {m.home()}
            </Link>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
