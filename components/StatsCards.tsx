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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Views',
      value: viewStats?.totalViews || 0,
      icon: Eye,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      title: 'Approved',
      value: stats.approvedComments,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Pending',
      value: stats.pendingComments,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'Spam',
      value: stats.spamComments,
      icon: Ban,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-600 dark:text-red-400',
    },
    {
      title: 'Comments Today',
      value: stats.commentsToday,
      icon: Calendar,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-500/10',
      textColor: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      title: 'This Week',
      value: stats.commentsThisWeek,
      icon: BarChart3,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-500/10',
      textColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'This Month',
      value: stats.commentsThisMonth,
      icon: TrendingUp,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-600 dark:text-pink-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="card card-hover p-6 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-tertiary group-hover:text-secondary transition-colors">
                {card.title}
              </p>
              <p className="mt-2 text-3xl font-bold text-primary">
                {card.value.toLocaleString()}
              </p>
            </div>
            <div className={`${card.bgColor} w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ml-4`}>
              <card.icon className={`w-6 h-6 ${card.textColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

