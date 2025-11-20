'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Loader2 } from 'lucide-react';

interface SavedProfileCardProps {
  formData: UserData;
  loading: boolean;
  onEditProfile: () => void;
  onGeneratePlan: () => void;
  onGoHome: () => void;
}

export function SavedProfileCard({
  formData,
  loading,
  onEditProfile,
  onGeneratePlan,
  onGoHome,
}: SavedProfileCardProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome Back!</CardTitle>
          <CardDescription>We found your saved profile</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Goal</span>
              <span className="font-medium capitalize">{formData.goal.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Level</span>
              <span className="font-medium capitalize">{formData.fitnessLevel}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={onEditProfile}
              variant="outline"
              className="flex-1"
            >
              Edit Profile
            </Button>
            <Button
              onClick={onGeneratePlan}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Generating...
                </>
              ) : (
                'Generate Plan'
              )}
            </Button>
          </div>

          <Button
            onClick={onGoHome}
            variant="ghost"
            className="w-full"
          >
            <Home className="mr-2" size={16} /> Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
