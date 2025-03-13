'use client';

import { NutritionData, WorkoutData, YogaData, MentalHealthData, MedicationTracking, BiomarkerData, TreatmentPlan, DailyScheduleData } from "@/lib/types/health";
import { Section } from "@/lib/utils/sections";
import NutritionChart from "./NutritionChart";
import WorkoutMetricsChart from "./WorkoutMetricsChart";
import YogaMetricsChart from "./YogaMetricsChart";
import MentalHealthChart from "./MentalHealthChart";
import TransitionWrapper from "./TransitionWrapper";
import BiomarkersSection from "./biomarkers/BiomarkersSection";
import TreatmentPlanSection from "./treatment/TreatmentPlanSection";
import DailyScheduleSection from "./schedule/DailyScheduleSection";

interface AnalyticsDashboardProps {
  nutritionData: NutritionData;
  workoutData: WorkoutData;
  yogaData: YogaData;
  mentalHealthData: MentalHealthData;
  medicationData: MedicationTracking;
  biomarkerData: BiomarkerData[];
  treatmentPlan: TreatmentPlan;
  activeSection: Section;
  currentUserId: number;
  patientId?: number;
  isPractitioner?: boolean;
}

export default function AnalyticsDashboard({
  nutritionData,
  workoutData,
  yogaData,
  mentalHealthData,
  medicationData,
  activeSection,
  biomarkerData,
  treatmentPlan,
  currentUserId,
  patientId,
  isPractitioner,
}: AnalyticsDashboardProps) {
  const sections: Record<Section, React.ReactNode> = {
    nutrition: <NutritionChart 
      data={nutritionData} 
      medicationData={medicationData}
      patientId={patientId || currentUserId}
    />,
    workout: <WorkoutMetricsChart 
      data={workoutData}
      patientId={patientId || currentUserId}
    />,
    yoga: <YogaMetricsChart 
      data={yogaData}
      patientId={patientId || currentUserId}
    />,
    mental: <MentalHealthChart 
      data={mentalHealthData}
      patientId={patientId || currentUserId}
    />,
    biomarkers: <BiomarkersSection 
      data={biomarkerData}
      patientId={patientId || currentUserId}
    />,
    treatment: <TreatmentPlanSection initialData={treatmentPlan} />,
    schedule: <DailyScheduleSection 
      currentUserId={currentUserId} 
      patientId={patientId}
      isPractitioner={isPractitioner}
      treatmentPlan={treatmentPlan}
    />,
  };

  return (
    <div className="relative min-h-[600px]">
      {Object.entries(sections).map(([section, component]) => (
        <div key={section} className="absolute w-full">
          <TransitionWrapper show={activeSection === section}>
            {component}
          </TransitionWrapper>
        </div>
      ))}
    </div>
  );
}
