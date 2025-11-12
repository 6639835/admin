import type { Comment } from '@/types/comment';
import { MessageSquare } from 'lucide-react';

interface RecentCommentsProps {
  comments: Comment[];
}

export default function RecentComments({ comments }: RecentCommentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'spam':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-400';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--c-brand)]/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-[var(--c-brand)]" />
        </div>
        <h2 className="text-xl font-bold text-primary">
          Recent Comments
        </h2>
      </div>
      {comments.length === 0 ? (
        <p className="text-tertiary text-center py-8">
          No comments yet
        </p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-50 dark:bg-slate-800/30 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary truncate">
                    {comment.author_name}
                  </p>
                  <p className="text-xs text-tertiary truncate">
                    {comment.post_slug}
                  </p>
                </div>
                <span className={`ml-2 flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comment.status)}`}>
                  {comment.status}
                </span>
              </div>
              <p className="text-sm text-secondary line-clamp-2">
                {comment.content}
              </p>
              <p className="mt-2 text-xs text-tertiary">
                {new Date(comment.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

