import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { getUserTreatmentPlan, createTreatmentPlan, updateTreatmentPlan } from "@/lib/db/treatment-plans";
import { TreatmentPlan } from "@/lib/types/health";

export async function GET() {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const plan = getUserTreatmentPlan(userId);
    if (!plan) {
      return NextResponse.json({ error: "No treatment plan found" }, { status: 404 });
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Error fetching treatment plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.problemOverview || !data.treatmentStrategy || !data.goals) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already has a treatment plan
    const existingPlan = getUserTreatmentPlan(userId);
    
    if (existingPlan) {
      // Update existing plan
      const updatedPlan: TreatmentPlan = {
        ...existingPlan,
        problemOverview: data.problemOverview,
        treatmentStrategy: data.treatmentStrategy,
        goals: data.goals,
      };
      updateTreatmentPlan(updatedPlan);
      return NextResponse.json(updatedPlan);
    } else {
      // Create new plan
      const newPlan = {
        user_id: userId,
        problemOverview: data.problemOverview,
        treatmentStrategy: data.treatmentStrategy,
        goals: data.goals,
      };
      const id = createTreatmentPlan(newPlan);
      return NextResponse.json({ ...newPlan, id });
    }
  } catch (error) {
    console.error("Error creating/updating treatment plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
