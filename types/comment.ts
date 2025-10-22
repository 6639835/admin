export interface Comment {
  id: number;
  post_slug: string;
  content: string;
  author_name: string;
  author_email: string;
  parent_id?: number;
  status: 'pending' | 'approved' | 'spam';
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  updated_at: string;
}

export interface CommentStats {
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  spamComments: number;
  commentsToday: number;
  commentsThisWeek: number;
  commentsThisMonth: number;
  topPosts: { post_slug: string; count: number }[];
  recentComments: Comment[];
}

export interface ChartDataPoint {
  date: string;
  count: number;
}

export interface ViewStats {
  totalViews: number;
  topPostsByViews: { post_slug: string; views: number }[];
  viewsToday: number;
  viewsThisWeek: number;
  viewsThisMonth: number;
}

