"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/generate-plan/ProfileForm";
import { SavedProfileCard } from "@/components/generate-plan/SavedProfileCard";
import { PlanResult } from "@/components/generate-plan/PlanResult";

export default function GeneratePlanPage() {
  const initialFormData: UserData = {
    name: "",
    age: 0,
    gender: "male",
    height: 0,
    weight: 0,
    goal: "weight_loss",
    fitnessLevel: "beginner",
    workoutLocation: "gym",
    dietaryPreferences: "non_veg",
    medicalHistory: "",
    stressLevel: "medium",
  };
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserData>(initialFormData);
  const [plan, setPlan] = useState<FitnessPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const totalSteps = 4;

  useEffect(() => {
    const savedData = localStorage.getItem("fitnessUserData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else {
      setShowForm(true);
    }
  }, []);

  const saveToLocalStorage = () => {
    localStorage.setItem("fitnessUserData", JSON.stringify(formData));
  };

  const handleInputChange = (field: keyof UserData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : prev));
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const generatePlan = async () => {
    setLoading(true);
    setError("");
    saveToLocalStorage();

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: formData.age,
          height: formData.height,
          weight: formData.weight,
        }),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setPlan(result.data);
      setShowForm(false);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while generating your plan.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => router.push("/");

  if (!showForm && !plan) {
    return (
      <SavedProfileCard
        formData={formData}
        loading={loading}
        onEditProfile={() => {
          setShowForm(true);
          setCurrentStep(1);
        }}
        onGeneratePlan={generatePlan}
        onGoHome={handleGoHome}
      />
    );
  }

  if (showForm) {
    return (
      <ProfileForm
        currentStep={currentStep}
        totalSteps={totalSteps}
        formData={formData}
        loading={loading}
        error={error}
        onChange={handleInputChange}
        onNext={nextStep}
        onPrev={prevStep}
        onGenerate={generatePlan}
        onGoHome={handleGoHome}
      />
    );
  }

  if (plan) {
    return (
      <PlanResult
        plan={plan}
        onResetPlan={() => setPlan(null)}
        onGoHome={handleGoHome}
      />
    );
  }

  return null;
}
