import { NextResponse } from 'next/server';
import { 
  getDailySchedule, 
  updateActivity, 
  addActivity, 
  deleteActivity, 
  reorderActivities 
} from '@/lib/db/daily-schedule';
import { getUserSession } from '@/lib/auth';
import { TreatmentPlan, ScheduleActivity } from '@/lib/types/health';
import { getUserTreatmentPlan } from '@/lib/db/treatment-plans';
import { generateActivityDetails } from '@/lib/utils/activity-benefits';

export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const date = searchParams.get('date');

    if (!userId || !date) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const schedule = await getDailySchedule(parseInt(userId), date);
    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    // Get treatment plan to sync with schedule
    const treatmentPlan = await getUserTreatmentPlan(parseInt(userId));
    if (!treatmentPlan) {
      return NextResponse.json({ error: 'Treatment plan not found' }, { status: 404 });
    }

    // Update the activities with treatment plan context if needed
    const updatedActivities = schedule.activities.map(activity => {
      if (!activity.details?.benefits) {
        const details = generateActivityDetails(activity, treatmentPlan);
        return {
          ...activity,
          details
        } as ScheduleActivity;
      }
      return activity;
    });

    schedule.activities = updatedActivities;

    return NextResponse.json(schedule);

  } catch (error) {
    console.error('Error in daily schedule API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scheduleId, activity } = body;

    if (!scheduleId || !activity) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get treatment plan to generate activity details
    const treatmentPlan = await getUserTreatmentPlan(activity.user_id);
    if (!treatmentPlan) {
      return NextResponse.json({ error: 'Treatment plan not found' }, { status: 404 });
    }

    // Generate proper details for the activity
    const activityWithDetails = {
      ...activity,
      details: generateActivityDetails(activity as ScheduleActivity, treatmentPlan)
    };

    const newActivity = await addActivity(scheduleId, activityWithDetails);
    return NextResponse.json({ activity: newActivity });

  } catch (error) {
    console.error('Error adding activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scheduleId, activityId, updates, reorder, activities } = body;

    if (!scheduleId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (reorder) {
      if (!activities) {
        return NextResponse.json(
          { error: 'Missing activities for reorder' },
          { status: 400 }
        );
      }
      await reorderActivities(scheduleId, activities);
    } else {
      if (!activityId || !updates) {
        return NextResponse.json(
          { error: 'Missing required parameters' },
          { status: 400 }
        );
      }

      // Validate updates structure
      if (updates.details) {
        // Ensure details structure is preserved
        const schedule = await getDailySchedule(body.userId, body.date);
        if (!schedule) {
          return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
        }

        const activity = schedule.activities.find(a => a.id === activityId);
        if (!activity) {
          return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
        }

        // Merge existing details with updates
        updates.details = {
          ...activity.details,
          ...updates.details,
          benefits: updates.details.benefits ? {
            ...activity.details.benefits,
            ...updates.details.benefits
          } : activity.details.benefits
        };
      }

      await updateActivity(scheduleId, activityId, updates);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { scheduleId, activityId } = body;

    if (!scheduleId || !activityId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    await deleteActivity(scheduleId, activityId);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
