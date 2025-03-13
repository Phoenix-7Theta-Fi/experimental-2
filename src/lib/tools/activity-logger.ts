import { activityLoggerModel } from '../gemini/config';
import * as ActivitySessions from '../db/activity-sessions';
import type { ActivitySession } from '../db/activity-sessions';

export interface ActivityLogMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ActivityLogResponse {
  type: 'activity_log';
  message: string;
  isComplete: boolean;
  report?: ActivityLogReport;
}

interface ActivityLogReport {
  summary: string;
  insights: string[];
  effectiveness: number;
  recommendations: string[];
}

export class ActivityLoggerTool {
  public hasActiveSession(sessionId: string): boolean {
    const session = ActivitySessions.getSession(sessionId);
    return session?.status === 'ACTIVE';
  }

  public async startSession(
    sessionId: string,
    activityId: number,
    activityType: string
  ): Promise<ActivityLogResponse> {
    console.log('Starting activity log session:', { sessionId, activityId, activityType });

    // Check if session already exists and is active
    const existingSession = ActivitySessions.getSession(sessionId);
    if (existingSession?.status === 'ACTIVE') {
      console.log('Session already active:', { sessionId });
      throw new Error('Session already exists');
    }

    try {
      // Initialize new session
      const session: ActivitySession = {
        id: sessionId,
        status: 'STARTING',
        activityId,
        activityType,
        startTime: Date.now(),
        lastActivity: Date.now(),
        conversation: []
      };

      ActivitySessions.upsertSession(sessionId, session);

      // Generate opening question
      const prompt = `As an empathetic health coach, ask a single question about their completed ${activityType} activity.

REQUIREMENTS:
- Focus on physical and emotional effects
- Show understanding of ${activityType}'s health impacts
- Use a warm, supportive tone
- Keep it natural and conversational

FORMAT:
- NO prefixes like "Here's a question" or "I would like to ask"
- NO explanations or meta-text
- JUST the question itself

Example:
"How did this ${activityType} session feel compared to your usual routine?"

YOUR RESPONSE MUST BE ONLY THE QUESTION.`;

      const result = await activityLoggerModel.generateContent(prompt);
      const question = await result.response.text();

      // Clean up response
      const cleanedQuestion = question
        .replace(/^(okay|here|now|let me|i would like to|allow me).*?[,:]/i, '')
        .replace(/^["']|["']$/g, '')
        .replace(/\n/g, ' ')
        .trim();

      // Update session with first message
      session.status = 'ACTIVE';
      session.conversation.push({
        role: 'assistant',
        content: cleanedQuestion
      });
      ActivitySessions.upsertSession(sessionId, session);

      return {
        type: 'activity_log' as const,
        message: cleanedQuestion,
        isComplete: false
      };

    } catch (error) {
      console.error('Error starting session:', error);
      // Clean up session if it exists
      ActivitySessions.deleteSession(sessionId);
      throw error;
    }
  }

  public async processInput(
    message: string,
    sessionId: string
  ): Promise<ActivityLogResponse> {
    const session = ActivitySessions.getSession(sessionId);

    if (!session || session.status !== 'ACTIVE') {
      console.warn('No active session found:', { sessionId, status: session?.status });
      throw new Error('No active session found');
    }

    // Add message to conversation
    session.conversation.push({ role: 'user', content: message });
    session.lastActivity = Date.now();
    ActivitySessions.upsertSession(sessionId, session);

    try {
      // Generate AI response
      const prompt = `As a health coach discussing a ${session.activityType} activity, provide a natural response that:

Previous conversation:
${session.conversation.map(m => `${m.role}: ${m.content}`).join('\n')}

REQUIREMENTS:
- Flow naturally from their response
- Stay supportive and encouraging
- Focus on understanding their experience
- Build on previous responses

FORMAT:
- NO prefixes or meta-text
- JUST your response

YOUR RESPONSE MUST BE CONVERSATIONAL AND DIRECT.`;

      const result = await activityLoggerModel.generateContent(prompt);
      const response = await result.response.text();

      const cleanedResponse = response
        .replace(/^(okay|here|now|let me|i would like to|allow me).*?[,:]/i, '')
        .replace(/^["']|["']$/g, '')
        .replace(/\n/g, ' ')
        .trim();

      session.conversation.push({
        role: 'assistant',
        content: cleanedResponse
      });
      ActivitySessions.upsertSession(sessionId, session);

      // Check if we should complete the session
      const shouldComplete = session.conversation.length >= 6;

      if (shouldComplete) {
        return await this.generateFinalReport(session);
      }

      return {
        type: 'activity_log' as const,
        message: cleanedResponse,
        isComplete: false
      };

    } catch (error) {
      console.error('Error processing input:', error);
      throw error;
    }
  }

  private async generateFinalReport(session: ActivitySession): Promise<ActivityLogResponse> {
    const prompt = `Analyze this ${session.activityType} activity conversation and generate a structured report.

Conversation:
${session.conversation.map(m => `${m.role}: ${m.content}`).join('\n')}

Required format (exactly this structure):
{
  "summary": "2-3 sentence summary of activity and outcomes",
  "insights": ["3-4 key observations about impact and execution"],
  "effectiveness": 0-100 score based on positive outcomes,
  "recommendations": ["2-3 specific suggestions for future activities"]
}`;

    try {
      session.status = 'ENDING';
      ActivitySessions.upsertSession(session.id, session);

      const result = await activityLoggerModel.generateContent(prompt);
      const reportData = JSON.parse(await result.response.text());

      // Mark session as closed
      session.status = 'CLOSED';
      ActivitySessions.upsertSession(session.id, session);

      return {
        type: 'activity_log' as const,
        message: "Thanks for sharing! I've prepared a summary of your activity.",
        isComplete: true,
        report: reportData
      };
    } catch (error) {
      console.error('Error generating report:', error);
      
      // Still mark session as closed even if report generation fails
      session.status = 'CLOSED';
      ActivitySessions.upsertSession(session.id, session);

      return {
        type: 'activity_log' as const,
        message: "I've completed processing your activity.",
        isComplete: true,
        report: {
          summary: "Activity completed with limited data available",
          insights: ["Unable to generate detailed insights"],
          effectiveness: 50,
          recommendations: ["Consider providing more detailed responses in future logs"]
        }
      };
    }
  }

  public endSession(sessionId: string): void {
    const session = ActivitySessions.getSession(sessionId);
    if (session) {
      session.status = 'CLOSED';
      ActivitySessions.upsertSession(sessionId, session);
      console.log('Session ended:', { sessionId, finalStatus: 'CLOSED' });
    }
  }
}
