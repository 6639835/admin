import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all page views from the database
    const { data: allViews, error } = await supabaseAdmin
      .from('page_views')
      .select('*')
      .order('view_count', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    // Ensure allViews is an array
    const views = allViews || [];

    // Calculate total views
    const totalViews = views.reduce((sum, view) => sum + (view.view_count || 0), 0);

    // Get top posts by views (top 10)
    const topPostsByViews = views.slice(0, 10).map(view => ({
      post_slug: view.post_slug || 'unknown',
      views: view.view_count || 0,
    }));

    // Get today's date range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Calculate views from posts updated today
    const todayViews = views.filter(view => {
      if (!view.updated_at) return false;
      const updatedDate = new Date(view.updated_at);
      return updatedDate >= today;
    });
    const viewsToday = todayViews.reduce((sum, view) => sum + (view.view_count || 0), 0);

    // Calculate views from posts updated this week
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekViews = views.filter(view => {
      if (!view.updated_at) return false;
      const updatedDate = new Date(view.updated_at);
      return updatedDate >= weekAgo;
    });
    const viewsThisWeek = weekViews.reduce((sum, view) => sum + (view.view_count || 0), 0);

    // Calculate views from posts updated this month
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthViews = views.filter(view => {
      if (!view.updated_at) return false;
      const updatedDate = new Date(view.updated_at);
      return updatedDate >= monthAgo;
    });
    const viewsThisMonth = monthViews.reduce((sum, view) => sum + (view.view_count || 0), 0);

    return NextResponse.json({
      totalViews,
      topPostsByViews,
      viewsToday,
      viewsThisWeek,
      viewsThisMonth,
    });
  } catch (error) {
    console.error('Error fetching views:', error);
    return NextResponse.json(
      { error: 'Failed to fetch views statistics' },
      { status: 500 }
    );
  }
}

