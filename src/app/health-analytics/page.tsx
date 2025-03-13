import { redirect } from "next/navigation";
import { getDB } from "@/lib/db";
import { getUserSession } from "@/lib/auth";
import { getUserNutritionData } from "@/lib/db/nutrition";
import { getUserWorkoutData } from "@/lib/db/workouts";
import { getUserYogaData } from "@/lib/db/yoga";
import { getUserMentalHealthData } from "@/lib/db/mental-health";
import { getMedicationTracking } from "@/lib/db/medication";
import { getUserBiomarkerData } from "@/lib/db/biomarkers";
import { getUserTreatmentPlan } from "@/lib/db/treatment-plans";
import { Navbar } from "@/components/navbar";
import { validateSection } from "@/lib/utils/sections";
import SectionNav from "./components/SectionNav";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import PatientHeader from "./components/PatientHeader";

interface PageProps {
  searchParams: { section?: string };
}

export default async function HealthAnalyticsPage({ searchParams }: PageProps) {
  console.log('1. Getting user session...');
  const userId = await getUserSession();
  console.log('User session ID:', userId);
  if (!userId) redirect("/auth/login");

  console.log('2. Looking up user in database...');
  const db = getDB();
  const userResult = db.prepare(`
    SELECT u.id, u.email, u.role, u.name, u.practitioner_id, p.name as practitioner_name 
    FROM users u 
    LEFT JOIN users p ON u.practitioner_id = p.id 
    WHERE u.id = ?
  `).get(userId) as { id: number; email: string; role: 'patient' | 'practitioner'; name: string; practitioner_id: number; practitioner_name: string } | undefined;
  console.log('User result:', userResult);

  if (!userResult) redirect("/auth/login");
  if (userResult.role === "practitioner") redirect("/patients");
  
  // If patient, ensure they're accessing their own data
  const patientId = userId;

  console.log('3. Fetching health data...');
  console.log('Fetching nutrition data...');
  const nutritionData = getUserNutritionData(userResult.id);
  console.log('Nutrition data:', nutritionData ? 'Found' : 'Not found');

  console.log('Fetching workout data...');
  const workoutData = getUserWorkoutData(userResult.id);
  console.log('Workout data:', workoutData ? 'Found' : 'Not found');

  console.log('Fetching yoga data...');
  const yogaData = getUserYogaData(userResult.id);
  console.log('Yoga data:', yogaData ? 'Found' : 'Not found');

  console.log('Fetching mental health data...');
  const mentalHealthData = getUserMentalHealthData(userResult.id);
  console.log('Mental health data:', mentalHealthData ? 'Found' : 'Not found');

  console.log('Fetching medication data...');
  const medicationData = getMedicationTracking(userResult.id);
  console.log('Medication data:', medicationData ? 'Found' : 'Not found');

  console.log('Fetching biomarker data...');
  const biomarkerData = getUserBiomarkerData(userResult.id);
  console.log('Biomarker data:', biomarkerData ? 'Found' : 'Not found');

  console.log('Fetching treatment plan data...');
  const treatmentPlan = getUserTreatmentPlan(userResult.id);
  console.log('Treatment plan data:', treatmentPlan ? 'Found' : 'Not found');

  console.log('4. Checking if any data is missing...');
  if (!nutritionData || !workoutData || !yogaData || !mentalHealthData || !medicationData || !biomarkerData || !treatmentPlan) {
    console.log('Missing data detected:', {
      nutrition: !nutritionData,
      workout: !workoutData,
      yoga: !yogaData,
      mentalHealth: !mentalHealthData,
      medication: !medicationData,
      biomarker: !biomarkerData,
      treatmentPlan: !treatmentPlan
    });
    return (
      <>
        <Navbar userEmail={userResult.email} userRole={userResult.role} />
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E293B]">
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
        <PatientHeader
          patientName={userResult.name}
          patientId={userResult.id}
          practitionerId={userResult.practitioner_id}
          currentUserId={userResult.id}
          userRole={userResult.role}
        />
        <SectionNav activeSection={activeSection} />
        <div className="space-y-8 py-4">
          <AnalyticsDashboard
            nutritionData={nutritionData}
            workoutData={workoutData}
            yogaData={yogaData}
            mentalHealthData={mentalHealthData}
            medicationData={medicationData}
            biomarkerData={biomarkerData}
            treatmentPlan={treatmentPlan}
            activeSection={activeSection}
            currentUserId={userResult.id}
          />
        </div>
      </main>
    </>
  );
}
