import { ReactNode } from "react";
import { Navigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useAppStore } from "@/lib/store";
import { Toaster } from "@/components/ui/sonner";

export function AppLayout({ children, title }: { children: ReactNode; title: string }) {
  const authenticated = useAppStore((s) => s.authenticated);

  if (!authenticated) {
    return <Navigate to="/" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <div className="flex h-1 w-full">
            <div className="flex-1 bg-[var(--pe-blue)]" />
            <div className="flex-1 bg-[var(--pe-white)] border-y border-border" />
            <div className="flex-1 bg-[var(--pe-red)]" />
            <div className="flex-1 bg-[var(--pe-yellow)]" />
            <div className="flex-1 bg-[var(--pe-green)]" />
          </div>
          <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="h-5 w-px bg-border" />
            <h1 className="text-sm font-semibold tracking-tight text-foreground">{title}</h1>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:inline">
                Ambiente: <span className="font-medium text-foreground">Homologação</span>
              </span>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
                Online
              </span>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
        <Toaster richColors position="top-right" />
      </div>
    </SidebarProvider>
  );
}
