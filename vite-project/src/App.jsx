import React, { useState } from 'react';
import './App.css';

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
  const [role, setRole] = useState(null); // 'student', 'admin', or null
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
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      console.log(`${role} login attempt:`, { userId, password, rememberMe });
      alert(`Welcome ${role === 'student' ? 'Student' : 'Admin'}! ${userId}`);
      setLoading(false);
      setUserId('');
      setPassword('');
      setRememberMe(false);
    }, 1500);
  };

  // Role Selection Screen
  if (!role) {
    return (
      <div className="role-selection-container">
        <div className="role-content">
          <div className="role-header">
            <h1 className="role-title">College Portal</h1>
            <p className="role-subtitle">Select your role to continue</p>
          </div>

          <div className="role-cards">
            {/* Student Card */}
            <div 
              className="role-card student-card"
              onClick={() => setRole('student')}
            >
              <div className="role-icon-wrapper student">
                <GraduationCap />
              </div>
              <h3 className="role-card-title">Student Login</h3>
              <p className="role-card-desc">Access your courses, grades, and student resources</p>
              <div className="role-card-arrow">
                <ArrowRight />
              </div>
            </div>

            {/* Admin Card */}
            <div 
              className="role-card admin-card"
              onClick={() => setRole('admin')}
            >
              <div className="role-icon-wrapper admin">
                <ShieldAdmin />
              </div>
              <h3 className="role-card-title">Admin Login</h3>
              <p className="role-card-desc">Manage students, courses, and system settings</p>
              <div className="role-card-arrow">
                <ArrowRight />
              </div>
            </div>
          </div>

          <div className="role-footer">
            <p>© 2026 University Portal. All rights reserved.</p>
          </div>
        </div>
      </div>
    );
  }

  // Student Login Screen
  if (role === 'student') {
    return (
      <div className="login-container student-login">
        {/* Left Section */}
        <div className="left-section student-section">
          <div className="left-content">
            <div className="badge">
              <CheckCircle />
              <span>AI-Powered Campus Support</span>
            </div>

            <h1 className="main-heading">College FAQ ChatBot</h1>

            <p className="description">
              Access your student dashboard, check grades, manage courses, and connect with campus resources. Everything you need for a successful university experience.
            </p>

            <div className="statistics">
              <div className="stat-item">
                <div className="stat-number">15k+</div>
                <div className="stat-label">Active Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">AI Assistance</div>
              </div>
            </div>

            <div className="left-footer">
              <p>© 2026 University Student Portal. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section student-right">
          <div className="login-card student-card-form">
            <button 
              className="back-button"
              onClick={() => setRole(null)}
            >
              <ArrowLeft /> Back
            </button>

            <div className="card-icon student-icon">
              <GraduationCap />
            </div>

            <h2 className="card-title">Welcome Back, Student</h2>

            <p className="card-subtitle">
              Enter your credentials to access the student portal.
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="text"
                    id="studentId"
                    placeholder="Enter your student ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className={`form-input ${errors.userId ? 'input-error' : ''}`}
                  />
                </div>
                {errors.userId && (
                  <span className="error-message">{errors.userId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-footer">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className={`sign-in-button student-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="register-section">
              <p>
                New to the portal?{' '}
                <a href="#" className="register-link">
                  Register Now
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Login Screen
  if (role === 'admin') {
    return (
      <div className="login-container admin-login">
        {/* Left Section */}
        <div className="left-section admin-section">
          <div className="left-content">
            <div className="badge admin-badge">
              <CheckCircle />
              <span>Secure Admin Access</span>
            </div>

            <h1 className="main-heading admin-heading">Administrative Control Panel</h1>

            <p className="description admin-desc">
              Manage students, courses, faculty, grades, and all institutional operations from a unified dashboard with advanced analytics and reporting tools.
            </p>

            <div className="statistics admin-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Managed Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">System Uptime</div>
              </div>
            </div>

            <div className="left-footer">
              <p>© 2026 University Admin Portal. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section admin-right">
          <div className="login-card admin-card-form">
            <button 
              className="back-button admin-back"
              onClick={() => setRole(null)}
            >
              <ArrowLeft /> Back
            </button>

            <div className="card-icon admin-icon">
              <ShieldAdmin />
            </div>

            <h2 className="card-title admin-title">Admin Portal</h2>

            <p className="card-subtitle admin-subtitle">
              Secure authentication required for administrative access.
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="adminId">Admin ID</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="text"
                    id="adminId"
                    placeholder="Enter your admin ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className={`form-input admin-input ${errors.userId ? 'input-error' : ''}`}
                  />
                </div>
                {errors.userId && (
                  <span className="error-message">{errors.userId}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="adminPassword">Master Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="adminPassword"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-input admin-input ${errors.password ? 'input-error' : ''}`}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <div className="form-footer">
                <label className="checkbox-label admin-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span>Trust this device</span>
                </label>
                <a href="#" className="forgot-password">
                  Need help?
                </a>
              </div>

              <button
                type="submit"
                className={`sign-in-button admin-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Access Portal
                    <ArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="security-notice">
              <p>🔒 All admin activities are logged and monitored for security.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
