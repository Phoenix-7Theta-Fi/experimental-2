import { healthAssessmentModel, healthReportModel } from '../gemini/config';

interface HealthAssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  context: string;
}

interface HealthAssessmentReport {
  summary: string;
  recommendations: string[];
  riskFactors: string[];
}

export interface HealthAssessmentResponse {
  type: 'health_assessment';
  step: number;
  totalSteps: number;
  question: HealthAssessmentQuestion | null;
  isComplete: boolean;
  report?: HealthAssessmentReport;
}

export class HealthAssessmentTool {
  private sessions: Map<string, {
    step: number;
    answers: string[];
    context: string;
    active: boolean;
  }>;

  constructor() {
    this.sessions = new Map();
  }

  public hasActiveSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    return session?.active ?? false;
  }

  async processInput(userInput: string, sessionId: string): Promise<HealthAssessmentResponse | null> {
    console.log('Processing input:', { userInput, sessionId });
    console.log('Current sessions:', Array.from(this.sessions.keys()));

    // Handle existing sessions first
    if (this.hasActiveSession(sessionId)) {
      console.log('Found existing session');
      const session = this.sessions.get(sessionId)!;
      
      // Add the answer to the session
      session.answers.push(userInput);
      session.context = this.updateContext(session.context, session.step - 1, userInput);
      
      // Check if assessment is complete
      if (session.step >= 10) {
        const report = await this.generateReport(session.answers);
        session.active = false;
        this.sessions.set(sessionId, session);
        return {
          type: 'health_assessment',
          step: 10,
          totalSteps: 10,
          question: null,
          isComplete: true,
          report
        };
      }

      // Generate next question
      // Generate next question with logging
      console.log('Generating next question for step:', session.step);
      const nextQuestion = await this.generateQuestion(session.context, session.step);
      console.log('Generated question:', nextQuestion);
      
      session.step++;
      session.active = true;
      this.sessions.set(sessionId, session);
      console.log('Updated session state:', session);
      
      return {
        type: 'health_assessment',
        step: session.step,
        totalSteps: 10,
        question: nextQuestion,
        isComplete: false
      };
    }

    // Start new assessment if intent detected
    if (this.hasHealthAssessmentIntent(userInput)) {
      console.log('Starting new assessment session');
      const session = this.initializeSession();
      
      // Start with first question
      const nextQuestion = await this.generateQuestion(session.context, session.step);
      session.step++;
      this.sessions.set(sessionId, session);
      
      console.log('Session initialized with first question:', {
        sessionId,
        session,
        question: nextQuestion
      });

      return {
        type: 'health_assessment',
        step: session.step,
        totalSteps: 10,
        question: nextQuestion,
        isComplete: false
      };
    }

    // Not an assessment-related input
    return null;
  }

  private initializeSession() {
    return {
      step: 0,
      answers: [],
      context: '',
      active: true
    };
  }

  private hasHealthAssessmentIntent(userInput: string): boolean {
    if (!userInput) return false;
    console.log('Checking health assessment intent:', userInput);
    const input = userInput.toLowerCase();
    
    // Static keywords
    const staticKeywords = [
      'health assessment',
      'health check',
      'evaluate my health',
      'check my health',
      'health evaluation',
      'analyze my health'
    ];

    // Pattern-based matches
    const patterns = [
      'need.*health.*assessment',
      'want.*health.*check',
      'assess.*health',
      'evaluate.*health',
      'check.*health',
      'health.*status',
      'examine.*health'
    ];

    // Check static keywords
    const hasStaticMatch = staticKeywords.some(keyword => 
      input.includes(keyword.toLowerCase())
    );

    // Check patterns
    const hasPatternMatch = patterns.some(pattern => {
      const regex = new RegExp(pattern);
      return regex.test(input);
    });

    const result = hasStaticMatch || hasPatternMatch;
    console.log('Intent detection result:', result);
    return result;
  }

  private async generateQuestion(context: string, step: number): Promise<HealthAssessmentQuestion> {
    console.log('Generating question for step:', step);
    const basePrompt = `Generate a health assessment question (${step + 1}/10) that is contextually relevant to: "${context || 'Initial assessment'}"

Focus area: ${
  step < 3 ? 'general health status and symptoms' : 
  step < 5 ? 'lifestyle habits (exercise, diet, sleep)' :
  step < 7 ? 'mental wellbeing and stress levels' :
  'medical history and risk factors'
}

Make sure the options cover a comprehensive range of possible answers.

Response must be in JSON format with exactly this structure:
{
  "question": "your specific health question here",
  "options": ["option1", "option2", "option3", "option4", "option5", "option6"]
}`;

    try {
      const result = await healthAssessmentModel.generateContent(basePrompt);
      const response = await result.response.text();
      const parsedResponse = JSON.parse(response);

      return {
        id: step + 1,
        question: parsedResponse.question,
        options: parsedResponse.options,
        context
      };
    } catch (error) {
      console.error('Error generating question:', error);
      // Fallback question in case of error
      return {
        id: step + 1,
        question: "How would you rate your overall health?",
        options: [
          "Excellent - No health issues",
          "Very Good - Minor health concerns",
          "Good - Some health issues but manageable",
          "Fair - Multiple health concerns",
          "Poor - Significant health issues",
          "Other (please specify)"
        ],
        context
      };
    }
  }

  private updateContext(currentContext: string, questionId: number, answer: string): string {
    return `${currentContext}\nQ${questionId + 1}: ${answer}`;
  }

  private fallbackReport: HealthAssessmentReport = {
    summary: "Based on your responses, several health concerns have been identified that require attention.",
    recommendations: [
      "Schedule an immediate follow-up with your healthcare provider",
      "Keep a detailed log of your symptoms",
      "Maintain regular sleep schedule",
      "Stay hydrated and maintain a balanced diet",
      "Monitor any changes in symptoms"
    ],
    riskFactors: [
      "Current health status needs professional evaluation",
      "Presence of severe symptoms requiring medical attention",
      "Potential impact on daily activities"
    ]
  };

  private async generateReport(answers: string[]): Promise<HealthAssessmentReport> {
    console.log('Generating final health report');
    
    const reportPrompt = `Based on this health assessment, provide a comprehensive analysis:

Patient Responses:
${answers.map((answer, index) => `Q${index + 1}: ${answer}`).join('\n')}

Instructions:
1. Analyze physical health, lifestyle, mental wellbeing, and medical risks
2. Provide actionable, specific recommendations
3. Focus on immediate concerns and long-term health goals
4. Consider symptom severity and frequency
5. Note any potential red flags or urgent concerns

Generate a structured report with a clear summary, practical recommendations, and identified risk factors.`;

    try {
      console.log('Sending report prompt to AI model');
      const result = await healthReportModel.generateContent(reportPrompt);
      const response = await result.response.text();
      
      try {
        const parsedResponse = JSON.parse(response);
        console.log('Successfully generated report:', parsedResponse);
        
        // Validate required fields
        if (!parsedResponse.summary || !parsedResponse.recommendations || !parsedResponse.riskFactors) {
          console.warn('Missing required fields in report response');
          return this.fallbackReport;
        }

        return {
          summary: parsedResponse.summary,
          recommendations: parsedResponse.recommendations,
          riskFactors: parsedResponse.riskFactors
        };
      } catch (parseError) {
        console.error('Error parsing report response:', parseError);
        return this.fallbackReport;
      }
    } catch (error) {
      console.error('Error generating health report:', error);
      return this.fallbackReport;
    }
  }
}
