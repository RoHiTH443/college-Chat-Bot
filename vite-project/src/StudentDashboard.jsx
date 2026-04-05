import { useNavigate } from 'react-router-dom';

const BookIcon = () => (
  <img src="/bit.jpg" alt="BIT Logo" className="h-8 w-8 object-contain rounded" />
);

export default function StudentDashboard() {
  const navigate = useNavigate();

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
        .dash-main::-webkit-scrollbar { width: 6px; }
        .dash-main::-webkit-scrollbar-track { background: transparent; }
        .dash-main::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
      `}</style>

      <div
        className="h-screen w-screen overflow-hidden flex p-4 gap-4"
        style={{ backgroundColor: 'hsl(160, 72%, 94%)', fontFamily: 'Inter, sans-serif', color: '#0F172A' }}
      >
        {/* ── Chat Sidebar ── */}
        <aside className="w-72 chat-glass rounded-2xl flex flex-col p-6 h-full flex-shrink-0">
          {/* Branding */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center chat-glow">
              <BookIcon />
            </div>
            <div>
            
              <h1 className="text-[#0F172A] font-bold text-lg leading-tight">Student Portal</h1>
              <p className="text-xs text-[#64748B] font-medium tracking-wide">BIT</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="mb-8 flex items-center gap-3 p-3 chat-glass-dark rounded-xl border border-[#E2E8F0]">
            {/* <div className="w-10 h-10 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] flex items-center justify-center text-[#0F172A] font-bold text-sm flex-shrink-0">
              CW
            </div> */}
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

          {/* Nav */}
          <nav className="flex-1 space-y-2 overflow-y-auto chat-scrollbar">
            <div className="text-[10px] uppercase font-bold text-[#64748B] mb-2 px-2 tracking-widest">Main Menu</div>

            {/* Dashboard — active */}
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-[#0F172A]/5 text-[#0F172A] border border-[#0F172A]/15">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-sm font-medium">Dashboard</span>
            </a>

            {/* AI Chat */}
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

            {/* Campus Map */}
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-[#F1F5F9] text-[#64748B]">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-medium">Campus Map</span>
            </a>

            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/queries'); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-[#F1F5F9] text-[#64748B]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-sm font-medium">My Queries</span>
            </a>

            <div className="pt-6">
              <div className="text-[10px] uppercase font-bold text-[#64748B] mb-2 px-2 tracking-widest">Recent Chats</div>
              <div className="space-y-1">
                <button className="w-full text-left px-4 py-2 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg truncate transition-colors">Scholarship Deadlines Fall...</button>
                <button className="w-full text-left px-4 py-2 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg truncate transition-colors">Library Hours During Finals</button>
                <button className="w-full text-left px-4 py-2 text-xs text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg truncate transition-colors">Roommate Selection Process</button>
              </div>
            </div>
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 chat-glass rounded-2xl overflow-hidden flex flex-col h-full">

          {/* ── Top Nav ── */}
          <header className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white/60 flex-shrink-0">
            <div className="flex-1 max-w-lg relative">
              {/* <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </span> */}
              {/* <input
                className="w-full bg-[#F1F5F9] border border-[#E2E8F0] rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#0F172A]/20 placeholder:text-[#94A3B8] text-sm"
                placeholder="Search student info..."
                type="text"
              /> */}
            </div>

            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center gap-2 bg-[#0F172A] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#1e293b] transition-colors chat-glow"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
                <span>Open Chat</span>
              </button>
            </div>
          </header>

          {/* ── Dashboard Grid ── */}
          <div className="flex-1 overflow-y-auto dash-main p-6 space-y-8">

          {/* ── Student Details ── */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">Student Details</h1>
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Yearly</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-8 items-start md:items-center">
              {/* <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-slate-50 flex-shrink-0">
                CW
              </div> */}
              <img src="/rohith.jpg" alt="Profile" className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold ring-4 ring-slate-50 flex-shrink-0 object-cover" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-12 flex-1">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Full Name</p>
                  <p className="text-lg font-bold text-slate-900 leading-tight">ROHITH M</p>
                </div>
                 <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">DEPARTMENT</p>
                  <p className="text-s font-semibold text-slate-900">ELECTRICAL AND ELECTRONICS ENGINEERING</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">ROLL NO:</p>
                  <p className="text-base font-semibold text-slate-900">7376231EE147</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">MOBILE Number</p>
                  <p className="text-base font-semibold text-slate-900">7418568844</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Email</p>
                  <p className="text-base font-semibold text-slate-900 break-all">rohit.ee23@bitsathy.ac.in</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Address</p>
                  <p className="text-base font-semibold text-slate-900">GUDALUR,DINDIGUL,TAMILNADU,INDIA</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── Quick Stats ── */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Attendance Rate */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-2xl">percent</span>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">85%</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Attendance Rate</p>
              </div>
            </div>

            {/* CGPA */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                <span className="material-symbols-outlined text-2xl">grade</span>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">8.85</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Current CGPA</p>
              </div>
            </div>

            {/* Arrear Count */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <span className="material-symbols-outlined text-2xl">error</span>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">0</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Arrear Count</p>
              </div>
            </div>

            {/* Remaining Fees */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">₹1,000</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Remaining Fees</p>
              </div>
            </div>

            {/* Present Days */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <span className="material-symbols-outlined text-2xl">check_circle</span>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">145</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Present Days</p>
              </div>
            </div>

            {/* Absent Days */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">12</p>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Absent Days</p>
              </div>
            </div>
          </section>

          {/* ── Analytics Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Attendance Trend */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Attendance Trend</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Monthly attendance overview</p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">2025–2026</span>
                </div>
                {/* Bar chart */}
                <div className="flex items-end gap-2" style={{ height: '160px' }}>
                  {[
                    { month: 'Jun', present: 22, absent: 2, pct: 92 },
                    { month: 'Jul', present: 20, absent: 4, pct: 83 },
                    { month: 'Aug', present: 24, absent: 1, pct: 96 },
                    { month: 'Sep', present: 21, absent: 3, pct: 88 },
                    { month: 'Oct', present: 19, absent: 5, pct: 79 },
                    { month: 'Nov', present: 23, absent: 2, pct: 92 },
                    { month: 'Dec', present: 18, absent: 6, pct: 75 },
                    { month: 'Jan', present: 22, absent: 3, pct: 88 },
                    { month: 'Feb', present: 20, absent: 2, pct: 91 },
                    { month: 'Mar', present: 14, absent: 2, pct: 87 },
                  ].map(({ month, present, absent, pct }) => (
                    <div key={month} className="flex-1 flex flex-col items-center gap-1 group relative">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white text-[10px] rounded-lg px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        <p className="font-bold">{month}: {pct}%</p>
                        <p>Present: {present}d</p>
                        <p>Absent: {absent}d</p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">{pct}%</span>
                      <div className="w-full rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: `${pct * 1.2}px` }}>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-blue-700 to-blue-400"
                          style={{ height: '100%' }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{month}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject-wise Grades */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Subject-wise Grades</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Current semester performance</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { subject: 'Data Structures', grade: 'A+', score: 95, color: 'bg-blue-500' },
                    { subject: 'Operating Systems', grade: 'A', score: 88, color: 'bg-blue-500' },
                    { subject: 'Computer Networks', grade: 'B+', score: 78, color: 'bg-blue-500' },
                    { subject: 'Database Management', grade: 'A', score: 91, color: 'bg-blue-500' },
                    { subject: 'Software Engineering', grade: 'A+', score: 97, color: 'bg-blue-500' },
                  ].map(({ subject, grade, score, color }) => (
                    <div key={subject} className="flex items-center gap-4">
                      <div className="w-32 flex-shrink-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{subject}</p>
                      </div>
                      <div className="flex-1 bg-slate-100 rounded-full h-2">
                        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-sm font-bold text-slate-700 w-8 text-right">{grade}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column — Summary */}
            <div className="lg:col-span-4 space-y-6">
              {/* Attendance Summary Donut */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-900 mb-1">Attendance Summary</h2>
                <p className="text-xs text-slate-400 mb-6">Present vs Absent</p>
                <div className="flex flex-col items-center gap-4">
                  {/* Donut via SVG */}
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 36 36" className="w-36 h-36 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F1F5F9" strokeWidth="3.8" />
                      {/* Present 85% */}
                      <circle
                        cx="18" cy="18" r="15.9"
                        fill="none"
                        stroke="#50f833"
                        strokeWidth="3.8"
                        strokeDasharray="85 15"
                        strokeLinecap="round"
                      />
                      {/* Absent 15% */}
                      <circle
                        cx="18" cy="18" r="15.9"
                        fill="none"
                        stroke="#ff3609"
                        strokeWidth="3.8"
                        strokeDasharray="15 85"
                        strokeDashoffset="-85"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">85%</span>
                      <span className="text-[10px] text-slate-400">Present</span>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                      <span className="text-slate-600 font-medium">Present <span className="font-bold text-slate-800">145</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                      <span className="text-slate-600 font-medium">Absent <span className="font-bold text-slate-800">12</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-base font-bold text-slate-900 mb-4">Upcoming Events</h2>
                <div className="space-y-3">
                  {[
                    { date: 'Mar 12', label: 'Mid-Semester Exam', color: 'bg-red-100 text-red-700' },
                    { date: 'Mar 18', label: 'Project Submission', color: 'bg-amber-100 text-amber-700' },
                    { date: 'Mar 25', label: 'Seminar: AI & ML Trends', color: 'bg-blue-100 text-blue-700' },
                    { date: 'Apr 2', label: 'Fee Payment Deadline', color: 'bg-purple-100 text-purple-700' },
                  ].map(({ date, label, color }) => (
                    <div key={date} className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${color}`}>{date}</span>
                      <span className="text-sm text-slate-600 truncate">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          </div>
        </main>
      </div>
    </>
  );
}
