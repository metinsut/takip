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
                <img src="/mailer2.png" alt="Side Project 2026" className="h-10 object-contain" />
              </Link>
            }
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
