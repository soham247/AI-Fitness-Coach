import client from "@/lib/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const userData: UserData = await request.json();

    // Validate required fields
    if (
      !userData.name ||
      !userData.age ||
      !userData.goal ||
      !userData.fitnessLevel
    ) {
      return NextResponse.json(
        { error: "Missing required fields: name, age, goal, fitnessLevel" },
        { status: 400 }
      );
    }

    // Construct the system prompt
    const SYSTEM_PROMPT = `You are a professional fitness trainer and nutritionist with 15+ years of experience.

      Create a comprehensive, personalized workout and diet plan for the following user:

      USER DETAILS:
      - Name: ${userData.name}
      - Age: ${userData.age} years old
      - Gender: ${userData.gender}
      - Height: ${userData.height} cm
      - Weight: ${userData.weight} kg
      - Primary Goal: ${userData.goal}
      - Fitness Level: ${userData.fitnessLevel}
      - Workout Location: ${userData.workoutLocation}
      - Dietary Preference: ${userData.dietaryPreferences}
      ${
        userData.medicalHistory ? `- Medical History: ${userData.medicalHistory}` : ""
      }
      ${userData.stressLevel ? `- Stress Level: ${userData.stressLevel}` : ""}

      CRITICAL INSTRUCTIONS:
      1. You MUST respond with ONLY valid JSON - no markdown code blocks, no explanations, no text outside the JSON object
      2. Create 5-7 exercises for the workout plan appropriate for their fitness level and location
      3. Create 4 meals (breakfast, lunch, dinner, snack) that match their dietary preferences
      4. Ensure calorie counts align with their goal (deficit for weight loss, surplus for muscle gain)
      5. Image prompts should be detailed and realistic

      Return ONLY this JSON structure:
      {
        "workout": [
          {
            "exercise_name": "string",
            "reps": "string (e.g., '12 reps' or '30 seconds')",
            "sets": "string (e.g., '3 sets')",
            "rest": "string (e.g., '60 seconds')",
            "image_prompt": "string (detailed description for image generation)",
            "instructions": "string (how to perform safely)",
            "day": "string (e.g., 'Monday', 'Tuesday')"
          }
        ],
        "diet": [
          {
            "meal_name": "string",
            "meal_type": "breakfast|lunch|dinner|snack",
            "calories": "string (e.g., '450 kcal')",
            "macros": {
              "protein": "string (e.g., '30g')",
              "carbs": "string (e.g., '45g')",
              "fats": "string (e.g., '15g')"
            },
            "ingredients": ["array", "of", "ingredients"],
            "image_prompt": "string (detailed food photography description)",
            "preparation_time": "string (e.g., '15 minutes')"
          }
        ],
        "motivation": "string (one powerful motivational quote)",
        "tips": ["array", "of", "3-5", "actionable", "fitness", "tips"],
        "weekly_schedule": {
          "monday": "string",
          "tuesday": "string",
          "wednesday": "string",
          "thursday": "string",
          "friday": "string",
          "saturday": "string",
          "sunday": "string"
        }
      }`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a JSON-only response generator. Never use markdown formatting or code blocks.",
        },
        {
          role: "user",
          content: SYSTEM_PROMPT,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 3000,
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("Empty response from OpenAI");
    }

    // Parse and validate JSON
    let fitnessPlan: FitnessPlan;
    try {
      const cleanedContent = responseContent
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      fitnessPlan = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw content:", responseContent);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate structure
    if (!fitnessPlan.workout || !fitnessPlan.diet) {
      throw new Error("Invalid fitness plan structure");
    }

    return NextResponse.json({
      success: true,
      data: fitnessPlan,
      metadata: {
        generated_at: new Date().toISOString(),
        model: "gpt-4o-mini",
        user_goal: userData.goal,
      },
    });
  } catch (error: any) {
    console.error("Error generating fitness plan:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate fitness plan",
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
