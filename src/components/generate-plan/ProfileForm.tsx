'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Heart,
  Home,
  Loader2,
  Target,
  User,
  Utensils,
} from 'lucide-react';

interface ProfileFormProps {
  currentStep: number;
  totalSteps: number;
  formData: UserData;
  loading: boolean;
  error: string;
  onChange: (field: keyof UserData, value: string | number) => void;
  onNext: () => void;
  onPrev: () => void;
  onGenerate: () => void;
  onGoHome: () => void;
}

export function ProfileForm({
  currentStep,
  totalSteps,
  formData,
  loading,
  error,
  onChange,
  onNext,
  onPrev,
  onGenerate,
  onGoHome,
}: ProfileFormProps) {
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.age && formData.gender;
      case 2:
        return formData.height && formData.weight;
      case 3:
        return formData.goal && formData.fitnessLevel;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          onClick={onGoHome}
          variant="ghost"
          className="mb-2 w-fit"
        >
          <Home className="mr-2" size={16} /> Home
        </Button>

        <Card>
          <CardHeader className="space-y-2 pb-4">
            <CardTitle className="text-2xl">Create Your Fitness Profile</CardTitle>
            <CardDescription>
              Step {currentStep} of {totalSteps}
            </CardDescription>
            <Progress value={progress} className="mt-3" />

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
              {[
                { step: 1, label: 'Personal', icon: User },
                { step: 2, label: 'Stats', icon: Heart },
                { step: 3, label: 'Goals', icon: Target },
                { step: 4, label: 'Diet & Review', icon: Utensils },
              ].map(({ step, label, icon: Icon }) => (
                <div
                  key={step}
                  className={`flex items-center gap-2 rounded-md border px-2 py-1.5 ${
                    currentStep === step
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold">
                    {step}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Icon size={14} />
                    <span>{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="pt-2 space-y-6">
            {currentStep === 1 && <Step1 formData={formData} onChange={onChange} />}
            {currentStep === 2 && <Step2 formData={formData} onChange={onChange} />}
            {currentStep === 3 && <Step3 formData={formData} onChange={onChange} />}
            {currentStep === 4 && <Step4 formData={formData} onChange={onChange} />}

            {error && (
              <div className="mt-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="mt-2 flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-between">
              {currentStep > 1 && (
                <Button
                  onClick={onPrev}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <ChevronLeft className="mr-2" size={18} /> Previous
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button
                  onClick={onNext}
                  disabled={!isStepValid()}
                  className="w-full sm:w-auto"
                >
                  Next <ChevronRight className="ml-2" size={18} />
                </Button>
              ) : (
                <Button
                  onClick={onGenerate}
                  disabled={loading || !isStepValid()}
                  className="w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Activity className="mr-2" size={18} />
                      Generate My Plan
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Step1({ formData, onChange }: { formData: UserData; onChange: (field: keyof UserData, value: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="text-primary" size={24} />
        <h3 className="text-lg font-semibold">Personal Information</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => onChange('age', e.target.value)}
            placeholder="25"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(val) => onChange('gender', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

function Step2({ formData, onChange }: { formData: UserData; onChange: (field: keyof UserData, value: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Heart className="text-primary" size={24} />
        <h3 className="text-lg font-semibold">Physical Stats</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm) *</Label>
          <Input
            id="height"
            type="number"
            value={formData.height}
            onChange={(e) => onChange('height', e.target.value)}
            placeholder="170"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight}
            onChange={(e) => onChange('weight', e.target.value)}
            placeholder="70"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="stressLevel">Stress Level</Label>
        <Select value={formData.stressLevel} onValueChange={(val) => onChange('stressLevel', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function Step3({ formData, onChange }: { 
  formData: UserData; 
  onChange: (field: keyof UserData, value: string) => void;
}) {
  const goalDescriptions = {
    weight_loss: "Burn fat and decrease body weight through calorie deficit",
    muscle_gain: "Build muscle mass and increase strength with surplus calories",
    maintenance: "Maintain current weight while improving fitness",
    endurance: "Improve cardiovascular fitness and stamina",
    body_recomposition: "Lose fat while building muscle simultaneously"
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Target className="text-primary" size={24} />
          <h3 className="text-lg font-semibold">Fitness Goals</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Primary Goal *</Label>
          <Select value={formData.goal} onValueChange={(val) => onChange('goal', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight_loss">Weight Loss</SelectItem>
              <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="endurance">Endurance</SelectItem>
              <SelectItem value="body_recomposition">Body Recomposition</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fitnessLevel">Fitness Level *</Label>
          <Select value={formData.fitnessLevel} onValueChange={(val) => onChange('fitnessLevel', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner - New to fitness</SelectItem>
              <SelectItem value="intermediate">Intermediate - 6+ months experience</SelectItem>
              <SelectItem value="advanced">Advanced - 2+ years experience</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="workoutLocation">Workout Location</Label>
          <Select value={formData.workoutLocation} onValueChange={(val) => onChange('workoutLocation', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Where will you train?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gym">Gym - Full equipment access</SelectItem>
              <SelectItem value="home">Home - Minimal equipment</SelectItem>
              <SelectItem value="outdoor">Outdoor - Bodyweight focused</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {formData.goal && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h4 className="font-semibold mb-2">Your Goal</h4>
            <p className="text-sm text-muted-foreground">
              {goalDescriptions[formData.goal as keyof typeof goalDescriptions]}
            </p>
          </div>
        )}
        
        <div className="bg-muted/50 rounded-lg p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Dumbbell size={18} />
            What to Expect
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span>•</span>
              <span>Your goal determines workout intensity and calorie targets</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Fitness level adjusts exercise complexity and volume</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Location tailors exercises to available equipment</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Step4({ formData, onChange }: { formData: UserData; onChange: (field: keyof UserData, value: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Utensils className="text-primary" size={24} />
        <h3 className="text-lg font-semibold">Diet &amp; Health</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="dietaryPreferences">Dietary Preference</Label>
        <Select value={formData.dietaryPreferences} onValueChange={(val) => onChange('dietaryPreferences', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="veg">Vegetarian</SelectItem>
            <SelectItem value="non_veg">Non-Vegetarian</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="keto">Keto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="medicalHistory">Medical History (Optional)</Label>
        <Input
          id="medicalHistory"
          value={formData.medicalHistory}
          onChange={(e) => onChange('medicalHistory', e.target.value)}
          placeholder="Any injuries, conditions, or medications..."
        />
      </div>

      <div className="rounded-lg bg-background p-4">
        <h4 className="mb-2 font-semibold">Review Your Profile</h4>
        <div className="space-y-1 text-sm">
          <p>
            <strong>Name:</strong> {formData.name}
          </p>
          <p>
            <strong>Age:</strong> {formData.age}
          </p>
          <p>
            <strong>Goal:</strong> {formData.goal.replace('_', ' ')}
          </p>
          <p>
            <strong>Level:</strong> {formData.fitnessLevel}
          </p>
        </div>
      </div>
    </div>
  );
}
