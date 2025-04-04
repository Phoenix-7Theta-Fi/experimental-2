'use client';

import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { graphic } from 'echarts'; // Import graphic for gradients

// Define a more cohesive color palette
const YOGA_COLORS = {
  hatha: ['#5A67D8', '#805AD5', '#D53F8C'], // Indigo -> Purple -> Pink
  vinyasa: ['#38A169', '#319795', '#3182CE'], // Green -> Teal -> Blue
  yin: ['#DD6B20', '#D69E2E', '#FAF089'], // Orange -> Yellow -> Light Yellow
  center: '#CBD5E0', // Light gray for center text
  background: '#1A202C', // Dark background (adjust if needed)
  border: '#2D3748', // Border color
  text: '#E2E8F0', // General text color
};

// Function to generate shades (optional, can simplify if needed)
const generateShades = (baseColor: string, count: number): string[] => {
  // Basic shade generation - replace with a proper library if complex shades are needed
  const shades = [baseColor];
  // This is a placeholder - ECharts can often handle color interpolation better
  for (let i = 1; i < count; i++) {
    shades.push(baseColor); // Simplistic approach
  }
  return shades;
};

// Updated Mock data structure - removing hardcoded itemStyle colors
const YOGA_DATA = {
  name: 'Yoga Practice',
  children: [
    {
      name: 'Hatha',
      value: 800,
      // itemStyle removed - will be applied dynamically
      children: [
        {
          name: 'Strength',
          value: 400,
          children: [
            {
              name: 'Upper Body',
              value: 200,
              children: [
                { name: 'Chaturanga', value: 100 },
                { name: 'Plank Poses', value: 100 },
              ],
            },
            {
              name: 'Core',
              value: 200,
              children: [
                { name: 'Boat Pose', value: 100 },
                { name: 'Core Series', value: 100 },
              ],
            },
          ],
        },
        {
          name: 'Flexibility',
          value: 400,
          children: [
            {
              name: 'Spine',
              value: 200,
              children: [
                { name: 'Forward Folds', value: 100 },
                { name: 'Twists', value: 100 },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Vinyasa',
      value: 600,
      // itemStyle removed
      children: [
        {
          name: 'Balance',
          value: 300,
          children: [
            {
              name: 'Standing Poses',
              value: 150,
              children: [
                { name: 'Tree Pose', value: 75 },
                { name: 'Warrior Series', value: 75 },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Yin',
      value: 400,
      // itemStyle removed
      children: [
        {
          name: 'Recovery',
          value: 200,
          children: [
            {
              name: 'Joints',
              value: 100,
              children: [
                { name: 'Hip Openers', value: 50 },
                { name: 'Shoulder Release', value: 50 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Assign colors dynamically based on level and name
const assignColors = (node: any, level: number = 0, parentColor?: string) => {
  let color;
  if (level === 1) {
    // Assign base colors to top-level categories
    if (node.name === 'Hatha') color = YOGA_COLORS.hatha[0];
    else if (node.name === 'Vinyasa') color = YOGA_COLORS.vinyasa[0];
    else if (node.name === 'Yin') color = YOGA_COLORS.yin[0];
    else color = '#cccccc'; // Fallback
  } else if (parentColor) {
    // Basic shading - could be improved with a color library
    // For simplicity, let's slightly darken the parent color (example)
    // A real implementation might use chroma.js or similar
    // This example just uses the parent color for simplicity now
    color = parentColor;
  } else {
    color = '#cccccc'; // Fallback for root or unexpected cases
  }

  node.itemStyle = {
    ...node.itemStyle, // Keep existing styles if any
    color: color,
  };

  if (node.children) {
    node.children.forEach((child: any) => assignColors(child, level + 1, color));
  }
};

// Apply colors to the data
YOGA_DATA.children.forEach(child => assignColors(child, 1));

// Calculate total time
const totalPracticeTime = YOGA_DATA.children.reduce((sum, child) => sum + child.value, 0);

export default function YogaSunburstChart() {
  const option: EChartsOption = {
    backgroundColor: 'transparent', // Use container background
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // params.data should contain the node data
        const data = params.data as { name: string; value: number };
        if (!data || data.value === undefined) return ''; // Handle cases where data might be missing

        const value = data.value;
        const percent = totalPracticeTime > 0 ? ((value / totalPracticeTime) * 100).toFixed(1) : 0;
        const path = params.treePathInfo.map((item: any) => item.name).join(' > ');

        // Improved tooltip styling (basic example)
        return `
          <div style="font-size: 14px; color: #eee; background: rgba(40, 40, 40, 0.85); border-radius: 4px; padding: 8px 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            <strong>${data.name}</strong><br/>
            <span style="font-size: 12px; color: #bbb;">Path: ${path}</span><br/>
            Practice Time: ${value} min (${percent}%)
          </div>
        `;
      },
      backgroundColor: 'transparent', // Let the custom HTML handle background
      borderColor: 'transparent',
      padding: 0, // Remove default padding
      textStyle: { // Default text style (less important due to HTML formatter)
        color: YOGA_COLORS.text,
      },
    },
    title: { // Add title in the center
        text: `{val|${totalPracticeTime}}\n{desc|Total Mins}`,
        left: 'center',
        top: 'center',
        textStyle: {
            rich: {
                val: {
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: YOGA_COLORS.text,
                    lineHeight: 35,
                },
                desc: {
                    fontSize: 14,
                    color: YOGA_COLORS.center,
                    lineHeight: 20,
                }
            }
        }
    },
    series: {
      type: 'sunburst',
      data: YOGA_DATA.children,
      radius: ['25%', '95%'], // Adjusted radius for center space
      sort: undefined, // Keep original order or sort by value: 'desc' / 'asc'
      itemStyle: {
        borderRadius: 8,
        borderWidth: 3,
        borderColor: YOGA_COLORS.border, // Use theme color
      },
      label: {
        show: true,
        rotate: 'radial', // Try radial rotation
        color: YOGA_COLORS.text,
        fontSize: 11,
        minAngle: 5, // Hide label for very small segments
        formatter: '{b}', // Display name only
        // position: 'outside' // Can move labels outside if needed
      },
      emphasis: {
        focus: 'ancestor',
        itemStyle: {
          // More pronounced emphasis
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(255, 255, 255, 0.5)', // Brighter shadow
          opacity: 1,
        },
        label: {
            fontSize: 13, // Slightly larger label on hover
            fontWeight: 'bold',
        }
      },
      levels: [
        {}, // Level 0 (center) - Not displayed data, but level exists
        { // Level 1 - Yoga Styles
          r0: '25%',
          r: '48%',
          label: {
            fontSize: 14,
            fontWeight: 'bold',
            rotate: 0, // Keep top-level labels horizontal
            // align: 'center', // ECharts default might be better here
          },
          itemStyle: {
            borderWidth: 4,
            // gapWidth: 3, // Removed invalid property
          }
        },
        { // Level 2 - Focus Areas
          r0: '48%',
          r: '68%',
          label: {
            fontSize: 12,
            // align: 'right', // Experiment with alignment
          },
           itemStyle: {
            borderWidth: 2,
            // gapWidth: 2, // Removed invalid property
          }
        },
        { // Level 3 - Sub-categories
          r0: '68%',
          r: '85%',
          label: {
            fontSize: 10,
            // align: 'center',
          },
           itemStyle: {
            borderWidth: 1,
            // gapWidth: 1, // Removed invalid property
          }
        },
        { // Level 4 - Specific Poses/Series
          r0: '85%',
          r: '95%',
          label: {
            show: false, // Keep labels hidden for the outermost ring
          },
           itemStyle: {
            borderWidth: 1,
            // gapWidth: 1, // Removed invalid property
          }
        }
      ],
    },
  };

  return (
    // Use Tailwind classes for consistency if applicable in the project
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-4 sm:p-6">
      <h3 className="text-slate-100 font-semibold text-lg mb-4 text-center">
        Yoga Practice Distribution
      </h3>
      <ReactECharts
        option={option}
        style={{ height: '450px' }} // Keep increased height or adjust as needed
        // theme="dark" // Theme prop might conflict with explicit styling, test removal
        notMerge={true} // Prevent options merging issues
        lazyUpdate={true} // Optimize updates
      />
    </div>
  );
}
