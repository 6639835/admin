import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: 获取所有评论数据
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    let query = supabaseAdmin
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false });

    // 按状态过滤
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // 搜索功能
    if (search) {
      query = query.or(`author_name.ilike.%${search}%,author_email.ilike.%${search}%,content.ilike.%${search}%,post_slug.ilike.%${search}%`);
    }

    // 限制数量
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ comments: data || [], count: data?.length || 0 });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

