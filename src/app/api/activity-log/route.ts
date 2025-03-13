import { NextRequest } from 'next/server';
import { ActivityLoggerTool } from '@/lib/tools/activity-logger';

const activityLogger = new ActivityLoggerTool();

interface StartAction {
  action: 'start';
  activityId: number;
  activityType: string;
}

interface ChatAction {
  action: 'chat';
  message: string;
}

interface EndAction {
  action: 'end';
}

type ActivityLogAction = StartAction | ChatAction | EndAction;

export async function POST(request: NextRequest) {
  const sessionId = request.headers.get('x-session-id')?.trim();

  try {
    // Validate session ID
    if (!sessionId) {
      console.warn('❌ No session ID provided');
      return Response.json(
        {
          error: 'Session ID is required',
          success: false,
          details: { headers: Object.fromEntries(request.headers) }
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    console.log('🔵 Activity log request:', { sessionId, action: body.action });

    // Validate action
    if (!body.action || !['start', 'chat', 'end'].includes(body.action)) {
      console.warn('❌ Invalid action:', { sessionId, action: body.action });
      return Response.json(
        {
          error: 'Invalid action',
          success: false,
          details: { 
            received: body.action,
            allowedActions: ['start', 'chat', 'end']
          }
        },
        { status: 400 }
      );
    }

    // Handle each action type
    switch (body.action) {
      case 'start': {
        const { activityId, activityType } = body as StartAction;
        
        // Validate start parameters
        if (!activityId || !activityType || typeof activityId !== 'number' || typeof activityType !== 'string') {
          console.warn('❌ Invalid start parameters:', { sessionId, activityId, activityType });
          return Response.json(
            {
              error: 'Missing or invalid activity details',
              success: false,
              details: { activityId, activityType }
            },
            { status: 400 }
          );
        }

        // Check if session already exists
        if (activityLogger.hasActiveSession(sessionId)) {
          console.warn('❌ Session already active:', { sessionId });
          return Response.json(
            {
              error: 'Session already exists',
              success: false,
              details: { sessionId }
            },
            { status: 409 }
          );
        }

        const response = await activityLogger.startSession(sessionId, activityId, activityType);
        console.log('✅ Activity log session started:', { sessionId, response });

        return Response.json({
          ...response,
          success: true,
          sessionId
        });
      }

      case 'chat': {
        const { message } = body as ChatAction;

        // Validate message
        if (!message || typeof message !== 'string') {
          console.warn('❌ Invalid message format:', { sessionId, message });
          return Response.json(
            {
              error: 'Invalid message format',
              success: false,
              details: {
                received: message,
                expectedType: 'string',
                actualType: typeof message
              }
            },
            { status: 400 }
          );
        }

        // Check session status
        if (!activityLogger.hasActiveSession(sessionId)) {
          console.warn('❌ No active session found:', { sessionId });
          return Response.json(
            {
              error: 'No active session found',
              success: false,
              details: { sessionId }
            },
            { status: 404 }
          );
        }

        const response = await activityLogger.processInput(message, sessionId);
        console.log('✅ Chat response generated:', {
          sessionId,
          success: true,
          isComplete: response.isComplete,
          hasReport: !!response.report
        });

        return Response.json({
          ...response,
          success: true
        });
      }

      case 'end': {
        // Check session exists
        if (!activityLogger.hasActiveSession(sessionId)) {
          console.warn('❌ No active session found:', { sessionId });
          return Response.json(
            {
              error: 'No active session found',
              success: false,
              details: { sessionId }
            },
            { status: 404 }
          );
        }

        // End the session
        console.log('🔍 Ending session:', { sessionId });
        activityLogger.endSession(sessionId);
        console.log('✅ Session ended successfully:', { sessionId });

        return Response.json({
          success: true,
          message: 'Session ended successfully',
          details: { sessionId }
        });
      }
    }

  } catch (error: any) {
    const errorDetails = {
      message: error.message || 'Failed to process activity log request',
      session_id: sessionId,
      stack: error.stack
    };
    console.error('❌ Activity Log Error:', errorDetails);
    return Response.json(
      {
        error: errorDetails.message,
        success: false,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}