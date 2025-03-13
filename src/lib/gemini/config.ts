import { GoogleGenerativeAI } from '@google/generative-ai';
import { ProductRecommendationTool } from '../tools/product-recommendation';
import type { ActivityLogResponse } from '../tools/activity-logger';

// Schema type definitions
const SchemaType = {
  OBJECT: 'object',
  STRING: 'string',
  ARRAY: 'array'
} as const;

// Initialize the Gemini API client and tools
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Model for activity logging
export const activityLoggerModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
  },
});

// Base chat model
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Question schema for health assessment
const healthAssessmentSchema = {
  type: SchemaType.OBJECT,
  properties: {
    question: {
      type: SchemaType.STRING,
      description: "The health assessment question",
    },
    options: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
      minItems: 6,
      maxItems: 6,
      description: "Exactly 6 multiple choice options",
    },
  },
  required: ["question", "options"],
  propertyOrdering: ["question", "options"],
};

export const healthAssessmentModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: healthAssessmentSchema,
  },
});

const productTool = new ProductRecommendationTool();

// Function to generate streaming responses
export const generateStreamResponse = async function*(message: string) {
  try {
    // First, check for product recommendations
    const productRecommendation = await productTool.getRecommendations(message);
    
    if (productRecommendation) {
      // If we have product recommendations, yield them first as a special message
      yield JSON.stringify({
        type: 'product_recommendation',
        content: productRecommendation
      }) + '\n';
    }

    // Generate AI response
    const prompt = `As a medical assistant in a patient portal: ${message}${
      productRecommendation ? '\nI see you are interested in products. I will provide information along with the product recommendations shown above.' : ''
    }`;
    
    const result = await model.generateContentStream([{ text: prompt }]);
    
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        // Wrap regular text responses in a structured format
        yield JSON.stringify({
          type: 'text',
          content: text
        }) + '\n';
      }
    }
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
};

// Report schema for final health assessment
const healthReportSchema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.STRING,
      description: "A concise summary of overall health status"
    },
    recommendations: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING
      },
      description: "List of actionable health recommendations"
    },
    riskFactors: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING
      },
      description: "List of identified health risk factors"
    }
  },
  required: ["summary", "recommendations", "riskFactors"],
  propertyOrdering: ["summary", "recommendations", "riskFactors"]
};

// Model for generating health reports
export const healthReportModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: healthReportSchema,
  },
});

export default model;

export { healthAssessmentSchema, healthReportSchema };

// Re-export types
export type { ActivityLogResponse };
