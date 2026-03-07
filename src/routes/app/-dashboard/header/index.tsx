import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadCrumb } from "./breadcrumb";

export function Header() {
  return (
    <header className="flex items-center gap-4">
      <SidebarTrigger />
      <BreadCrumb />
    </header>
  );
}
