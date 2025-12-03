import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Zap,
  Globe,
  Palette,
  Code,
  Rocket,
  Shield,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">WPF</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-sm font-medium hover:text-primary"
            >
              Sign In
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Zap className="w-4 h-4" />
          AI-Powered WordPress Sites
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Build Professional WordPress
          <br />
          <span className="text-primary">Sites in Minutes</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Answer a few questions about your business and let AI generate a
          complete, production-ready WordPress website with custom theme,
          content, and SEO optimization.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="gap-2">
              Start Building <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>

        {/* Preview Image Placeholder */}
        <div className="mt-16 rounded-xl border bg-white shadow-2xl overflow-hidden">
          <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-500">
              wpf.dev/preview
            </div>
          </div>
          <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-16 h-16 text-primary mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                Your WordPress Site Preview
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Launch
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border bg-white">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Custom Design</h3>
            <p className="text-muted-foreground">
              AI generates a unique theme based on your industry and brand
              colors with Tailwind CSS.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-white">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Production Code</h3>
            <p className="text-muted-foreground">
              Clean, optimized WordPress theme following best practices and
              coding standards.
            </p>
          </div>
          <div className="p-6 rounded-xl border bg-white">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">One-Click Deploy</h3>
            <p className="text-muted-foreground">
              Deploy to staging or production with a single click. Supports
              multiple hosting providers.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Built for Every Industry
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Pre-configured templates and content for 12+ industries. Just select
            your business type and get started.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Restaurant",
              "Healthcare",
              "Legal",
              "Real Estate",
              "Fitness",
              "Education",
              "Technology",
              "Retail",
              "Construction",
              "Automotive",
              "Beauty & Spa",
              "General Business",
            ].map((industry) => (
              <div
                key={industry}
                className="px-4 py-2 bg-white rounded-full border text-sm font-medium"
              >
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <div className="p-8 rounded-xl border bg-white">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-muted-foreground mb-4">Perfect for trying out</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>3 projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Basic templates</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Community support</span>
              </li>
            </ul>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="p-8 rounded-xl border-2 border-primary bg-white relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
              Popular
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-muted-foreground mb-4">For growing businesses</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$29</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>AI content generation</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Custom domains</span>
              </li>
            </ul>
            <Link href="/sign-up">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-xl border bg-white">
            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
            <p className="text-muted-foreground mb-4">For agencies & teams</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Everything in Pro</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>White-label option</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Dedicated support</span>
              </li>
            </ul>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">WPF</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} WordPress Site Factory. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
