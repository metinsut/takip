import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadCrumb } from "./breadcrumb";

export function Header() {
  return (
    <header className="flex items-center pt-3 px-3">
      <SidebarTrigger />
      <BreadCrumb />
    </header>
  );
}
