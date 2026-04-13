import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ChatPage from './ChatPage.jsx'
import StudentDashboard from './StudentDashboard.jsx'
import StudentQueries from './StudentQueries.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminParagraph from './AdminParagraph.jsx'
import AdminQueries from './AdminQueries.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/queries" element={<StudentQueries />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/upload" element={<Navigate to="/admin/paragraph" replace />} />
        <Route path="/admin/paragraph" element={<AdminParagraph />} />
        <Route path="/admin/queries" element={<AdminQueries />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
