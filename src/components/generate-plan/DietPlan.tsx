'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Utensils } from 'lucide-react';

interface DietPlanProps {
  diet: DietMeal[];
  onMealClick: (prompt: string) => void;
}

export function DietPlan({ diet, onMealClick }: DietPlanProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <Utensils className="mr-3" size={28} />
          Diet Plan
        </CardTitle>
        <CardDescription>Click any meal to see what it looks like</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {diet.map((meal, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => onMealClick(meal.image_prompt)}
            >
              <CardContent className="space-y-3 pt-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold">{meal.meal_name}</h3>
                  <Badge variant="secondary" className="capitalize">
                    {meal.meal_type}
                  </Badge>
                </div>

                <p className="text-sm font-semibold">{meal.calories}</p>

                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded bg-muted p-2 text-center text-xs">
                    <p className="text-muted-foreground">Protein</p>
                    <p className="font-semibold">{meal.macros.protein}</p>
                  </div>
                  <div className="rounded bg-muted p-2 text-center text-xs">
                    <p className="text-muted-foreground">Carbs</p>
                    <p className="font-semibold">{meal.macros.carbs}</p>
                  </div>
                  <div className="rounded bg-muted p-2 text-center text-xs">
                    <p className="text-muted-foreground">Fats</p>
                    <p className="font-semibold">{meal.macros.fats}</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <span className="font-semibold">Ingredients:</span> {meal.ingredients.join(', ')}
                </div>

                {meal.preparation_time && (
                  <p className="text-xs text-muted-foreground">⏱️ {meal.preparation_time}</p>
                )}

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
