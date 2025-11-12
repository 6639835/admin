import { Eye } from 'lucide-react';

interface TopPostsByViewsProps {
  posts: { post_slug: string; views: number }[];
}

export default function TopPostsByViews({ posts }: TopPostsByViewsProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-primary">
          Top Posts by Views
        </h2>
      </div>
      {posts.length === 0 ? (
        <p className="text-tertiary text-center py-8">
          No view data available yet
        </p>
      ) : (
        <div className="space-y-3">
          {posts.map((post, index) => (
            <div
              key={post.post_slug}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/30 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                  {index + 1}
                </span>
                <span className="text-primary font-medium truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {post.post_slug}
                </span>
              </div>
              <span className="ml-4 flex-shrink-0 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {post.views.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

