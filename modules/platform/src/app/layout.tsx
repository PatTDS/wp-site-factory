import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// Force dynamic rendering to avoid Clerk errors during build
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WPF - WordPress Site Factory",
  description: "Create professional WordPress websites in minutes with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
