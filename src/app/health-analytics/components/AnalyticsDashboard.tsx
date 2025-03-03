'use client';

import { NutritionData, WorkoutData, YogaData, MentalHealthData, MedicationTracking, BiomarkerData } from "@/lib/types/health";
import { Section } from "@/lib/utils/sections";
import NutritionChart from "./NutritionChart";
import StrengthMetricsChart from "./StrengthMetricsChart";
import CardioMetricsChart from "./CardioMetricsChart";
import YogaMetricsChart from "./YogaMetricsChart";
import MentalHealthChart from "./MentalHealthChart";
import TransitionWrapper from "./TransitionWrapper";
import BiomarkersSection from "./biomarkers/BiomarkersSection";

interface AnalyticsDashboardProps {
  nutritionData: NutritionData;
  workoutData: WorkoutData;
  yogaData: YogaData;
  mentalHealthData: MentalHealthData;
  medicationData: MedicationTracking;
  biomarkerData: BiomarkerData[];
  activeSection: Section;
}

export default function AnalyticsDashboard({
  nutritionData,
  workoutData,
  yogaData,
  mentalHealthData,
  medicationData,
  activeSection,
  biomarkerData,
}: AnalyticsDashboardProps) {
  const sections: Record<Section, React.ReactNode> = {
    nutrition: <NutritionChart data={nutritionData} medicationData={medicationData} />,
    strength: <StrengthMetricsChart data={workoutData} />,
    cardio: <CardioMetricsChart data={workoutData} />,
    yoga: <YogaMetricsChart data={yogaData} />,
    mental: <MentalHealthChart data={mentalHealthData} />,
    biomarkers: <BiomarkersSection data={biomarkerData} />,
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
