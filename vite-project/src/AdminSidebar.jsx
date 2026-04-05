import { useNavigate, useLocation } from 'react-router-dom';
import { clearSession } from './api.js';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
  { icon: 'upload_file', label: 'Upload Document', path: '/admin/upload' },
  { icon: 'question_answer', label: 'Query', path: '/admin/queries', badge: '12' },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside
      className="w-64 flex-shrink-0 flex flex-col shadow-xl z-20"
      style={{
        position: 'relative',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Background Photo */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/bit.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      {/* Blue Gradient Overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(36,99,235,0.93) 0%, rgba(30,58,138,0.97) 100%)' }} />

      {/* Branding */}
      <div className="p-6 flex items-center gap-3" style={{ position: 'relative', zIndex: 1 }}>
        <div className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 30, color: '#fff' }}>school</span>
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">College-Admin</h1>
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>BIT</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1" style={{ position: 'relative', zIndex: 1 }}>
        {navItems.map(({ icon, label, path, badge }) => {
          const active = pathname === path;
          return (
            <a
              key={path}
              href="#"
              onClick={e => { e.preventDefault(); navigate(path); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                }
              }}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}
              {badge && (
                <span
                  className="ml-auto font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: '#ef4444', color: '#fff', fontSize: 10 }}
                >
                  {badge}
                </span>
              )}
            </a>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 mt-auto" style={{ position: 'relative', zIndex: 1 }}>
        {/* Logout */}
        <button
          onClick={() => { clearSession(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
          style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
