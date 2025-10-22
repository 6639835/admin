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
import { BarChart3, MessageSquare, TrendingUp, Lock, Search, Zap, Shield, Mail } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Blog Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage and visualize your blog comments
              </p>
            </div>
            <button
              onClick={fetchStats}
              className="px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-md font-medium transition-colors"
            >
              Refresh
            </button>
          </div>
          
          {/* Tabs */}
          <div className="mt-6 flex gap-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'overview'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-3 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'comments'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Comments
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-3 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'border-brand text-brand'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Lock className="w-4 h-4" />
              Security
            </button>
          </div>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Security Recommendations
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Search className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Monitor Suspicious IPs</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Regularly check the suspicious IPs list and consider blocking repeat offenders at the firewall level.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Zap className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Use Rate Limiting</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Implement rate limiting on your comment submission endpoint to prevent spam attacks.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Shield className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Enable CAPTCHA</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Consider adding CAPTCHA to the comment form for additional spam protection.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Mail className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Verification</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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

