import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { action, commentIds } = await request.json();

    if (!action || !commentIds || !Array.isArray(commentIds) || commentIds.length === 0) {
      return NextResponse.json(
        { error: 'Action and commentIds array are required' },
        { status: 400 }
      );
    }

    if (action === 'delete') {
      const { error } = await supabaseAdmin
        .from('comments')
        .delete()
        .in('id', commentIds);

      if (error) throw error;
    } else if (['pending', 'approved', 'spam'].includes(action)) {
      const { error } = await supabaseAdmin
        .from('comments')
        .update({ status: action, updated_at: new Date().toISOString() })
        .in('id', commentIds);

      if (error) throw error;
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, count: commentIds.length });
  } catch (error) {
    console.error('Error in bulk action:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk action' },
      { status: 500 }
    );
  }
}

