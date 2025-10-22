import type { CommentStats, ViewStats } from '@/types/comment';
import { MessageSquare, Eye, CheckCircle, Clock, Ban, Calendar, BarChart3, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: CommentStats;
  viewStats?: ViewStats;
}

export default function StatsCards({ stats, viewStats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Comments',
      value: stats.totalComments,
      icon: MessageSquare,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Views',
      value: viewStats?.totalViews || 0,
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      title: 'Approved',
      value: stats.approvedComments,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Pending',
      value: stats.pendingComments,
      icon: Clock,
      color: 'bg-yellow-500',
    },
    {
      title: 'Spam',
      value: stats.spamComments,
      icon: Ban,
      color: 'bg-red-500',
    },
    {
      title: 'Comments Today',
      value: stats.commentsToday,
      icon: Calendar,
      color: 'bg-cyan-500',
    },
    {
      title: 'This Week',
      value: stats.commentsThisWeek,
      icon: BarChart3,
      color: 'bg-indigo-500',
    },
    {
      title: 'This Month',
      value: stats.commentsThisMonth,
      icon: TrendingUp,
      color: 'bg-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {card.value}
              </p>
            </div>
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

