import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import * as api from './api.js';

const statusStyle = {
  Pending:  { bg: '#fef3c7', color: '#92400e', dot: '#d97706' },
  Resolved: { bg: '#dcfce7', color: '#14532d', dot: '#16a34a' },
  Urgent:   { bg: '#fee2e2', color: '#7f1d1d', dot: '#ef4444' },
};

function getInitials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

export default function AdminQueries() {
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [replyModal, setReplyModal] = useState(null); // { query }
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.queries.getAll()
      .then(data => setQueries(data.queries || []))
      .catch(err => console.error('Queries fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleReply = (query) => {
    setReplyModal(query);
    setReplyText(query.adminReply || '');
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    setSaving(true);
    try {
      const updated = await api.queries.update(replyModal._id, {
        adminReply: replyText,
        status: 'Resolved',
      });
      setQueries(prev => prev.map(q => q._id === replyModal._id ? updated.query : q));
      setReplyModal(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filtered = queries.filter(q => {
    const name = q.studentName || '';
    const reg = q.registerNumber || '';
    const snippet = q.message || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      reg.toLowerCase().includes(search.toLowerCase()) ||
      snippet.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All Statuses' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sidebar ── */}
      <AdminSidebar />

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto p-8" style={{ background: '#f6f6f8' }}>
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Student Queries &amp; Feedback</h2>
            <p style={{ color: '#555' }} className="mt-1">Efficiently manage and address student concerns and insights.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
            <span className="material-symbols-outlined text-lg">download</span>
            Export Report
          </button>
        </header>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 relative" style={{ minWidth: 300 }}>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 20 }}>search</span>
              <input
                type="text"
                className="w-full rounded-lg text-sm outline-none pl-10 pr-4 py-2"
                style={{ background: '#efefef', border: 'none' }}
                placeholder="Search by name, register number or keywords..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  className="appearance-none pl-4 pr-10 py-2 rounded-lg text-sm font-medium cursor-pointer outline-none"
                  style={{ background: '#efefef', border: 'none', color: '#222' }}
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option>All Statuses</option>
                  <option>Pending</option>
                  <option>Resolved</option>
                  <option>Urgent</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: 18 }}>expand_more</span>
              </div>
              <div className="relative">
                <select className="appearance-none pl-4 pr-10 py-2 rounded-lg text-sm font-medium cursor-pointer outline-none" style={{ background: '#efefef', border: 'none', color: '#222' }}>
                  <option>Last 30 Days</option>
                  <option>This Week</option>
                  <option>Today</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" style={{ fontSize: 18 }}>calendar_today</span>
              </div>
              <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: '#f0f0f0', borderBottom: '1px solid #ddd' }}>
                  {['Student Name', 'Register No.', 'Message Snippet', 'Submission Date', 'Status', 'Actions'].map((h, i) => (
                    <th key={h} className={`px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500${i === 5 ? ' text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">Loading queries...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">No queries found.</td></tr>
                ) : filtered.map(q => {
                  const s = statusStyle[q.status] || statusStyle.Pending;
                  const isPending = q.status !== 'Resolved';
                  const initials = getInitials(q.studentName);
                  const date = new Date(q.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <tr key={q._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0" style={{ background: '#2463eb', color: '#fff' }}>{initials}</div>
                          <span className="font-semibold text-gray-900">{q.studentName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{q.registerNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                        <p className="truncate">{q.message}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.color }}>
                          <span className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ background: s.dot }} />
                          {q.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isPending ? (
                          <button onClick={() => handleReply(q)} className="px-4 py-1.5 text-white rounded-lg text-xs font-bold transition-all" style={{ background: '#2463eb' }}>Reply</button>
                        ) : (
                          <button onClick={() => handleReply(q)} className="px-4 py-1.5 rounded-lg text-xs font-bold transition-colors text-gray-400 hover:text-gray-900">View</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing <span className="font-medium text-gray-900">{filtered.length}</span> of <span className="font-medium text-gray-900">{queries.length}</span> queries</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { icon: 'question_answer', iconColor: '#2463eb', iconBg: '#eff6ff', label: 'Total Queries', value: queries.length },
            { icon: 'pending_actions', iconColor: '#d97706', iconBg: '#fef3c7', label: 'Pending / Urgent', value: queries.filter(q => q.status !== 'Resolved').length },
            { icon: 'done_all', iconColor: '#16a34a', iconBg: '#dcfce7', label: 'Resolved Queries', value: queries.filter(q => q.status === 'Resolved').length },
          ].map(({ icon, iconColor, iconBg, label, value }) => (
            <div key={label} className="bg-white p-6 rounded-xl border border-slate-200" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
                  <span className="material-symbols-outlined" style={{ color: iconColor }}>{icon}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <h4 className="text-2xl font-black text-gray-900 mt-1">{value}</h4>
            </div>
          ))}
        </div>
      </main>

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Query from {replyModal.studentName}</h3>
              <button onClick={() => setReplyModal(null)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-100 rounded-xl p-4 text-sm text-gray-700">{replyModal.message}</div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">Admin Reply</label>
                <textarea
                  rows={4}
                  className="w-full p-3 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 resize-none"
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                />
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setReplyModal(null)} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
              <button
                onClick={submitReply}
                disabled={saving}
                className="px-6 py-2 text-white text-sm font-semibold rounded-lg transition-all"
                style={{ background: '#2463eb' }}
              >
                {saving ? 'Saving...' : 'Send Reply & Resolve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
