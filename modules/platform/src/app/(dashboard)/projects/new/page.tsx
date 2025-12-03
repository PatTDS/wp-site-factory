"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

const INDUSTRIES = [
  { value: "restaurant", label: "Restaurant" },
  { value: "healthcare", label: "Healthcare" },
  { value: "legal", label: "Legal" },
  { value: "realestate", label: "Real Estate" },
  { value: "fitness", label: "Fitness" },
  { value: "education", label: "Education" },
  { value: "technology", label: "Technology" },
  { value: "retail", label: "Retail" },
  { value: "construction", label: "Construction" },
  { value: "automotive", label: "Automotive" },
  { value: "beauty", label: "Beauty & Spa" },
  { value: "other", label: "General Business" },
];

const STEPS = [
  { id: 1, name: "Company" },
  { id: 2, name: "Industry" },
  { id: 3, name: "Design" },
  { id: 4, name: "Contact" },
  { id: 5, name: "Review" },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/projects/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create project");

      const result = await response.json();
      router.push(`/dashboard?created=${result.projectId}`);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="my-awesome-site"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <p className="text-sm text-muted-foreground mt-1">
                This will be used as the project identifier
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateFormData("companyName", e.target.value)}
                placeholder="My Awesome Company"
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Select your industry to get tailored templates and content.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry.value}
                  onClick={() => updateFormData("industry", industry.value)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    formData.industry === industry.value
                      ? "border-primary bg-primary/5"
                      : "hover:border-gray-300"
                  }`}
                >
                  <span className="font-medium">{industry.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    updateFormData("primaryColor", e.target.value)
                  }
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) =>
                    updateFormData("primaryColor", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    updateFormData("secondaryColor", e.target.value)
                  }
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) =>
                    updateFormData("secondaryColor", e.target.value)
                  }
                  className="flex-1 px-4 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <p className="text-sm text-muted-foreground mb-2">Preview</p>
              <div className="flex gap-4">
                <div
                  className="w-20 h-20 rounded-lg"
                  style={{ backgroundColor: formData.primaryColor }}
                />
                <div
                  className="w-20 h-20 rounded-lg"
                  style={{ backgroundColor: formData.secondaryColor }}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Add contact information for your website (optional).
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                  placeholder="San Francisco"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateFormData("state", e.target.value)}
                  placeholder="CA"
                  className="w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <p className="text-muted-foreground">
              Review your project details before creating.
            </p>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Company</h3>
                <p>
                  {formData.companyName || "Not specified"} ({formData.name})
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Industry</h3>
                <p>
                  {INDUSTRIES.find((i) => i.value === formData.industry)
                    ?.label || "Not selected"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-medium mb-2">Colors</h3>
                <div className="flex gap-2">
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: formData.primaryColor }}
                  />
                  <div
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: formData.secondaryColor }}
                  />
                </div>
              </div>
              {formData.email && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-2">Contact</h3>
                  <p>{formData.email}</p>
                  {formData.phone && <p>{formData.phone}</p>}
                  {formData.address && (
                    <p>
                      {formData.address}, {formData.city}, {formData.state}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-muted-foreground">
          Set up your WordPress site in a few simple steps.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep > step.id
                    ? "bg-primary text-white"
                    : currentStep === step.id
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step.id ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {STEPS.map((step) => (
            <span
              key={step.id}
              className={`text-xs ${
                currentStep === step.id
                  ? "text-primary font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step.name}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 rounded-xl border bg-white mb-8">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        {currentStep < 5 ? (
          <Button onClick={nextStep} className="gap-2">
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Project
                <Check className="w-4 h-4" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
