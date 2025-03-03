import { getUserSession } from '@/lib/auth';
import { toggleLike } from '@/lib/db/tweets';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const tweetId = parseInt(params.id);
    if (isNaN(tweetId)) {
      return new NextResponse('Invalid tweet ID', { status: 400 });
    }

    const liked = toggleLike(tweetId, userId);
    
    return NextResponse.json({ liked });
  } catch (error) {
    console.error('Error toggling like:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
