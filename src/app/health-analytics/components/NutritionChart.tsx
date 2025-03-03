'use client';

import ReactECharts from "echarts-for-react";
import { NutritionData, MacroNutrient, MedicationTracking } from "@/lib/types/health";
import MedicationSection from "./medication/MedicationSection";

interface NutritionChartProps {
  data: NutritionData;
  medicationData: MedicationTracking;
}

export default function NutritionChart({ data, medicationData }: NutritionChartProps) {
  const macroNutrients: MacroNutrient[] = [
    { name: "Protein", value: data.protein, color: "#FF6B6B" },
    { name: "Carbs", value: data.carbs, color: "#4ECDC4" },
    { name: "Fats", value: data.fats, color: "#45B7D1" },
  ];

  const vitamins = [
    { name: "Vitamin A", value: data.vitamins.A, color: "#84CC16" },
    { name: "Vitamin B12", value: data.vitamins.B12, color: "#BEF264" },
    { name: "Vitamin C", value: data.vitamins.C, color: "#A3E635" },
    { name: "Vitamin D", value: data.vitamins.D, color: "#65A30D" },
  ];

  const minerals = [
    { name: "Iron", value: data.minerals.iron, color: "#818CF8" },
    { name: "Calcium", value: data.minerals.calcium, color: "#6366F1" },
    { name: "Zinc", value: data.minerals.zinc, color: "#4338CA" },
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
      trigger: "item",
      formatter: "{a} <br/>{b} : {c}%",
      backgroundColor: "#1E293B",
      borderColor: "#475569",
      textStyle: {
        color: "#F8FAFC",
      },
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: "middle",
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
        type: "pie",
        radius: ["20%", "40%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#334155",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inner",
          formatter: "{b}\n{c}%",
          color: "#F8FAFC",
          fontSize: 12,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
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
        name: "Vitamins",
        type: "pie",
        radius: ["45%", "65%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#334155",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "outside",
          formatter: "{b}: {c}%",
          color: "#F8FAFC",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
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
    <div className="space-y-8">
      <div className="w-full max-w-3xl mx-auto bg-[#334155] rounded-lg shadow-lg shadow-black/20 border border-[#475569] overflow-hidden">
        <div className="p-4">
          <ReactECharts 
            option={option} 
            style={{ height: "500px" }}
            className="w-full"
            theme="dark"
          />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            {macroNutrients.map((nutrient) => (
              <div 
                key={nutrient.name}
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${nutrient.color}20` }}
              >
                <h3 className="font-semibold text-[#F8FAFC]">{nutrient.name}</h3>
                <p className="text-lg text-[#F8FAFC]">{nutrient.value}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <MedicationSection data={medicationData} />
    </div>
  );
}
