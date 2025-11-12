'use client';

import { useState, useEffect } from 'react';
import type { CommentStats, ChartDataPoint, ViewStats } from '@/types/comment';
import StatsCards from './StatsCards';
import CommentsChart from './CommentsChart';
import TopPosts from './TopPosts';
import TopPostsByViews from './TopPostsByViews';
import CommentsList from './CommentsList';
import RecentComments from './RecentComments';
import EngagementMetrics from './EngagementMetrics';
import TopCommenters from './TopCommenters';
import SuspiciousIPs from './SuspiciousIPs';
import ActivityHeatmap from './ActivityHeatmap';
import ExportData from './ExportData';
import { BarChart3, MessageSquare, TrendingUp, Lock, Search, Zap, Shield, Mail, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<CommentStats & { chartData: ChartDataPoint[] } | null>(null);
  const [viewStats, setViewStats] = useState<ViewStats | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'comments' | 'analytics' | 'security'>('overview');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, viewsRes, analyticsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/views'),
        fetch('/api/analytics')
      ]);
      
      const statsData = await statsRes.json();
      const viewsData = await viewsRes.json();
      const analyticsData = await analyticsRes.json();
      
      setStats(statsData);
      
      // Only set view stats if the response is valid and not an error
      if (viewsRes.ok && viewsData && !viewsData.error) {
        setViewStats(viewsData);
      } else {
        console.error('Failed to fetch views:', viewsData?.error || 'Unknown error');
      }

      // Only set analytics if the response is valid
      if (analyticsRes.ok && analyticsData && !analyticsData.error) {
        setAnalytics(analyticsData);
      } else {
        console.error('Failed to fetch analytics:', analyticsData?.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Header Skeleton */}
        <header className="bg-white dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-200/5 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-48"></div>
            </div>
          </div>
        </header>

        {/* Content Skeleton */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-3"></div>
                      <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart Skeleton */}
            <div className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-48 mb-6"></div>
              <div className="h-80 bg-gray-200 dark:bg-slate-700 rounded"></div>
            </div>

            {/* Two Column Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40 mb-6"></div>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="h-16 bg-gray-200 dark:bg-slate-700 rounded"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-200/5 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                Blog Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-tertiary">
                Manage and visualize your blog comments
              </p>
            </div>
            <button
              onClick={fetchStats}
              className="btn-primary inline-flex items-center gap-2"
              aria-label="Refresh dashboard data"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          
          {/* Tabs */}
          <nav className="mt-6 flex gap-2 border-b border-gray-200 dark:border-slate-200/5 overflow-x-auto" aria-label="Dashboard sections">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'border-[var(--c-brand)] text-[var(--c-brand)]'
                  : 'border-transparent text-tertiary hover:text-secondary hover:border-gray-300 dark:hover:border-slate-600'
              }`}
              aria-current={activeTab === 'overview' ? 'page' : undefined}
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-3 px-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'comments'
                  ? 'border-[var(--c-brand)] text-[var(--c-brand)]'
                  : 'border-transparent text-tertiary hover:text-secondary hover:border-gray-300 dark:hover:border-slate-600'
              }`}
              aria-current={activeTab === 'comments' ? 'page' : undefined}
            >
              <MessageSquare className="w-4 h-4" />
              Comments
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 px-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'border-[var(--c-brand)] text-[var(--c-brand)]'
                  : 'border-transparent text-tertiary hover:text-secondary hover:border-gray-300 dark:hover:border-slate-600'
              }`}
              aria-current={activeTab === 'analytics' ? 'page' : undefined}
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 px-4 border-b-2 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'border-[var(--c-brand)] text-[var(--c-brand)]'
                  : 'border-transparent text-tertiary hover:text-secondary hover:border-gray-300 dark:hover:border-slate-600'
              }`}
              aria-current={activeTab === 'security' ? 'page' : undefined}
            >
              <Shield className="w-4 h-4" />
              Security
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <StatsCards stats={stats} viewStats={viewStats || undefined} />
            <CommentsChart data={stats.chartData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TopPosts posts={stats.topPosts} />
              <RecentComments comments={stats.recentComments} />
            </div>
            {viewStats && viewStats.topPostsByViews && viewStats.topPostsByViews.length > 0 && (
              <TopPostsByViews posts={viewStats.topPostsByViews} />
            )}
          </div>
        )}

        {activeTab === 'comments' && (
          <CommentsList />
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <EngagementMetrics data={analytics.topEngagement || []} />
            <ActivityHeatmap 
              activityByHour={analytics.activityByHour || []} 
              activityByDay={analytics.activityByDay || []} 
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <TopCommenters commenters={analytics.topCommenters || []} />
              <ExportData />
            </div>
          </div>
        )}

        {activeTab === 'security' && analytics && (
          <div className="space-y-8">
            <SuspiciousIPs ips={analytics.suspiciousIPs || []} />
            <div className="card p-6">
              <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--c-brand)]" />
                Security Recommendations
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-800/30">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-[var(--c-brand)]/10 flex items-center justify-center">
                      <Search className="w-5 h-5 text-[var(--c-brand)]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Monitor Suspicious IPs</h3>
                    <p className="text-sm text-secondary">
                      Regularly check the suspicious IPs list and consider blocking repeat offenders at the firewall level.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-800/30">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-[var(--c-brand)]/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-[var(--c-brand)]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Use Rate Limiting</h3>
                    <p className="text-sm text-secondary">
                      Implement rate limiting on your comment submission endpoint to prevent spam attacks.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-800/30">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-[var(--c-brand)]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[var(--c-brand)]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Enable CAPTCHA</h3>
                    <p className="text-sm text-secondary">
                      Consider adding CAPTCHA to the comment form for additional spam protection.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-slate-800/30">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-[var(--c-brand)]/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[var(--c-brand)]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Email Verification</h3>
                    <p className="text-sm text-secondary">
                      Require email verification before approving comments from new users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

