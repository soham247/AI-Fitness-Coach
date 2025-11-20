interface WorkoutExercise {
  exercise_name: string;
  reps: string;
  sets: string;
  rest: string;
  image_prompt: string;
  instructions: string;
  day?: string;
}

interface DietMeal {
  meal_name: string;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: string;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  ingredients: string[];
  image_prompt: string;
  preparation_time?: string;
}

interface FitnessPlan {
  workout: WorkoutExercise[];
  diet: DietMeal[];
  motivation: string;
  tips: string[];
  weekly_schedule?: Record<string, string>;
}

interface UserData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  fitnessLevel: string;
  workoutLocation: string;
  dietaryPreferences: string;
  medicalHistory?: string;
  stressLevel?: string;
}