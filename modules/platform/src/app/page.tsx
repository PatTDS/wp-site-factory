import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Zap, Shield, Palette } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const { userId } = await auth();

  // If user is signed in, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">WPF Platform</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <Badge variant="secondary" className="mb-4">
            Beta Launch
          </Badge>
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Create WordPress Sites
            <br />
            <span className="text-primary">In Minutes, Not Days</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            WPF Platform uses AI to generate professional WordPress websites
            tailored to your business. Just answer a few questions and watch
            your site come to life.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/sign-up">
                <Rocket className="mr-2 h-5 w-5" />
                Start Free
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-t bg-gray-50 py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Everything You Need
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-white p-6">
                <Zap className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Our AI understands your business and generates a complete
                  WordPress site with content, design, and SEO optimization.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6">
                <Palette className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">Industry Templates</h3>
                <p className="text-muted-foreground">
                  Choose from 12+ industry-specific templates with pre-designed
                  components and optimized layouts.
                </p>
              </div>
              <div className="rounded-lg border bg-white p-6">
                <Shield className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-xl font-semibold">One-Click Deploy</h3>
                <p className="text-muted-foreground">
                  Deploy your site instantly to Railway, Render, or your own
                  server with automated SSL and CDN.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Simple Pricing
            </h2>
            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-semibold">Free</h3>
                <p className="mt-2 text-3xl font-bold">$0</p>
                <p className="text-muted-foreground">/month</p>
                <ul className="mt-6 space-y-2 text-sm">
                  <li>3 Projects</li>
                  <li>Basic Components</li>
                  <li>Community Support</li>
                </ul>
                <Button className="mt-6 w-full" variant="outline" asChild>
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </div>
              <div className="rounded-lg border-2 border-primary p-6">
                <Badge className="mb-2">Popular</Badge>
                <h3 className="text-xl font-semibold">Pro</h3>
                <p className="mt-2 text-3xl font-bold">$29</p>
                <p className="text-muted-foreground">/month</p>
                <ul className="mt-6 space-y-2 text-sm">
                  <li>10 Projects</li>
                  <li>All Components</li>
                  <li>Priority Support</li>
                  <li>Custom Domains</li>
                </ul>
                <Button className="mt-6 w-full" asChild>
                  <Link href="/sign-up">Start Free Trial</Link>
                </Button>
              </div>
              <div className="rounded-lg border p-6">
                <h3 className="text-xl font-semibold">Team</h3>
                <p className="mt-2 text-3xl font-bold">$79</p>
                <p className="text-muted-foreground">/month</p>
                <ul className="mt-6 space-y-2 text-sm">
                  <li>Unlimited Projects</li>
                  <li>Team Collaboration</li>
                  <li>White Label</li>
                  <li>API Access</li>
                </ul>
                <Button className="mt-6 w-full" variant="outline" asChild>
                  <Link href="/sign-up">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>WPF Platform v0.2.0-beta</p>
          <p className="mt-2">
            Built with Next.js, Tailwind CSS, and Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}
