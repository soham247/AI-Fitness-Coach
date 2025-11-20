'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell } from 'lucide-react';

interface WorkoutPlanProps {
  workout: WorkoutExercise[];
  onExerciseClick: (prompt: string) => void;
}

export function WorkoutPlan({ workout, onExerciseClick }: WorkoutPlanProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Dumbbell className="mr-3" size={28} />
          Workout Plan
        </CardTitle>
        <CardDescription>Click any exercise to view demonstration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {workout.map((exercise, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => onExerciseClick(exercise.image_prompt)}
            >
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold">{exercise.exercise_name}</h3>
                  {exercise.day && <Badge variant="secondary">{exercise.day}</Badge>}
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded bg-muted p-2 text-center">
                    <p className="text-xs text-muted-foreground">Sets</p>
                    <p className="font-semibold">{exercise.sets}</p>
                  </div>
                  <div className="rounded bg-muted p-2 text-center">
                    <p className="text-xs text-muted-foreground">Reps</p>
                    <p className="font-semibold">{exercise.reps}</p>
                  </div>
                  <div className="rounded bg-muted p-2 text-center">
                    <p className="text-xs text-muted-foreground">Rest</p>
                    <p className="font-semibold">{exercise.rest}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">{exercise.instructions}</p>
                <Badge variant="outline" className="text-xs">
                  Click for image
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
