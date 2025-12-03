"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Palette, Building2, Mail, Rocket } from "lucide-react";
import Link from "next/link";

const industries = [
  { id: "restaurant", name: "Restaurant", icon: "🍽️" },
  { id: "healthcare", name: "Healthcare", icon: "🏥" },
  { id: "legal", name: "Legal", icon: "⚖️" },
  { id: "realestate", name: "Real Estate", icon: "🏠" },
  { id: "fitness", name: "Fitness", icon: "💪" },
  { id: "education", name: "Education", icon: "📚" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "retail", name: "Retail", icon: "🛍️" },
  { id: "construction", name: "Construction", icon: "🏗️" },
  { id: "automotive", name: "Automotive", icon: "🚗" },
  { id: "beauty", name: "Beauty & Spa", icon: "💅" },
  { id: "other", name: "Other", icon: "📦" },
];

const colorPresets = [
  { name: "Green", primary: "#16a34a", secondary: "#0f766e" },
  { name: "Blue", primary: "#2563eb", secondary: "#1d4ed8" },
  { name: "Purple", primary: "#7c3aed", secondary: "#6d28d9" },
  { name: "Red", primary: "#dc2626", secondary: "#b91c1c" },
  { name: "Orange", primary: "#ea580c", secondary: "#c2410c" },
  { name: "Teal", primary: "#0d9488", secondary: "#0f766e" },
];

type Step = "company" | "industry" | "design" | "contact" | "review";

const steps: { id: Step; title: string; icon: React.ReactNode }[] = [
  { id: "company", title: "Company", icon: <Building2 className="h-4 w-4" /> },
  { id: "industry", title: "Industry", icon: <Badge className="h-4 w-4" /> },
  { id: "design", title: "Design", icon: <Palette className="h-4 w-4" /> },
  { id: "contact", title: "Contact", icon: <Mail className="h-4 w-4" /> },
  { id: "review", title: "Review", icon: <Rocket className="h-4 w-4" /> },
];

export default function NewProjectPage() {
  const [currentStep, setCurrentStep] = useState<Step>("company");
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    industry: "",
    primaryColor: "#16a34a",
    secondaryColor: "#0f766e",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const prevStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const handleSubmit = async () => {
    // TODO: Submit to API
    console.log("Creating project:", formData);
    alert("Project creation coming soon!");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground">
            Set up your WordPress site in minutes
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                index <= currentStepIndex
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30"
              }`}
            >
              {index < currentStepIndex ? (
                <Check className="h-5 w-5" />
              ) : (
                step.icon
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 ${
                  index < currentStepIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStepIndex].title}</CardTitle>
          <CardDescription>
            {currentStep === "company" && "Enter your company information"}
            {currentStep === "industry" && "Select your business industry"}
            {currentStep === "design" && "Choose your brand colors"}
            {currentStep === "contact" && "Add your contact details"}
            {currentStep === "review" && "Review and create your project"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === "company" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="my-company-site"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Used for the project URL (lowercase, no spaces)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="My Company Inc."
                  value={formData.companyName}
                  onChange={(e) => updateFormData("companyName", e.target.value)}
                />
              </div>
            </>
          )}

          {currentStep === "industry" && (
            <div className="grid grid-cols-3 gap-3">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => updateFormData("industry", industry.id)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors hover:border-primary ${
                    formData.industry === industry.id
                      ? "border-primary bg-primary/5"
                      : ""
                  }`}
                >
                  <span className="text-2xl">{industry.icon}</span>
                  <span className="text-sm font-medium">{industry.name}</span>
                </button>
              ))}
            </div>
          )}

          {currentStep === "design" && (
            <>
              <div className="space-y-3">
                <Label>Color Presets</Label>
                <div className="grid grid-cols-3 gap-3">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        updateFormData("primaryColor", preset.primary);
                        updateFormData("secondaryColor", preset.secondary);
                      }}
                      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-primary ${
                        formData.primaryColor === preset.primary
                          ? "border-primary bg-primary/5"
                          : ""
                      }`}
                    >
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span className="text-sm font-medium">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => updateFormData("primaryColor", e.target.value)}
                      className="h-10 w-14 p-1"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => updateFormData("primaryColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => updateFormData("secondaryColor", e.target.value)}
                      className="h-10 w-14 p-1"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => updateFormData("secondaryColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === "contact" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main Street"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="São Paulo"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="SP"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === "review" && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">Project Details</h3>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Project Name:</dt>
                    <dd>{formData.name || "Not set"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Company:</dt>
                    <dd>{formData.companyName || "Not set"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Industry:</dt>
                    <dd className="capitalize">{formData.industry || "Not set"}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">Brand Colors</h3>
                <div className="mt-2 flex gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{ backgroundColor: formData.primaryColor }}
                    />
                    <span className="text-sm">{formData.primaryColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-full border"
                      style={{ backgroundColor: formData.secondaryColor }}
                    />
                    <span className="text-sm">{formData.secondaryColor}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <h3 className="font-semibold">Contact Information</h3>
                <dl className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Email:</dt>
                    <dd>{formData.email || "Not set"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Phone:</dt>
                    <dd>{formData.phone || "Not set"}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Location:</dt>
                    <dd>
                      {formData.city && formData.state
                        ? `${formData.city}, ${formData.state}`
                        : "Not set"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStepIndex === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {currentStep === "review" ? (
          <Button onClick={handleSubmit}>
            <Rocket className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        ) : (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
