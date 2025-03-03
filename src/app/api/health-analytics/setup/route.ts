import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { seedNutrition } from "@/lib/db/nutrition";
import { seedWorkouts } from "@/lib/db/workouts";
import { seedYoga } from "@/lib/db/yoga";
import { seedMentalHealthData } from "@/lib/db/mental-health";
import { seedMedicationData } from "@/lib/db/medication";
import { seedBiomarkerData } from "@/lib/db/biomarkers";

export async function GET() {
  try {
    getDB(); // Ensures tables are created
    seedNutrition();
    seedWorkouts();
    seedYoga();
    seedMentalHealthData();
    seedMedicationData();
    seedBiomarkerData();

    return NextResponse.json({
      message: "Health analytics data seeded successfully",
      modules: ["nutrition", "workouts", "yoga", "mental-health", "medication", "biomarkers"],
    });
  } catch (error) {
    console.error("Error seeding health analytics data:", error);
    return NextResponse.json(
      { error: "Failed to seed health analytics data" },
      { status: 500 }
    );
  }
}
