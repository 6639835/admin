import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { CommentStats, ChartDataPoint } from '@/types/comment';

export async function GET() {
  try {
    // 获取所有评论
    const { data: allComments, error } = await supabaseAdmin
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    // 计算统计数据
    const totalComments = allComments?.length || 0;
    const approvedComments = allComments?.filter(c => c.status === 'approved').length || 0;
    const pendingComments = allComments?.filter(c => c.status === 'pending').length || 0;
    const spamComments = allComments?.filter(c => c.status === 'spam').length || 0;

    const commentsToday = allComments?.filter(c => 
      new Date(c.created_at) >= today
    ).length || 0;

    const commentsThisWeek = allComments?.filter(c => 
      new Date(c.created_at) >= weekAgo
    ).length || 0;

    const commentsThisMonth = allComments?.filter(c => 
      new Date(c.created_at) >= monthAgo
    ).length || 0;

    // 统计每个文章的评论数
    const postCounts = allComments?.reduce((acc, comment) => {
      acc[comment.post_slug] = (acc[comment.post_slug] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPosts = Object.entries(postCounts || {})
      .map(([post_slug, count]) => ({ post_slug, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 获取最近的评论
    const recentComments = allComments?.slice(0, 10) || [];

    // 生成过去30天的图表数据
    const chartData: ChartDataPoint[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = allComments?.filter(c => {
        const commentDate = new Date(c.created_at).toISOString().split('T')[0];
        return commentDate === dateStr;
      }).length || 0;

      chartData.push({
        date: dateStr,
        count,
      });
    }

    const stats: CommentStats & { chartData: ChartDataPoint[] } = {
      totalComments,
      approvedComments,
      pendingComments,
      spamComments,
      commentsToday,
      commentsThisWeek,
      commentsThisMonth,
      topPosts,
      recentComments,
      chartData,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

