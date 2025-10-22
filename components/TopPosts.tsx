interface TopPostsProps {
  posts: { post_slug: string; count: number }[];
}

export default function TopPosts({ posts }: TopPostsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Top Posts by Comments
      </h2>
      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No posts with comments yet
        </p>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post.post_slug}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="flex-shrink-0 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </span>
                <span className="text-gray-900 dark:text-white font-medium truncate">
                  {post.post_slug}
                </span>
              </div>
              <span className="ml-4 flex-shrink-0 px-3 py-1 bg-brand/10 text-brand rounded-full text-sm font-semibold">
                {post.count} {post.count === 1 ? 'comment' : 'comments'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

