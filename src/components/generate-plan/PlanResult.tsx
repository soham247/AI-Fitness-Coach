'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, Home, Loader2, RefreshCw, Volume2 } from 'lucide-react';
import { WorkoutPlan } from './WorkoutPlan';
import { DietPlan } from './DietPlan';

interface PlanResultProps {
  plan: FitnessPlan;
  onResetPlan: () => void;
  onGoHome: () => void;
}

export function PlanResult({ plan, onResetPlan, onGoHome }: PlanResultProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [ttsLoading, setTtsLoading] = useState(false);
  const [ttsError, setTtsError] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsTarget, setTtsTarget] = useState<'workout' | 'diet'>('workout');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioCache, setAudioCache] = useState<{ workout?: string; diet?: string }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const generateImage = async (prompt: string) => {
    setIsImageDialogOpen(true);
    setSelectedImage(null);
    setLoadingImage(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const result = await response.json();
      if (result.success) setSelectedImage(result.imageUrl);
    } catch (err) {
      console.error('Image generation failed:', err);
    } finally {
      setLoadingImage(false);
    }
  };

  const buildWorkoutNarration = (plan: FitnessPlan) => {
    const lines = plan.workout.map((exercise, index) =>
      `Exercise ${index + 1}: ${exercise.exercise_name}, ${exercise.sets} sets of ${exercise.reps} reps with ${exercise.rest} rest.`,
    );
    return `Here is your workout plan. ${lines.join(' ')}`;
  };

  const buildDietNarration = (plan: FitnessPlan) => {
    const lines = plan.diet.map((meal) =>
      `${meal.meal_type} - ${meal.meal_name}, ${meal.calories}, with macros: protein ${meal.macros.protein}, carbs ${meal.macros.carbs}, and fats ${meal.macros.fats}.`,
    );
    return `Here is your diet plan. ${lines.join(' ')}`;
  };

  const handleReadPlan = async () => {
    const cached = audioCache[ttsTarget];
    if (cached) {
      setAudioUrl(cached);
      return;
    }

    try {
      setTtsLoading(true);
      setTtsError('');
      setIsPlaying(false);

      const text =
        ttsTarget === 'workout' ? buildWorkoutNarration(plan) : buildDietNarration(plan);

      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.audioUrl) {
        throw new Error(data.error || 'Failed to generate speech');
      }

      setAudioCache((prev) => ({ ...prev, [ttsTarget]: data.audioUrl }));
      setAudioUrl(data.audioUrl);
    } catch (error) {
      console.error('Error generating speech:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate speech';
      setTtsError(message);
      setIsPlaying(false);
    } finally {
      setTtsLoading(false);
    }
  };

  const handleStopReading = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
  };

  // Auto-play whenever audioUrl changes (after DOM has committed)
  useEffect(() => {
    if (!audioUrl) return;
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        setIsPlaying(false);
      });
  }, [audioUrl]);

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
          <Button onClick={onGoHome} variant="ghost">
            <Home className="mr-2" size={16} /> Home
          </Button>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button onClick={() => window.print()} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="mr-2" size={16} /> Export
            </Button>
            <Button onClick={onResetPlan} variant="outline" size="sm" className="flex-1 sm:flex-none">
              <RefreshCw className="mr-2" size={16} /> New
            </Button>
          </div>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent>
            <p className="text-center text-lg font-semibold">{plan.motivation}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  <Volume2 size={16} /> Hear your plan
                </p>
                <p className="text-xs text-muted-foreground">Choose which part of the plan you want to listen to.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select value={ttsTarget} onValueChange={(val: 'workout' | 'diet') => setTtsTarget(val)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workout">Workout plan</SelectItem>
                    <SelectItem value="diet">Diet plan</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={isPlaying ? handleStopReading : handleReadPlan}
                  disabled={ttsLoading}
                  className="w-full sm:w-auto"
                >
                  {ttsLoading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={16} />
                      Generating audio...
                    </>
                  ) : isPlaying ? (
                    <>
                      <Volume2 className="mr-2" size={16} />
                      Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2" size={16} />
                      Read plan
                    </>
                  )}
                </Button>
              </div>
            </div>

            <audio
              ref={audioRef}
              src={audioUrl ?? undefined}
              className="hidden"
              onEnded={() => setIsPlaying(false)}
            />

            {ttsError && <p className="text-xs text-destructive">{ttsError}</p>}
          </CardContent>
        </Card>

        <Tabs defaultValue="workout" className="space-y-4">
          <TabsList className="grid w-full max-w-xs grid-cols-2">
            <TabsTrigger value="workout">Workout</TabsTrigger>
            <TabsTrigger value="diet">Diet</TabsTrigger>
          </TabsList>
          <TabsContent value="workout">
            <WorkoutPlan workout={plan.workout} onExerciseClick={generateImage} />
          </TabsContent>
          <TabsContent value="diet">
            <DietPlan diet={plan.diet} onMealClick={generateImage} />
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plan.tips.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 mt-0.5">✓</span>
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isImageDialogOpen}
        onOpenChange={(open) => {
          setIsImageDialogOpen(open);
          if (!open) {
            setSelectedImage(null);
            setLoadingImage(false);
          }
        }}
      >
        <DialogContent className="max-w-[560px]">
          <DialogTitle className="sr-only">Generated preview</DialogTitle>
          <div className="mx-auto flex h-[512px] w-lg max-w-full items-center justify-center">
            {loadingImage || !selectedImage ? (
              <Skeleton className="h-[512px] w-lg max-w-full rounded-lg" />
            ) : (
              <img
                src={selectedImage}
                alt="Generated"
                width={512}
                height={512}
                className="h-[512px] w-lg rounded-lg object-cover"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
