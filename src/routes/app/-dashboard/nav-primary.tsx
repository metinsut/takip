import { HouseIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { m } from "@/paraglide/messages";

export function NavPrimary() {
  const pages = [
    {
      title: m.home(),
      url: "/app/home",
      icon: HouseIcon,
    },
  ];

  return (
    <SidebarMenu>
      {pages.map((page) => (
        <SidebarMenuItem key={page.url}>
          <SidebarMenuButton
            render={
              <Link to={page.url} activeProps={{ className: "bg-background" }}>
                <page.icon />
                {page.title}
              </Link>
            }
          />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
