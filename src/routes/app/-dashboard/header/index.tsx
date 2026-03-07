import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadCrumb } from "./breadcrumb";

export function Header() {
  return (
    <header className="flex items-center">
      <SidebarTrigger />
      <BreadCrumb />
    </header>
  );
}
