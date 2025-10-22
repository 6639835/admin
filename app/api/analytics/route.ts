import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch all comments and views
    const [commentsRes, viewsRes] = await Promise.all([
      supabaseAdmin
        .from('comments')
        .select('post_slug, status, author_email, ip_address, created_at'),
      supabaseAdmin
        .from('page_views')
        .select('post_slug, view_count')
    ]);

    if (commentsRes.error) throw commentsRes.error;
    if (viewsRes.error) throw viewsRes.error;

    const comments = commentsRes.data || [];
    const views = viewsRes.data || [];

    // Calculate engagement metrics per post
    const postEngagement = new Map();

    // Add views data
    views.forEach(view => {
      if (!postEngagement.has(view.post_slug)) {
        postEngagement.set(view.post_slug, {
          post_slug: view.post_slug,
          views: 0,
          comments: 0,
          approved_comments: 0,
          pending_comments: 0,
          spam_comments: 0,
          engagement_rate: 0,
        });
      }
      const data = postEngagement.get(view.post_slug);
      data.views = view.view_count;
    });

    // Add comments data
    comments.forEach(comment => {
      if (!postEngagement.has(comment.post_slug)) {
        postEngagement.set(comment.post_slug, {
          post_slug: comment.post_slug,
          views: 0,
          comments: 0,
          approved_comments: 0,
          pending_comments: 0,
          spam_comments: 0,
          engagement_rate: 0,
        });
      }
      const data = postEngagement.get(comment.post_slug);
      data.comments++;
      if (comment.status === 'approved') data.approved_comments++;
      if (comment.status === 'pending') data.pending_comments++;
      if (comment.status === 'spam') data.spam_comments++;
    });

    // Calculate engagement rate (comments per 100 views)
    const engagementData = Array.from(postEngagement.values()).map(post => ({
      ...post,
      engagement_rate: post.views > 0 ? (post.comments / post.views) * 100 : 0,
    }));

    // Sort by engagement rate
    const topEngagement = [...engagementData]
      .sort((a, b) => b.engagement_rate - a.engagement_rate)
      .slice(0, 10);

    // Top commenters
    const commenterMap = new Map();
    comments.forEach(comment => {
      const key = comment.author_email;
      if (!commenterMap.has(key)) {
        commenterMap.set(key, {
          email: comment.author_email,
          total_comments: 0,
          approved: 0,
          pending: 0,
          spam: 0,
        });
      }
      const data = commenterMap.get(key);
      data.total_comments++;
      if (comment.status === 'approved') data.approved++;
      if (comment.status === 'pending') data.pending++;
      if (comment.status === 'spam') data.spam++;
    });

    const topCommenters = Array.from(commenterMap.values())
      .sort((a, b) => b.total_comments - a.total_comments)
      .slice(0, 10);

    // Spam detection - IPs with multiple spam comments
    const ipMap = new Map();
    comments.forEach(comment => {
      if (comment.ip_address) {
        if (!ipMap.has(comment.ip_address)) {
          ipMap.set(comment.ip_address, {
            ip: comment.ip_address,
            total: 0,
            spam: 0,
            approved: 0,
            pending: 0,
          });
        }
        const data = ipMap.get(comment.ip_address);
        data.total++;
        if (comment.status === 'spam') data.spam++;
        if (comment.status === 'approved') data.approved++;
        if (comment.status === 'pending') data.pending++;
      }
    });

    const suspiciousIPs = Array.from(ipMap.values())
      .filter(ip => ip.spam > 0 || (ip.total >= 5 && ip.spam / ip.total > 0.3))
      .sort((a, b) => b.spam - a.spam)
      .slice(0, 20);

    // Activity by hour (0-23)
    const activityByHour = Array(24).fill(0);
    comments.forEach(comment => {
      const hour = new Date(comment.created_at).getHours();
      activityByHour[hour]++;
    });

    // Activity by day of week (0-6, Sunday-Saturday)
    const activityByDay = Array(7).fill(0);
    comments.forEach(comment => {
      const day = new Date(comment.created_at).getDay();
      activityByDay[day]++;
    });

    return NextResponse.json({
      engagementData,
      topEngagement,
      topCommenters,
      suspiciousIPs,
      activityByHour,
      activityByDay,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

