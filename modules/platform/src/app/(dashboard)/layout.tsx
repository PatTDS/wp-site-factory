import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-6">
          <SidebarTrigger />
          <div className="flex-1" />
          <UserButton afterSignOutUrl="/" />
        </header>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
