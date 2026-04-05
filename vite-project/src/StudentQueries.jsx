import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { queries } from './api';

const BookIcon = () => (
  <img src="/bit.jpg" alt="BIT Logo" className="h-8 w-8 object-contain rounded" />
);

const statusClasses = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Urgent: 'bg-rose-100 text-rose-800 border-rose-200',
};

function formatDate(dateValue) {
  if (!dateValue) return 'N/A';
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleString();
}

export default function StudentQueries() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadQueries() {
      try {
        setLoading(true);
        setError('');
        const data = await queries.getAll();
        if (!mounted) return;
        setItems(data?.queries || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load queries.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadQueries();
    return () => {
      mounted = false;
    };
  }, []);

  const counts = useMemo(() => {
    const total = items.length;
    const resolved = items.filter((q) => q.status === 'Resolved').length;
    const pending = items.filter((q) => q.status !== 'Resolved').length;
    return { total, resolved, pending };
  }, [items]);

  return (
    <>
      <style>{`
        .chat-glass {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
        }
        .chat-glass-dark {
          background: rgba(241,245,249,0.9);
          border: 1px solid #E2E8F0;
        }
        .chat-glow {
          box-shadow: 0 0 15px rgba(0,0,0,0.15);
        }
        .chat-scrollbar::-webkit-scrollbar { width: 6px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>

      <div
        className="h-screen w-screen overflow-hidden flex p-4 gap-4"
        style={{ backgroundColor: 'hsl(160, 72%, 94%)', fontFamily: 'Inter, sans-serif', color: '#0F172A' }}
      >
        <aside className="w-72 chat-glass rounded-2xl flex flex-col p-6 h-full flex-shrink-0">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center chat-glow">
              <BookIcon />
            </div>
            <div>
              <h1 className="text-[#0F172A] font-bold text-lg leading-tight">Student Portal</h1>
              <p className="text-xs text-[#64748B] font-medium tracking-wide">BIT</p>
            </div>
          </div>

          <div className="mb-8 flex items-center gap-3 p-3 chat-glass-dark rounded-xl border border-[#E2E8F0]">
            <img src="/rohith.jpg" alt="Profile" className="w-10 h-10 rounded-full border border-[#E2E8F0] object-cover flex-shrink-0" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-[#0F172A] truncate">ROHITH M</p>
              <p className="text-[10px] text-[#64748B]">BE.EEE</p>
            </div>
            <button
              onClick={() => navigate('/')}
              title="Sign out"
              className="text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto chat-scrollbar">
            <div className="text-[10px] uppercase font-bold text-[#64748B] mb-2 px-2 tracking-widest">Main Menu</div>

            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-[#F1F5F9] text-[#64748B]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </a>

            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/chat'); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-[#F1F5F9] text-[#64748B]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-sm font-medium">AI Chat</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-[#F1F5F9] text-[#64748B]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Campus Map</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-[#0F172A]/5 text-[#0F172A] border border-[#0F172A]/15">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-sm font-medium">My Queries</span>
            </a>
          </nav>
        </aside>

        <main className="flex-1 chat-glass rounded-2xl overflow-hidden flex flex-col h-full">
          <header className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white/60 flex-shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-[#0F172A]">My Raised Queries</h1>
              <p className="text-sm text-[#64748B]">Track your submitted queries and admin replies.</p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <p className="text-xs uppercase text-[#64748B] font-semibold">Total Queries</p>
                <p className="text-2xl font-bold mt-1">{counts.total}</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <p className="text-xs uppercase text-[#64748B] font-semibold">Pending</p>
                <p className="text-2xl font-bold mt-1">{counts.pending}</p>
              </div>
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
                <p className="text-xs uppercase text-[#64748B] font-semibold">Resolved</p>
                <p className="text-2xl font-bold mt-1">{counts.resolved}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E2E8F0]">
                <h2 className="text-lg font-semibold">Query List</h2>
              </div>

              {loading && <p className="p-5 text-sm text-[#64748B]">Loading queries...</p>}
              {error && <p className="p-5 text-sm text-red-600">{error}</p>}
              {!loading && !error && items.length === 0 && (
                <p className="p-5 text-sm text-[#64748B]">No queries raised yet.</p>
              )}

              {!loading && !error && items.length > 0 && (
                <div className="divide-y divide-[#E2E8F0]">
                  {items.map((q) => {
                    const badgeClass = statusClasses[q.status] || statusClasses.Pending;
                    return (
                      <article key={q._id} className="p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                          <h3 className="text-base font-semibold text-[#0F172A]">{q.subject || 'Untitled Query'}</h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${badgeClass}`}>
                            {q.status || 'Pending'}
                          </span>
                        </div>

                        <p className="text-xs text-[#64748B] mb-2">Raised on: {formatDate(q.createdAt)}</p>

                        <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 mb-3">
                          <p className="text-[11px] uppercase tracking-wide text-[#64748B] font-semibold mb-1">Your Query</p>
                          <p className="text-sm text-[#0F172A] whitespace-pre-wrap">{q.message || '-'}</p>
                        </div>

                        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3">
                          <p className="text-[11px] uppercase tracking-wide text-[#64748B] font-semibold mb-1">Admin Reply</p>
                          <p className="text-sm text-[#0F172A] whitespace-pre-wrap">
                            {q.adminReply ? q.adminReply : 'No reply yet. Your query is still under review.'}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
