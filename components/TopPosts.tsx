import { MessageSquare } from 'lucide-react';

interface TopPostsProps {
  posts: { post_slug: string; count: number }[];
}

export default function TopPosts({ posts }: TopPostsProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--c-brand)]/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-[var(--c-brand)]" />
        </div>
        <h2 className="text-xl font-bold text-primary">
          Top Posts by Comments
        </h2>
      </div>
      {posts.length === 0 ? (
        <p className="text-tertiary text-center py-8">
          No posts with comments yet
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post, index) => (
            <div
              key={post.post_slug}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/30 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="flex-shrink-0 w-8 h-8 bg-[var(--c-brand)] text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                  {index + 1}
                </span>
                <span className="text-primary font-medium truncate group-hover:text-[var(--c-brand)] transition-colors">
                  {post.post_slug}
                </span>
              </div>
              <span className="ml-4 flex-shrink-0 px-3 py-1 bg-[var(--c-brand)]/10 text-[var(--c-brand)] rounded-full text-sm font-semibold">
                {post.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

