import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import * as api from './api.js';

export default function AdminDashboard() {
  const [searchValue, setSearchValue] = useState('');
  const [stats, setStats] = useState({ totalStudents: '--', uploadedPDFs: '--', pendingQueries: '--' });
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.dashboard.adminStats()
      .then(data => {
        setStats(data.stats);
        setRecentActivity(data.recentActivity || []);
      })
      .catch(err => console.error('Dashboard stats error:', err));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Sidebar ── */}
      <AdminSidebar />

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center max-w-md w-full">
            {/* <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" style={{ fontSize: 20 }}>search</span>
              <input
                // className="w-full rounded-xl text-sm outline-none focus:ring-2"
                // style={{ background: '#f6f6f8', border: 'none', paddingLeft: 40, paddingRight: 16, paddingTop: 8, paddingBottom: 8 }}
                // placeholder="Search for students, documents, or logs..."
                // type="text"
                // value={searchValue}
                // onChange={e => setSearchValue(e.target.value)}
              />
            </div> */}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-xl relative transition-colors hover:bg-gray-100" style={{ color: '#333' }}>
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">COLLEGE ADMIN</p>
                <p className="text-xs font-medium" style={{ color: '#555' }}>College Office</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: '#2463eb' }}>CA</div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
<main className="flex-1 overflow-y-auto p-8 space-y-8" style={{ maxWidth: 1400, margin: '0 auto', width: '100%', background: '#f6f6f8' }}>

          {/* Welcome Row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
              <p style={{ color: '#555' }}>Welcome back, Administrator. Here's what's happening today.</p>
            </div>
            {/* <button
              className="flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all"
              style={{ background: '#2463eb', boxShadow: '0 4px 14px rgba(36,99,235,0.3)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
              New Registration
            </button> */}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 flex flex-col gap-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl" style={{ background: '#eff6ff' }}>
                  <span className="material-symbols-outlined" style={{ color: '#2463eb' }}>group</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: '#2463eb', background: '#eff6ff' }}>+12%</span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#555' }}>Total Students</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.totalStudents}</h3>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 flex flex-col gap-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl" style={{ background: '#f0fdf4' }}>
                  <span className="material-symbols-outlined" style={{ color: '#16a34a' }}>picture_as_pdf</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: '#64748b', background: '#f1f5f9' }}>Last 30d</span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#555' }}>Uploaded PDFs</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.uploadedPDFs}</h3>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 flex flex-col gap-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl" style={{ background: '#fee2e2' }}>
                  <span className="material-symbols-outlined" style={{ color: '#ef4444' }}>emergency_home</span>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ color: '#ef4444', background: '#fee2e2' }}>High Priority</span>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#555' }}>Pending Queries</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingQueries}</h3>
              </div>
            </div>

            {/* Card 4 */}
            {/* <div className="bg-white p-6 rounded-xl border border-slate-100 flex flex-col gap-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl" style={{ background: '#f0fdf4' }}>
                  <span className="material-symbols-outlined" style={{ color: '#16a34a' }}>bolt</span>
                </div>
                <span className="text-xs font-bold" style={{ color: '#16a34a' }}>gggggg</span>
              </div>
              {/* <div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>New Applications</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">320</h3>
              </div> */}
            {/* </div>  */}
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 gap-6" style={{ gridTemplateColumns: '1fr auto' }}>
            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-gray-900">Recent Activity</h3>
                <a href="#" className="text-sm font-semibold hover:underline" style={{ color: '#2463eb' }}>View All</a>
              </div>
              <div className="divide-y divide-slate-100">
                {recentActivity.length > 0 ? recentActivity.map((item, i) => {
                  const statusColors = {
                    Pending: { iconBg: '#fef3c7', iconColor: '#d97706', icon: 'pending_actions', tag: 'PENDING', tagColor: '#d97706' },
                    Urgent:  { iconBg: '#fee2e2', iconColor: '#ef4444', icon: 'priority_high', tag: 'URGENT', tagColor: '#ef4444' },
                    Resolved:{ iconBg: '#f0fdf4', iconColor: '#16a34a', icon: 'done_all', tag: 'RESOLVED', tagColor: '#16a34a' },
                  };
                  const c = statusColors[item.status] || statusColors.Pending;
                  const when = new Date(item.createdAt).toLocaleString();
                  return (
                    <div key={item._id || i} className="p-4 flex items-start gap-4 transition-colors hover:bg-gray-50">
                      <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: c.iconBg }}>
                        <span className="material-symbols-outlined" style={{ color: c.iconColor, fontSize: 20 }}>{c.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          <span className="font-bold">{item.studentName}</span> — {item.subject}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#666' }}>{when}</p>
                      </div>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: c.tagColor, fontSize: 10 }}>{c.tag}</span>
                    </div>
                  );
                }) : (
                  [{
                    icon: 'upload_file', iconColor: '#2463eb', iconBg: '#eff6ff',
                    title: <><span className="font-bold">Faculty Member Sarah</span> uploaded a new syllabus PDF</>,
                    sub: 'Introduction to Computer Science • 2 minutes ago',
                    tag: 'PDF', tagColor: '#94a3b8',
                  },
                  {
                    icon: 'priority_high', iconColor: '#fff', iconBg: '#ef4444',
                    title: <><span className="font-bold">Emergency Query</span>: Grade dispute from Mark Spencer</>,
                    sub: 'Awaiting Academic Head Approval • 3 hours ago',
                    tag: 'URGENT', tagColor: '#ef4444',
                  }].map(({ icon, iconColor, iconBg, title, sub, tag, tagColor }, i) => (
                    <div key={i} className="p-4 flex items-start gap-4 transition-colors hover:bg-gray-50">
                      <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: iconBg }}>
                        <span className="material-symbols-outlined" style={{ color: iconColor, fontSize: 20 }}>{icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{title}</p>
                        <p className="text-xs mt-1" style={{ color: '#666' }}>{sub}</p>
                      </div>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: tagColor, fontSize: 10 }}>{tag}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-100 p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', minWidth: 200 }}>
              <h3 className="font-bold text-lg text-gray-900 mb-4">Quick Actions</h3>
              <div className="flex flex-col gap-3">
                {[
                  { icon: 'notes', label: 'Add Paragraph', path: '/admin/paragraph' },
                  { icon: 'question_answer', label: 'View Queries', path: '/admin/queries' },
                ].map(({ icon, label, path }) => (
                  <button
                    key={label}
                    onClick={() => path && navigate(path)}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-100 transition-all"
                    onMouseEnter={e => { e.currentTarget.style.background = '#2463eb'; e.currentTarget.style.borderColor = '#2463eb'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = ''; }}
                  >
                    <span className="material-symbols-outlined mb-2" style={{ fontSize: 24 }}>{icon}</span>
                    <span className="text-xs font-bold text-gray-700">{label}</span>
                  </button>
                  ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
