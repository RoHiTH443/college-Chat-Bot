import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import * as api from './api.js';

// Icon Components (inline SVG)
const Eye = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const GraduationCap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6m0 0l-8.97 4.486a2 2 0 01-1.796.29m10.766-4.776l-8.97 4.486a2 2 0 01-1.796.29M2 10v6m0 0l8.97 4.486a2 2 0 001.796.29m-10.766-4.776l8.97 4.486a2 2 0 001.796.29M6 10L12 7m0 0l6-3m-6 3v3m0 0l6 3"></path>
  </svg>
);

const ShieldAdmin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const ArrowLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const Mail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const Lock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const CheckCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!userId.trim()) {
      newErrors.userId = role === 'student' ? 'Student ID is required' : 'Admin ID is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setErrors({});
    try {
      const data = await api.auth.login(userId, password);
      api.saveSession(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setErrors({ general: err.message || 'Invalid credentials. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newRole) => {
    if (newRole === role) return;
    setRole(newRole);
    setErrors({});
    setUserId('');
    setPassword('');
    setShowPassword(false);
  };

  const isStudent = role === 'student';

  return (
    <div className="sl-container">

      {/* ── Left Section 60% ── */}
      <div className={`sl-left${isStudent ? '' : ' sl-left-admin'}`}>
        <div className={`sl-left-overlay${isStudent ? '' : ' sl-left-overlay-admin'}`} />

        <div className="sl-left-content">
          <div className="sl-badge">
            {isStudent ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="10" rx="2"/>
                <path d="M9 11V7a3 3 0 0 1 6 0v4"/>
                <circle cx="9" cy="16" r="1" fill="currentColor"/>
                <circle cx="15" cy="16" r="1" fill="currentColor"/>
                <path d="M12 2v3"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            )}
            <span>{isStudent ? 'AI-Powered Campus Support' : 'Secure Admin Access'}</span>
          </div>

          <h1 className="sl-heading">
            {isStudent ? (
              <>College FAQ <br /><span className="sl-heading-accent">ChatBot</span></>
            ) : (
              <>Administrative <br /><span className="sl-heading-accent sl-heading-accent-admin">Control Panel</span></>
            )}
          </h1>

          <p className="sl-desc">
            {isStudent
              ? 'Access student resources, schedules, and instant answers through our sophisticated AI chatbot. Designed to streamline your academic journey.'
              : 'Manage students, courses, faculty, grades, and all institutional operations from a unified dashboard with advanced analytics and reporting tools.'}
          </p>

          <div className="sl-stats">
            <div className="sl-stat">
              <span className="sl-stat-num">{isStudent ? '15k+' : '500+'}</span>
              <span className="sl-stat-label">{isStudent ? 'Active Students' : 'Managed Users'}</span>
            </div>
            <div className="sl-stat-divider" />
            <div className="sl-stat">
              <span className="sl-stat-num">{isStudent ? '24/7' : '99.9%'}</span>
              <span className="sl-stat-label">{isStudent ? 'AI Assistance' : 'System Uptime'}</span>
            </div>
          </div>
        </div>

        <div className="sl-left-footer">
          <p>© 2026 University {isStudent ? 'Student' : 'Admin'} Portal. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right Section 40% ── */}
      <div className="sl-right">
        <div className="sl-form-wrap">

          {/* Tab Switcher */}
          <div className="sl-tabs">
            <button
              type="button"
              className={`sl-tab${isStudent ? ' sl-tab-active' : ''}`}
              onClick={() => handleTabChange('student')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6m0 0l-8.97 4.486a2 2 0 01-1.796.29m10.766-4.776l-8.97 4.486a2 2 0 01-1.796.29M2 10v6m0 0l8.97 4.486a2 2 0 001.796.29m-10.766-4.776l8.97 4.486a2 2 0 001.796.29M6 10L12 7m0 0l6-3m-6 3v3m0 0l6 3"/>
              </svg>
              Student
            </button>
            <button
              type="button"
              className={`sl-tab${!isStudent ? ' sl-tab-active sl-tab-admin-active' : ''}`}
              onClick={() => handleTabChange('admin')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Admin
            </button>
          </div>

          {/* Role Icon */}
          <div className={`sl-school-icon${isStudent ? '' : ' sl-school-icon-admin'}`}>
            {isStudent ? <GraduationCap /> : <ShieldAdmin />}
          </div>

          <h2 className="sl-title">Welcome Back</h2>
          <p className="sl-subtitle">
            {isStudent
              ? 'Please enter your credentials to access the portal.'
              : 'Secure authentication required for administrative access.'}
          </p>

          <form onSubmit={handleSubmit} className="sl-form">

            {/* ID Field */}
            <div className="sl-float-group">
              <input
                type="text"
                id="sl-userId"
                placeholder=" "
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={`sl-float-input${errors.userId ? ' sl-input-error' : ''}`}
              />
              <label htmlFor="sl-userId" className="sl-float-label">
                {isStudent ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8l-2 4h12l-2-4z"/></svg>
                    Student ID
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Admin ID
                  </>
                )}
              </label>
              {errors.userId && <span className="sl-error">{errors.userId}</span>}
            </div>

            {/* Password Field */}
            <div className="sl-float-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="sl-password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`sl-float-input${errors.password ? ' sl-input-error' : ''}`}
              />
              <label htmlFor="sl-password" className="sl-float-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                {isStudent ? 'Password' : 'Master Password'}
              </label>
              <button type="button" className="sl-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              {errors.password && <span className="sl-error">{errors.password}</span>}
            </div>

            {/* Remember / Forgot */}
            <div className="sl-form-footer">
              <label className="sl-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sl-checkbox"
                />
                <span>{isStudent ? 'Remember me' : 'Trust this device'}</span>
              </label>
              <a href="#" className={`sl-forgot${isStudent ? '' : ' sl-forgot-admin'}`}>
                {isStudent ? 'Forgot Password?' : 'Need help?'}
              </a>
            </div>

            {/* General API error */}
            {errors.general && (
              <div style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '-4px', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.25)' }}>
                {errors.general}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`sl-submit-btn${isStudent ? '' : ' sl-submit-admin'}${loading ? ' sl-loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner" /> {isStudent ? 'Signing in...' : 'Authenticating...'}</>
              ) : (
                <>
                  {isStudent ? 'Sign In' : 'Access Portal'}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Register / Security Notice */}
          {isStudent ? (
            <div className="sl-register">
              <p>New to the portal? <a href="#" className="sl-register-link">Register Now</a></p>
            </div>
          ) : (
            <div className="sl-security-notice">
              {/* <p>🔒 All admin activities are logged and monitored for security.</p> */}
            </div>
          )}

          {/* Footer Links */}
          <div className="sl-footer-links">
            <a href="#" className="sl-footer-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Help Center
            </a>
            <a href="#" className="sl-footer-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Privacy
            </a>
            <a href="#" className="sl-footer-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              English (US)
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
