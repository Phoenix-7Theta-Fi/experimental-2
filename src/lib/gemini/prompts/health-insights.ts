import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import type {
  InsightGenerationRequest,
  InsightGenerationResponse,
  HealthSection
} from '../../types/insights';
import { BIOMARKER_RANGES } from '../../types/health';

const generateInsightPrompt = (data: InsightGenerationRequest) => {
  const { patient_id, data: patientData } = data;

  // Create context from available data
  const context = [];
  
  if (patientData.biomarkers?.length) {
    const latest = patientData.biomarkers[0];
    context.push(`
      Recent Biomarker Data:
      ${latest.glucose ? `- Glucose: Fasting ${latest.glucose.fasting ?? 'N/A'}, Post-prandial ${latest.glucose.postPrandial ?? 'N/A'}` : '- Glucose: No data'}
      ${latest.lipids ? `- Lipids: Total Cholesterol ${latest.lipids.totalCholesterol ?? 'N/A'}, HDL ${latest.lipids.hdl ?? 'N/A'}` : '- Lipids: No data'}
      ${latest.thyroid ? `- Thyroid: TSH ${latest.thyroid.tsh ?? 'N/A'}` : '- Thyroid: No data'}
      ${latest.vitamins ? `- Vitamins: D ${latest.vitamins.d ?? 'N/A'}, B12 ${latest.vitamins.b12 ?? 'N/A'}` : '- Vitamins: No data'}
    `);
  }

  if (patientData.workout?.length) {
    const latest = patientData.workout[0];
    context.push(`
      Recent Workout Metrics:
      ${latest ? `
      - Power Index: ${latest.power_index ?? 'N/A'}
      - Bench Press: ${latest.bench_press ? `${latest.bench_press}kg` : 'N/A'}
      - VO2 Max: ${latest.vo2_max ?? 'N/A'}
      - Heart Rate: Resting ${latest.resting_heart_rate ?? 'N/A'}, Max ${latest.max_heart_rate ?? 'N/A'}`
      : '- No workout data available'}
    `);
  }

  if (patientData.yoga?.length) {
    const latest = patientData.yoga[0];
    context.push(`
      Recent Yoga Data:
      ${latest?.flexibility ? `
      Flexibility:
      - Spine: ${latest.flexibility?.spine ?? 'N/A'}
      - Hips: ${latest.flexibility?.hips ?? 'N/A'}
      - Shoulders: ${latest.flexibility?.shoulders ?? 'N/A'}
      - Balance: ${latest.flexibility?.balance ?? 'N/A'}
      - Overall: ${latest.flexibility?.overall ?? 'N/A'}` : '- No flexibility data'}
      
      ${latest?.practice ? `
      Practice:
      - Weekly Completion: ${latest.practice?.weeklyCompletion ?? 'N/A'}%
      - Streak: ${latest.practice?.streak ?? 'N/A'} days
      - Duration: ${latest.practice?.duration ?? 'N/A'} minutes` : '- No practice data'}
    `);
  }

  if (patientData.mentalHealth?.length) {
    const latest = patientData.mentalHealth[0];
    context.push(`
      Recent Mental Health Data:
      ${latest?.meditation ? `
      Meditation:
      - Minutes: ${latest.meditation?.minutes ?? 'N/A'}
      - Streak: ${latest.meditation?.streak ?? 'N/A'} days
      - Progress: ${latest.meditation?.progress ?? 'N/A'}%` : '- No meditation data'}
      
      ${latest?.sleep ? `
      Sleep:
      - Hours: ${latest.sleep?.hours ?? 'N/A'}
      - Quality: ${latest.sleep?.quality ?? 'N/A'}%
      - Deep Sleep: ${latest.sleep?.deep ?? 'N/A'}%
      - REM: ${latest.sleep?.rem ?? 'N/A'}%` : '- No sleep data'}
      
      ${latest?.wellbeing ? `
      Wellbeing:
      - Stress Level: ${latest.wellbeing?.stressLevel ?? 'N/A'}
      - Recovery Score: ${latest.wellbeing?.recoveryScore ?? 'N/A'}
      - Overall Score: ${latest.wellbeing?.overallScore ?? 'N/A'}` : '- No wellbeing data'}
    `);
  }

  if (patientData.medication?.length) {
    context.push(`
      Current Medications:
      ${patientData.medication.map(med => `
      - ${med.name} (${med.type}):
        Dosage: ${med.dosage}
        Frequency: ${med.frequency}
        Timing: ${med.timing}
        With Food: ${med.with_food ? 'Yes' : 'No'}
        ${med.adherence ? `Adherence: ${
          med.adherence
            .filter(a => new Date(a.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
            .filter(a => a.taken)
            .length
        }/7 days` : ''}`).join('\n')}
    `);
  }

  const prompt = `
    You are an AI health assistant speaking directly to the patient. Generate encouraging and personalized insights 
    based on the following data. When specific data points are missing, create realistic synthetic data based on 
    typical patterns for the patient's demographic.
    
    Patient ID: ${patient_id}
    ${context.join('\n')}

    For each available section, generate insights that focus on specific metrics and their relationships. Include:
    1. Exact numbers and percentage changes (e.g., "15% improvement in sleep quality")
    2. Correlations between different metrics (e.g., "Your increased meditation time of 20 mins/day is boosting recovery by 25%")
    3. Specific impacts of one activity on another (e.g., "Better sleep metrics are directly improving your workout efficiency")
    4. Data-backed observations with numerical evidence

    Example insights and recommendations:
    - "Your sleep efficiency is at 88% (up 12% this month). Recommendation: Increase deep sleep phase by 15% by moving bedtime 45 minutes earlier (from 11:15 PM to 10:30 PM)"
    - "Combined impact: 20 minutes meditation + 7.2 hours sleep = 15% workout boost. Recommendation: Add 5-minute meditation intervals at 10 AM and 3 PM to reach optimal 30-minute daily target"
    - "Flexibility score: 82/100. Recommendation: Focus on hip mobility (currently 65%) - target 80% through 15-minute daily stretching sequence focusing on hip flexors and rotators"
    - "Morning workout correlation: 23% better performance vs evening. Recommendation: Schedule HIIT sessions between 6:30-8:00 AM for optimal heart rate range (145-165 BPM)"

    For recommendations, always include:
    1. Current metric + Target metric (e.g., "Increase from current 65% to target 80%")
    2. Specific time/duration (e.g., "15-minute sessions", "3 times per week")
    3. Measurable outcomes (e.g., "to achieve 12% improvement in recovery score")
    4. Precise scheduling (e.g., "between 7-8 AM", "45 minutes before sleep")
    5. Target ranges for vital metrics (e.g., "maintain heart rate between 130-150 BPM")

    When generating insights:
    1. Always include specific numbers and percentages
    2. Show correlations between different health metrics
    3. Use realistic ranges based on available health data
    4. Identify specific cause-and-effect relationships with numerical evidence
    
    For missing or incomplete data:
    - Generate plausible data within these ranges:
      * Sleep: 6-8 hours, 70-95% quality
      * Meditation: 10-30 mins/day, 60-90% consistency
      * Workout: Power index 60-90, VO2 max 35-50 ml/kg/min
      * Yoga: Flexibility scores 60-90%, Weekly completion 50-90%
      * Recovery: Stress levels 20-60%, Recovery score 60-95%
    
    Generate synthetic data and insights in this JSON structure:
    {
      "insights": [
        {
          "patient_id": ${patient_id},
          "section": "biomarkers|workout|yoga|mental|diet_medication",
          "insight_data": {
            "title": "Summary title",
            "metrics": [
              {
                "name": "Metric name",
                "current": 0,
                "previous": null,
                "change": "Percentage or absolute change",
                "unit": "Unit of measurement"
              }
            ],
            "analysis": "Detailed analysis of the patterns and trends",
            "recommendations": ["Specific, actionable recommendations"],
            "status": "improving|declining|stable",
            "priority": "high|medium|low"
          }
        }
      ],
      "generated_at": "Current timestamp"
    }

    Use these reference ranges for biomarker analysis:
    ${JSON.stringify(BIOMARKER_RANGES, null, 2)}

    Important:
    1. Always generate plausible data for missing metrics
    2. Focus on achievable, lifestyle-based recommendations
    3. Use encouraging language that motivates action
    4. Keep everything patient-friendly and positive
  `;

  return prompt;
};

const healthInsightSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    insights: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.NUMBER, description: "Auto-generated insight ID" },
          patient_id: { type: SchemaType.NUMBER, description: "Patient ID" },
          section: { 
            type: SchemaType.STRING,
            enum: ['biomarkers', 'workout', 'yoga', 'mental', 'diet_medication'],
            description: "Health section this insight belongs to"
          },
          insight_data: {
            type: SchemaType.OBJECT,
            properties: {
              title: { type: SchemaType.STRING },
              metrics: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    name: { type: SchemaType.STRING },
                    current: { type: SchemaType.NUMBER },
                    previous: { type: SchemaType.NUMBER, nullable: true },
                    change: { type: SchemaType.STRING },
                    unit: { type: SchemaType.STRING }
                  },
                  required: ["name", "current", "change", "unit"]
                }
              },
              analysis: { type: SchemaType.STRING },
              recommendations: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING }
              },
              status: {
                type: SchemaType.STRING,
                enum: ['improving', 'declining', 'stable']
              },
              priority: {
                type: SchemaType.STRING,
                enum: ['high', 'medium', 'low']
              }
            },
            required: ["title", "metrics", "analysis", "recommendations", "status", "priority"]
          }
        },
        required: ["patient_id", "section", "insight_data"]
      }
    },
    generated_at: { type: SchemaType.STRING }
  },
  required: ["insights", "generated_at"]
};

const cleanJsonResponse = (text: string) => {
  // Find the first '{' and last '}'
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  
  // Check if we found valid JSON markers
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('No valid JSON object found in response');
  }
  
  // Extract just the JSON part
  return text.slice(jsonStart, jsonEnd + 1);
};

export const generateHealthInsights = async (
  request: InsightGenerationRequest
): Promise<InsightGenerationResponse> => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
  };

  // Create a chat session with the generation config
  const chatSession = model.startChat({
    generationConfig,
    history: []
  });

  try {
    const prompt = generateInsightPrompt(request);
    const result = await chatSession.sendMessage(prompt);
    const text = result.response.text();
    
    // Clean and parse the response
    try {
      // First clean any markdown formatting
      const cleanedJson = cleanJsonResponse(text);
      console.log('Cleaned JSON:', cleanedJson); // For debugging
      
      // Then parse the cleaned JSON
      const parsedResponse = JSON.parse(cleanedJson) as InsightGenerationResponse;
      return {
        insights: parsedResponse.insights,
        generated_at: parsedResponse.generated_at || new Date().toISOString()
      };
    } catch (e) {
      console.error('Failed to parse LLM response:', e);
      console.error('Raw response:', text); // For debugging
      throw new Error('Invalid insight generation response format');
    }
  } catch (e) {
    console.error('Failed to generate insights:', e);
    throw e;
  }
};

// Helper function to generate insights for specific section
export const generateSectionInsights = async (
  request: InsightGenerationRequest,
  section: HealthSection
): Promise<InsightGenerationResponse> => {
  // Filter data to only include specified section
  const filteredData = {
    ...request,
    data: {
      [section]: request.data[section as keyof typeof request.data]
    }
  };

  return generateHealthInsights(filteredData);
};
