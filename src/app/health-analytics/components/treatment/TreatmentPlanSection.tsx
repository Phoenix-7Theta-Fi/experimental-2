'use client';

import React from 'react';
import { TreatmentPlan } from '@/lib/types/health';
import ProblemOverview from './problem-overview/ProblemOverview';
import TreatmentStrategy from './treatment-strategy/TreatmentStrategy';
import GoalsAndMilestones from './goals/GoalsAndMilestones';
import { useState } from 'react';

interface TreatmentPlanSectionProps {
  initialData?: TreatmentPlan;
}

// Sample dummy data to use when no treatment plan exists
const dummyTreatmentPlan: Omit<TreatmentPlan, 'id' | 'user_id'> = {
  problemOverview: {
    currentStatus: {
      primaryCondition: 'Metabolic Syndrome',
      symptoms: ['Fatigue', 'Elevated blood pressure', 'Insulin resistance'],
      severity: 'moderate'
    },
    keyBiomarkers: [
      { name: 'Fasting Glucose', current: 105, target: 90, unit: 'mg/dL' },
      { name: 'HbA1c', current: 5.8, target: 5.5, unit: '%' },
      { name: 'Blood Pressure', current: 135, target: 120, unit: 'mmHg' }
    ],
    riskFactors: ['Family history of diabetes', 'Sedentary lifestyle', 'Stress']
  },
  treatmentStrategy: {
    ayurvedic: {
      herbs: [
        { name: 'Gymnema Sylvestre', dosage: '500mg', timing: 'Before meals', duration: '3 months' },
        { name: 'Turmeric', dosage: '1g', timing: 'With meals', duration: 'Ongoing' }
      ],
      yoga: [
        { asana: 'Surya Namaskar', duration: '15 minutes', frequency: 'Daily', notes: 'Morning practice' },
        { asana: 'Pranayama', duration: '10 minutes', frequency: 'Twice daily', notes: 'Focus on deep breathing' }
      ],
      diet: [
        { recommendation: 'Low glycemic index foods', reason: 'Stabilize blood sugar', restrictions: ['Refined sugar', 'White rice'] }
      ]
    },
    modern: {
      exercise: {
        type: 'Mixed cardio and resistance training',
        intensity: 'Moderate',
        frequency: '5 days per week',
        duration: '30-45 minutes'
      },
      sleep: {
        targetHours: 8,
        optimizations: ['No screens 1 hour before bed', 'Consistent sleep schedule']
      },
      biohacking: [
        { intervention: 'Cold exposure', protocol: '2-minute cold shower', frequency: 'Daily' }
      ]
    },
    lifestyle: ['Stress management through meditation', 'Regular meal timing', 'Intermittent fasting 16:8']
  },
  goals: {
    shortTerm: [
      {
        description: 'Reduce fasting glucose levels',
        targetDate: '2024-06-01',
        metrics: [
          { name: 'Fasting Glucose', target: 95, unit: 'mg/dL' }
        ]
      }
    ],
    longTerm: [
      {
        description: 'Reverse metabolic syndrome',
        targetDate: '2024-12-31',
        milestones: [
          'Normalize all biomarkers',
          'Reduce medication dependency',
          'Maintain healthy weight'
        ]
      }
    ]
  }
};

export default function TreatmentPlanSection({ initialData }: TreatmentPlanSectionProps) {
  const [data, setData] = useState<TreatmentPlan | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);

  React.useEffect(() => {
    if (!initialData) {
      fetchTreatmentPlan();
    }
  }, [initialData]);

  async function fetchTreatmentPlan() {
    try {
      const response = await fetch('/api/treatment-plans');
      if (response.ok) {
        const planData = await response.json();
        setData(planData);
      } else {
        // If no treatment plan is found, use dummy data
        setData({
          id: 0,
          user_id: 0,
          ...dummyTreatmentPlan
        });
      }
    } catch (error) {
      console.error('Error fetching treatment plan:', error);
      // On error, also use dummy data
      setData({
        id: 0,
        user_id: 0,
        ...dummyTreatmentPlan
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold text-gray-300">No Treatment Plan Available</h3>
        <p className="text-gray-400 mt-2">Please consult your practitioner to create a treatment plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-blue-900/30 rounded-lg p-4 mb-4">
        <p className="text-blue-300">
          <span className="font-semibold">Note:</span> Your treatment plan is created and managed by your healthcare practitioner. 
          This plan is designed specifically for your health needs. Please follow these recommendations carefully 
          and discuss any concerns with your practitioner.
        </p>
      </div>
      
      {/* Problem Overview Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <ProblemOverview 
          data={data.problemOverview}
          readOnly={true}
        />
      </div>

      {/* Treatment Strategy Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <TreatmentStrategy
          data={data.treatmentStrategy}
          readOnly={true}
        />
      </div>

      {/* Goals and Milestones Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <GoalsAndMilestones
          data={data.goals}
          readOnly={true}
        />
      </div>
    </div>
  );
}
