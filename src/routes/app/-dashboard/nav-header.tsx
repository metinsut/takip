import { Link } from "@tanstack/react-router";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            render={
              <Link to="/app">
                <img src="/takip.png" alt="Takip" className="h-10 object-contain" />
              </Link>
            }
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
