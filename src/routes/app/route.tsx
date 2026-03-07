import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authMiddleware } from "@/functions/auth/auth-middleware";
import { AppSidebar } from "@/routes/app/-dashboard/app-sidebar";
import { Header } from "./-dashboard/header";

export const Route = createFileRoute("/app")({
  component: AppComponent,
  server: {
    middleware: [authMiddleware],
  },
});

function AppComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col p-3">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
