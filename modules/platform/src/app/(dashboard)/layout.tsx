import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Globe, LayoutDashboard, FolderOpen, Settings } from "lucide-react";

// Force dynamic rendering to avoid Clerk errors during build
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r">
        <div className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">WPF</span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/projects"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <FolderOpen className="w-4 h-4" />
            Projects
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <header className="h-16 border-b flex items-center justify-end px-6">
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
