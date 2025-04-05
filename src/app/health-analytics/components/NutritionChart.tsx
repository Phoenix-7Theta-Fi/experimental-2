'use client';

import ReactECharts from "echarts-for-react";
import { NutritionData, MacroNutrient, MedicationTracking } from "@/lib/types/health";
import MedicationSection from "./medication/MedicationSection";

interface NutritionChartProps {
  data: NutritionData;
  medicationData: MedicationTracking;
  patientId: number;
}

export default function NutritionChart({ data, medicationData, patientId }: NutritionChartProps) {
  // Calculate macronutrient percentages
  const totalMacros = data.protein + data.carbs + data.fats;
  const macroNutrients: MacroNutrient[] = [
    { name: "Protein", value: Math.round((data.protein / totalMacros) * 100), color: "#FF6B6B" },
    { name: "Carbs", value: Math.round((data.carbs / totalMacros) * 100), color: "#4ECDC4" },
    { name: "Fats", value: Math.round((data.fats / totalMacros) * 100), color: "#45B7D1" },
  ];

  // Convert raw values to percentages based on recommended daily values
  const rdv = {
    vitamin_a: 900, // mcg
    vitamin_b12: 2.4, // mcg
    vitamin_c: 90, // mg
    vitamin_d: 20, // mcg
    iron: 18, // mg
    calcium: 1000, // mg
    zinc: 11 // mg
  };

  const vitamins = [
    { name: "Vitamin A", value: Math.round((data.vitamin_a / rdv.vitamin_a) * 100), color: "#84CC16" },
    { name: "Vitamin B12", value: Math.round((data.vitamin_b12 / rdv.vitamin_b12) * 100), color: "#BEF264" },
    { name: "Vitamin C", value: Math.round((data.vitamin_c / rdv.vitamin_c) * 100), color: "#A3E635" },
    { name: "Vitamin D", value: Math.round((data.vitamin_d / rdv.vitamin_d) * 100), color: "#65A30D" },
  ];

  const minerals = [
    { name: "Iron", value: Math.round((data.iron / rdv.iron) * 100), color: "#818CF8" },
    { name: "Calcium", value: Math.round((data.calcium / rdv.calcium) * 100), color: "#6366F1" },
    { name: "Zinc", value: Math.round((data.zinc / rdv.zinc) * 100), color: "#4338CA" },
  ];

  const option = {
    title: {
      text: "Nutrition Distribution",
      left: "center",
      top: 20,
      textStyle: {
        color: "#F8FAFC",
      },
    },
    tooltip: {
      trigger: "item" as const,
      formatter: "{a} <br/>{b} : {c}%",
      backgroundColor: "#1E293B",
      borderColor: "#475569",
      textStyle: {
        color: "#F8FAFC",
      },
    },
    legend: {
      orient: "vertical" as const,
      left: "left" as const,
      top: "middle" as const,
      textStyle: {
        color: "#F8FAFC",
      },
      formatter: (name: string) => {
        // Add spacing between different nutrient types
        if (name === "Vitamin A") return "\nVitamins\n\n" + name;
        if (name === "Iron") return "\nMinerals\n\n" + name;
        return name;
      }
    },
    series: [
      {
        name: "Macro Nutrients",
        type: "pie" as const,
        radius: ["20%", "40%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#334155",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inner" as const,
          formatter: "{b}\n{c}%",
          color: "#F8FAFC",
          fontSize: 12,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 700,
            color: "#F8FAFC",
          },
        },
        data: macroNutrients.map(nutrient => ({
          value: nutrient.value,
          name: nutrient.name,
          itemStyle: {
            color: nutrient.color,
          },
        })),
      },
      {
        name: "Vitamins & Minerals",
        type: "pie" as const,
        radius: ["45%", "65%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#334155",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "outside" as const,
          formatter: "{b}: {c}%",
          color: "#F8FAFC",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 700,
            color: "#F8FAFC",
          },
        },
        data: [...vitamins, ...minerals].map(nutrient => ({
          value: nutrient.value,
          name: nutrient.name,
          itemStyle: {
            color: nutrient.color,
          },
        })),
      },
    ],
  };

  return (
    <div className="grid grid-cols-5 gap-8">
      <div className="col-span-3 space-y-6">
        <div className="w-full bg-[#334155] rounded-lg border border-[#475569] p-4 shadow-md">
          <ReactECharts
            option={option}
            style={{ height: "450px" }}
            className="w-full"
            theme="dark"
          />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            {macroNutrients.map((nutrient) => (
              <div
                key={nutrient.name}
                className="p-3 rounded-lg shadow-sm"
                style={{ backgroundColor: `${nutrient.color}20` }}
              >
                <h3 className="font-semibold text-[#F8FAFC]">{nutrient.name}</h3>
                <p className="text-xl font-bold text-[#F8FAFC]">{nutrient.value}%</p>
              </div>
            ))}
          </div>
        </div>

        <MedicationSection data={medicationData} />
      </div>
    </div>
  );
}
