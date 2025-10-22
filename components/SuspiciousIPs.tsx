interface SuspiciousIP {
  ip: string;
  total: number;
  spam: number;
  approved: number;
  pending: number;
}

interface SuspiciousIPsProps {
  ips: SuspiciousIP[];
}

export default function SuspiciousIPs({ ips }: SuspiciousIPsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Suspicious IP Addresses
      </h2>
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        IP addresses with spam comments or high spam rates
      </div>
      {ips.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          No suspicious activity detected
        </p>
      ) : (
        <div className="space-y-3">
          {ips.map((ip) => {
            const spamRate = (ip.spam / ip.total) * 100;
            return (
              <div
                key={ip.ip}
                className={`p-4 rounded-lg border-2 ${
                  spamRate >= 50
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-gray-900 dark:text-white font-semibold">
                    {ip.ip}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    spamRate >= 50
                      ? 'bg-red-500 text-white'
                      : 'bg-orange-500 text-white'
                  }`}>
                    {spamRate.toFixed(0)}% spam
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Total:</span>{' '}
                    <span className="text-gray-900 dark:text-white">{ip.total}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Spam:</span>{' '}
                    <span className="text-red-600 dark:text-red-400">{ip.spam}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Approved:</span>{' '}
                    <span className="text-green-600 dark:text-green-400">{ip.approved}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Pending:</span>{' '}
                    <span className="text-yellow-600 dark:text-yellow-400">{ip.pending}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

