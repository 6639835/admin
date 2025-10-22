'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';

export default function ExportData() {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Escape values containing commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportComments = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/comments');
      const data = await res.json();
      exportToCSV(data.comments || [], `comments_${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Failed to export comments:', error);
      alert('Failed to export comments');
    } finally {
      setExporting(false);
    }
  };

  const handleExportAnalytics = async () => {
    setExporting(true);
    try {
      const [statsRes, viewsRes, analyticsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/views'),
        fetch('/api/analytics'),
      ]);

      const stats = await statsRes.json();
      const views = await viewsRes.json();
      const analytics = await analyticsRes.json();

      const exportData = {
        timestamp: new Date().toISOString(),
        stats,
        views,
        analytics,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to export analytics:', error);
      alert('Failed to export analytics');
    } finally {
      setExporting(false);
    }
  };

  const handleExportEngagement = async () => {
    setExporting(true);
    try {
      const res = await fetch('/api/analytics');
      const data = await res.json();
      exportToCSV(data.engagementData || [], `engagement_${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Failed to export engagement data:', error);
      alert('Failed to export engagement data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Export Data
      </h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Export Comments
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Export all comments to a CSV file
          </p>
          <button
            onClick={handleExportComments}
            disabled={exporting}
            className="px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Comments CSV
          </button>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Export Engagement Data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Export post engagement metrics to CSV
          </p>
          <button
            onClick={handleExportEngagement}
            disabled={exporting}
            className="px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Engagement CSV
          </button>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Export Full Analytics
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            Export all stats and analytics to JSON
          </p>
          <button
            onClick={handleExportAnalytics}
            disabled={exporting}
            className="px-4 py-2 bg-brand hover:bg-brand-light text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Analytics JSON
          </button>
        </div>
      </div>
    </div>
  );
}

