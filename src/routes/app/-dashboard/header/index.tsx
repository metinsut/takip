import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadCrumb } from "./breadcrumb";
import { SelectProject } from "./select-project";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <BreadCrumb />
      </div>
      <SelectProject />
    </header>
  );
}
