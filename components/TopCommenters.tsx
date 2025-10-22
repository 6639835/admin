interface Commenter {
  email: string;
  total_comments: number;
  approved: number;
  pending: number;
  spam: number;
}

interface TopCommentersProps {
  commenters: Commenter[];
}

export default function TopCommenters({ commenters }: TopCommentersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Top Commenters
      </h2>
      {commenters.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No commenter data available yet
        </p>
      ) : (
        <div className="space-y-3">
          {commenters.map((commenter, index) => (
            <div
              key={commenter.email}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium truncate">
                    {commenter.email}
                  </span>
                </div>
                <span className="ml-4 flex-shrink-0 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                  {commenter.total_comments} comments
                </span>
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {commenter.approved} approved
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {commenter.pending} pending
                  </span>
                </div>
                {commenter.spam > 0 && (
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {commenter.spam} spam
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

