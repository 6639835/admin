'use client';

import { useState, useEffect } from 'react';
import type { Comment } from '@/types/comment';
import { CheckCircle, Clock, Ban, Trash2 } from 'lucide-react';

export default function CommentsList() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'spam'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [statusFilter]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      const res = await fetch(`/api/comments?${params}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort comments
  const filteredComments = comments
    .filter(comment => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        comment.author_name.toLowerCase().includes(search) ||
        comment.author_email.toLowerCase().includes(search) ||
        comment.content.toLowerCase().includes(search) ||
        comment.post_slug.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'spam':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredComments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredComments.map(c => c.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: string) => {
    if (selectedIds.length === 0) return;

    if (action === 'delete' && !confirm(`Are you sure you want to delete ${selectedIds.length} comment(s)? This cannot be undone.`)) {
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch('/api/comments/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, commentIds: selectedIds }),
      });

      if (res.ok) {
        await fetchComments();
        setSelectedIds([]);
      } else {
        alert('Failed to perform bulk action');
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Failed to perform bulk action');
    } finally {
      setProcessing(false);
    }
  };

  const handleSingleAction = async (commentId: number, action: string) => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this comment? This cannot be undone.')) {
      return;
    }

    setProcessing(true);
    try {
      if (action === 'delete') {
        const res = await fetch(`/api/comments/${commentId}`, {
          method: 'DELETE',
        });

        if (!res.ok) throw new Error('Failed to delete');
      } else {
        const res = await fetch(`/api/comments/${commentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: action }),
        });

        if (!res.ok) throw new Error('Failed to update');
      }

      await fetchComments();
      setSelectedIds(prev => prev.filter(id => id !== commentId));
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Failed to perform action');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email, content, or post..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="spam">Spam</option>
            </select>
          </div>
        </div>

        {/* Sort and Count */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                sortBy === 'newest'
                  ? 'bg-brand text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => setSortBy('oldest')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                sortBy === 'oldest'
                  ? 'bg-brand text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Oldest First
            </button>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredComments.length}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{comments.length}</span> comments
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-brand/10 dark:bg-brand/20 rounded-lg border-2 border-brand p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-900 dark:text-white">
                {selectedIds.length} selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('approved')}
                  disabled={processing}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleBulkAction('pending')}
                  disabled={processing}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Pending
                </button>
                <button
                  onClick={() => handleBulkAction('spam')}
                  disabled={processing}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Spam
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={processing}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedIds([])}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-lg text-gray-600 dark:text-gray-400">Loading comments...</div>
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {searchTerm ? 'No comments found matching your search' : 'No comments yet'}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Select All */}
          {filteredComments.length > 0 && (
            <div className="flex items-center gap-2 px-4">
              <input
                type="checkbox"
                checked={selectedIds.length === filteredComments.length && filteredComments.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select All
              </label>
            </div>
          )}

          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 p-6 hover:shadow-md transition-all ${
                selectedIds.includes(comment.id)
                  ? 'border-brand bg-brand/5'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(comment.id)}
                    onChange={() => toggleSelect(comment.id)}
                    className="mt-1 w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
                  />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {comment.author_name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comment.status)}`}>
                      {comment.status}
                    </span>
                  </div>
                  <a
                    href={`mailto:${comment.author_email}`}
                    className="text-sm text-brand hover:text-brand-light"
                  >
                    {comment.author_email}
                  </a>
                </div>
              </div>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400 ml-4">
                  <div>{new Date(comment.created_at).toLocaleDateString()}</div>
                  <div>{new Date(comment.created_at).toLocaleTimeString()}</div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">Post:</span>{' '}
                    <span className="text-gray-900 dark:text-white">{comment.post_slug}</span>
                  </div>
                  {comment.parent_id && (
                    <div>
                      <span className="font-medium">Reply to:</span>{' '}
                      <span className="text-gray-900 dark:text-white">Comment #{comment.parent_id}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">ID:</span>{' '}
                    <span className="text-gray-900 dark:text-white">#{comment.id}</span>
                  </div>
                  {comment.ip_address && (
                    <div>
                      <span className="font-medium">IP:</span>{' '}
                      <span className="text-gray-900 dark:text-white">{comment.ip_address}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSingleAction(comment.id, 'approved')}
                    disabled={processing || comment.status === 'approved'}
                    className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleSingleAction(comment.id, 'pending')}
                    disabled={processing || comment.status === 'pending'}
                    className="px-3 py-1.5 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    Pending
                  </button>
                  <button
                    onClick={() => handleSingleAction(comment.id, 'spam')}
                    disabled={processing || comment.status === 'spam'}
                    className="px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Ban className="w-4 h-4" />
                    Spam
                  </button>
                  <button
                    onClick={() => handleSingleAction(comment.id, 'delete')}
                    disabled={processing}
                    className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

