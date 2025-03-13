import { NextRequest } from 'next/server';
import { generateStreamResponse } from '@/lib/gemini/config';
import { ProductRecommendationTool } from '@/lib/tools/product-recommendation';
import { HealthAssessmentTool } from '@/lib/tools/health-assessment';

const productTool = new ProductRecommendationTool();
const healthTool = new HealthAssessmentTool();

export async function POST(req: NextRequest) {
  let sessionId = 'default';
  
  try {
    const { message, sessionId: rawSessionId } = await req.json();
    sessionId = rawSessionId || 'default';
    console.log('🔵 Chat request received:', { message, sessionId });

    if (!message || typeof message !== 'string') {
      return Response.json(
        { error: 'Invalid message format', success: false },
        { status: 400 }
      );
    }

    // First check for special tool responses
    const encoder = new TextEncoder();

    // Route the message based on session and intent
    console.log('🔍 Checking message routing for session:', sessionId);

    // First check if health assessment is active
    if (healthTool.hasActiveSession(sessionId)) {
      console.log('🏥 Routing to active health assessment');
      const response = await healthTool.processInput(message, sessionId);
      console.log('🏥 Health assessment response:', response);
      return Response.json(response);
    }

    // Try starting new health assessment if not active
    console.log('🔍 Checking for health assessment intent');
    const healthAssessment = await healthTool.processInput(message, sessionId);
    if (healthAssessment) {
      console.log('🏥 Starting new health assessment:', healthAssessment.step);
      return Response.json(healthAssessment);
    }

    // Try product recommendations if no health assessment
    console.log('🛍️ Checking for product recommendations');
    const productRecommendation = await productTool.getRecommendations(message);
    if (productRecommendation) {
      console.log('🛍️ Product recommendation found');
      return Response.json(productRecommendation);
    }

    // Finally, fallback to normal chat
    console.log('💬 Falling back to normal chat');
    const stream = new ReadableStream({
      async start(controller) {
        let isClosed = false;

        try {
          for await (const chunk of generateStreamResponse(message)) {
            // Check if controller is still active
            if (isClosed) {
              break;
            }

            // Validate chunk before sending
            if (chunk) {
              try {
                const encodedChunk = encoder.encode(chunk);
                await controller.enqueue(encodedChunk);
              } catch (encodeError) {
                console.error('Chunk encoding error:', encodeError);
                // Skip invalid chunk but continue streaming
                continue;
              }
            }
          }
        } catch (error) {
          console.error('Streaming Error:', error);
          if (!isClosed) {
            try {
              await controller.error(error);
            } catch (controllerError) {
              console.error('Controller error handling failed:', controllerError);
            }
          }
        } finally {
          if (!isClosed) {
            isClosed = true;
            try {
              await controller.close();
            } catch (closeError) {
              console.error('Error closing stream:', closeError);
            }
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    } catch (error: any) {
      const errorDetails = {
        message: error.message || 'Failed to process chat message',
        session_id: sessionId,
        stack: error.stack
      };
      console.error('❌ Chat API Error:', errorDetails);
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
