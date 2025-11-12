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
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email, content, or post..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="spam">Spam</option>
            </select>
          </div>
        </div>

        {/* Sort and Count */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-secondary">
              Sort by:
            </label>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                sortBy === 'newest'
                  ? 'bg-[var(--c-brand)] text-white shadow-sm'
                  : 'btn-secondary'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => setSortBy('oldest')}
              className={`px-3 py-1 text-sm rounded-md transition-all ${
                sortBy === 'oldest'
                  ? 'bg-[var(--c-brand)] text-white shadow-sm'
                  : 'btn-secondary'
              }`}
            >
              Oldest First
            </button>
          </div>
          <div className="text-sm text-secondary">
            Showing <span className="font-semibold text-primary">{filteredComments.length}</span> of{' '}
            <span className="font-semibold text-primary">{comments.length}</span> comments
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-[var(--c-brand)]/10 dark:bg-[var(--c-brand)]/20 rounded-lg border-2 border-[var(--c-brand)] p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-medium text-primary">
                {selectedIds.length} selected
              </span>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleBulkAction('approved')}
                  disabled={processing}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleBulkAction('pending')}
                  disabled={processing}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Pending
                </button>
                <button
                  onClick={() => handleBulkAction('spam')}
                  disabled={processing}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Spam
                </button>
                <button
                  onClick={() => handleBulkAction('delete')}
                  disabled={processing}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
            <button
              onClick={() => setSelectedIds([])}
              className="text-secondary hover:text-primary transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-4 h-4 bg-gray-200 dark:bg-slate-700 rounded mt-1"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
                      <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-48"></div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-1"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                </div>
              </div>
              <div className="mb-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-slate-200/5">
                <div className="flex gap-4 mb-4">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-lg text-secondary">
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
                className="w-4 h-4 text-[var(--c-brand)] border-gray-300 rounded focus:ring-[var(--c-brand)]"
              />
              <label className="text-sm font-medium text-secondary">
                Select All
              </label>
            </div>
          )}

          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`card p-6 hover:shadow-md transition-all ${
                selectedIds.includes(comment.id)
                  ? 'border-[var(--c-brand)] bg-[var(--c-brand)]/5 border-2'
                  : 'card-hover'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(comment.id)}
                    onChange={() => toggleSelect(comment.id)}
                    className="mt-1 w-4 h-4 text-[var(--c-brand)] border-gray-300 rounded focus:ring-[var(--c-brand)]"
                  />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg text-primary">
                      {comment.author_name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(comment.status)}`}>
                      {comment.status}
                    </span>
                  </div>
                  <a
                    href={`mailto:${comment.author_email}`}
                    className="link text-sm"
                  >
                    {comment.author_email}
                  </a>
                </div>
              </div>
                <div className="text-right text-sm text-tertiary ml-4">
                  <div>{new Date(comment.created_at).toLocaleDateString()}</div>
                  <div>{new Date(comment.created_at).toLocaleTimeString()}</div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-secondary whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-200 dark:border-slate-200/5 space-y-4">
                <div className="flex flex-wrap gap-4 text-sm text-secondary">
                  <div>
                    <span className="font-medium">Post:</span>{' '}
                    <span className="text-primary">{comment.post_slug}</span>
                  </div>
                  {comment.parent_id && (
                    <div>
                      <span className="font-medium">Reply to:</span>{' '}
                      <span className="text-primary">Comment #{comment.parent_id}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">ID:</span>{' '}
                    <span className="text-primary">#{comment.id}</span>
                  </div>
                  {comment.ip_address && (
                    <div>
                      <span className="font-medium">IP:</span>{' '}
                      <span className="text-primary font-mono">{comment.ip_address}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleSingleAction(comment.id, 'approved')}
                    disabled={processing || comment.status === 'approved'}
                    className="px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleSingleAction(comment.id, 'pending')}
                    disabled={processing || comment.status === 'pending'}
                    className="px-3 py-1.5 text-sm bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Clock className="w-4 h-4" />
                    Pending
                  </button>
                  <button
                    onClick={() => handleSingleAction(comment.id, 'spam')}
                    disabled={processing || comment.status === 'spam'}
                    className="px-3 py-1.5 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    <Ban className="w-4 h-4" />
                    Spam
                  </button>
                  <button
                    onClick={() => handleSingleAction(comment.id, 'delete')}
                    disabled={processing}
                    className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
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

