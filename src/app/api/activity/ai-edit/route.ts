import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { ScheduleActivity } from '@/lib/types/health';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Create base model instance
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40
  }
});

export async function POST(req: Request) {
  try {
    const { activity, prompt } = await req.json();

    const activityType = activity.type;
    
    // Create a context-aware system prompt based on activity type
    const systemPrompt = `You are an AI assistant helping a healthcare practitioner modify a ${activityType} activity in a patient's schedule. 
The changes must maintain medical accuracy and follow best practices.
Given the current activity data and the practitioner's requested changes, generate updated activity data that:
1. Maintains the same data structure
2. Is medically appropriate and safe
3. Includes proper explanations and evidence-based modifications

Current activity data:
${JSON.stringify(activity, null, 2)}

Format the response as valid JSON matching the activity structure, only including fields that should be changed.`;


    const result = await model.generateContent([
      {
        text: systemPrompt + `\n\nPractitioner's requested changes: ${prompt}\n\nResponse must be ONLY the JSON object with changes to apply, no other text or explanation.`
      }
    ]);

    const response = result.response;
    const text = response.text();
    
    // Parse the response as JSON, removing any additional text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }

    const changes = JSON.parse(jsonMatch[0]);

    // Validate that changes maintain the same basic structure
    if (changes.type && changes.type !== activity.type) {
      throw new Error('Activity type cannot be changed');
    }

    return NextResponse.json({ changes });
  } catch (error) {
    console.error('AI Edit Error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI edit request' },
      { status: 500 }
    );
  }
}
