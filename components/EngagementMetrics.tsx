interface EngagementData {
  post_slug: string;
  views: number;
  comments: number;
  approved_comments: number;
  pending_comments: number;
  spam_comments: number;
  engagement_rate: number;
}

interface EngagementMetricsProps {
  data: EngagementData[];
}

export default function EngagementMetrics({ data }: EngagementMetricsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Post Engagement Metrics
      </h2>
      {data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No engagement data available yet
        </p>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Top posts by engagement rate (comments per 100 views)
          </div>
          {data.map((post, index) => (
            <div
              key={post.post_slug}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium truncate">
                    {post.post_slug}
                  </span>
                </div>
                <span className="ml-4 flex-shrink-0 px-3 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold">
                  {post.engagement_rate.toFixed(2)}% engagement
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Views:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{post.views.toLocaleString()}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Comments:</span>{' '}
                  <span className="text-gray-900 dark:text-white">{post.comments}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Approved:</span>{' '}
                  <span className="text-green-600 dark:text-green-400">{post.approved_comments}</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Pending:</span>{' '}
                  <span className="text-yellow-600 dark:text-yellow-400">{post.pending_comments}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

