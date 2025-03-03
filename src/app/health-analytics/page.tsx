import { redirect } from "next/navigation";
import { getDB } from "@/lib/db";
import { getUserNutritionData } from "@/lib/db/nutrition";
import { getUserWorkoutData } from "@/lib/db/workouts";
import { getUserYogaData } from "@/lib/db/yoga";
import { getUserMentalHealthData } from "@/lib/db/mental-health";
import { getMedicationTracking } from "@/lib/db/medication";
import { getUserBiomarkerData } from "@/lib/db/biomarkers";
import { Navbar } from "@/components/navbar";
import { validateSection } from "@/lib/utils/sections";
import SectionNav from "./components/SectionNav";
import AnalyticsDashboard from "./components/AnalyticsDashboard";

interface PageProps {
  searchParams: { section?: string };
}

export default async function HealthAnalyticsPage({ searchParams }: PageProps) {
  const db = getDB();
  const userResult = db.prepare('SELECT id, email, role FROM users WHERE id = (SELECT value FROM session_store WHERE key = "userId" ORDER BY created_at DESC LIMIT 1)').get() as { id: number; email: string; role: 'patient' | 'practitioner' } | undefined;

  if (!userResult) redirect("/auth/login");
  if (userResult.role !== "patient") redirect("/");

  const nutritionData = getUserNutritionData(userResult.id);
  const workoutData = getUserWorkoutData(userResult.id);
  const yogaData = getUserYogaData(userResult.id);
  const mentalHealthData = getUserMentalHealthData(userResult.id);
  const medicationData = getMedicationTracking(userResult.id);
  const biomarkerData = getUserBiomarkerData(userResult.id);

  if (!nutritionData || !workoutData || !yogaData || !mentalHealthData || !medicationData || !biomarkerData) {
    return (
      <>
        <Navbar userEmail={userResult.email} userRole={userResult.role} />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4 text-[#F8FAFC]">No health data available</h1>
          <p className="text-[#94A3B8]">Please contact your healthcare provider.</p>
        </div>
      </>
    );
  }

  const activeSection = validateSection(searchParams.section);

  return (
    <>
      <Navbar userEmail={userResult.email} userRole={userResult.role} />
      <main className="container mx-auto py-8 px-4 mt-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#F8FAFC]">Health Analytics Dashboard</h1>
        </div>
        <SectionNav activeSection={activeSection} />
        <div className="space-y-8 py-4">
          <AnalyticsDashboard
            nutritionData={nutritionData}
            workoutData={workoutData}
            yogaData={yogaData}
            mentalHealthData={mentalHealthData}
            medicationData={medicationData}
            biomarkerData={biomarkerData}
            activeSection={activeSection}
          />
        </div>
      </main>
    </>
  );
}
