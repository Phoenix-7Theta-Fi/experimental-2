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
import SectionNav from "../components/SectionNav";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import Link from "next/link";
import PatientHeader from "../components/PatientHeader";

interface PageProps {
  params: { patientId: string };
  searchParams: { section?: string };
}

export default async function PatientHealthAnalyticsPage({ params, searchParams }: PageProps) {
  const userId = await getUserSession();
  if (!userId) redirect("/auth/login");

  const db = getDB();
  
  // Get practitioner info
  const practitioner = db
    .prepare('SELECT id, email, role FROM users WHERE id = ?')
    .get(userId) as { id: number; email: string; role: 'patient' | 'practitioner' } | undefined;

  if (!practitioner || practitioner.role !== "practitioner") redirect("/");

  // Get patient info and verify relationship
  const patient = db
    .prepare(`
      SELECT u.id, u.email, u.name, u.role 
      FROM users u 
      WHERE u.id = ? AND u.practitioner_id = ? AND u.role = 'patient'
    `)
    .get(params.patientId, practitioner.id) as { id: number; email: string; name: string } | undefined;

  if (!patient) redirect("/patients");

  // Fetch patient's health data
  const nutritionData = getUserNutritionData(patient.id);
  const workoutData = getUserWorkoutData(patient.id);
  const yogaData = getUserYogaData(patient.id);
  const mentalHealthData = getUserMentalHealthData(patient.id);
  const medicationData = getMedicationTracking(patient.id);
  const biomarkerData = getUserBiomarkerData(patient.id);
  const treatmentPlan = getUserTreatmentPlan(patient.id);

  if (!nutritionData || !workoutData || !yogaData || !mentalHealthData || !medicationData || !biomarkerData || !treatmentPlan) {
    return (
      <>
        <Navbar userEmail={practitioner.email} userRole={practitioner.role} />
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E293B]">
          <h1 className="text-2xl font-bold mb-4 text-[#F8FAFC]">No health data available</h1>
          <p className="text-[#94A3B8] mb-8">This patient has no health data yet.</p>
          <Link
            href="/patients"
            className="text-[#94A3B8] hover:text-[#F97316] transition-colors"
          >
            ← Back to Patients
          </Link>
        </div>
      </>
    );
  }

  const activeSection = validateSection(searchParams.section);

  return (
    <>
      <Navbar userEmail={practitioner.email} userRole={practitioner.role} />
      <main className="container mx-auto py-8 px-4 mt-20">
        <PatientHeader
          patientName={patient.name}
          patientId={patient.id}
          currentUserId={practitioner.id}
          userRole={practitioner.role}
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
            currentUserId={practitioner.id}
            patientId={patient.id}
            isPractitioner={true}
          />
        </div>
      </main>
    </>
  );
}
