import { AlertTriangle } from 'lucide-react';

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
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-primary">
          Suspicious IP Addresses
        </h2>
      </div>
      <div className="mb-6 text-sm text-secondary">
        IP addresses with spam comments or high spam rates
      </div>
      {ips.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-3">
            <AlertTriangle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-tertiary">
            No suspicious activity detected
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ips.map((ip) => {
            const spamRate = (ip.spam / ip.total) * 100;
            return (
              <div
                key={ip.ip}
                className={`p-4 rounded-lg border-2 transition-all ${
                  spamRate >= 50
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-primary font-semibold">
                    {ip.ip}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                    spamRate >= 50
                      ? 'bg-red-500 text-white'
                      : 'bg-orange-500 text-white'
                  }`}>
                    {spamRate.toFixed(0)}% spam
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-xs">
                  <div className="text-secondary">
                    <span className="font-medium">Total:</span>{' '}
                    <span className="text-primary">{ip.total}</span>
                  </div>
                  <div className="text-secondary">
                    <span className="font-medium">Spam:</span>{' '}
                    <span className="text-red-600 dark:text-red-400 font-semibold">{ip.spam}</span>
                  </div>
                  <div className="text-secondary">
                    <span className="font-medium">Approved:</span>{' '}
                    <span className="text-green-600 dark:text-green-400">{ip.approved}</span>
                  </div>
                  <div className="text-secondary">
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

