"use client";

import { BellIcon, CaretDownIcon, CreditCardIcon, StarIcon, UserIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetUser } from "@/functions/auth/get-user";
import { m } from "@/paraglide/messages";
import { Logout } from "./logout";

export function NavFooter() {
  const { isMobile } = useSidebar();

  const { data: user } = useSuspenseQuery(useGetUser());

  const avatar = user?.image || undefined;
  const name = user?.name ? user.name : "Guest";
  const email = user?.email ? user.email : "guest@example.com";

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton>
                  <Avatar>
                    <AvatarImage src={avatar} alt={user?.name} />
                    <AvatarFallback>
                      <UserIcon />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs">{email}</span>
                  </div>
                  <CaretDownIcon />
                </SidebarMenuButton>
              }
            />
            <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="end" sideOffset={4}>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs">{email}</span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <StarIcon />
                  {m.upgradeToPro()}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon />
                  {m.account()}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon />
                  {m.billing()}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon />
                  {m.notifications()}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Logout />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
