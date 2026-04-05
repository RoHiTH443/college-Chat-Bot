import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import * as api from './api.js';

export default function AdminUploadDocument() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [visibleToAll, setVisibleToAll] = useState(false);
  const [requireSignature, setRequireSignature] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [docsError, setDocsError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadDocuments() {
      try {
        setDocsLoading(true);
        setDocsError('');
        const data = await api.documents.getAll({ page: 1, limit: 8 });
        if (!mounted) return;
        setRecentDocuments(data?.documents || []);
      } catch (err) {
        if (!mounted) return;
        setDocsError(err.message || 'Failed to load uploaded documents.');
      } finally {
        if (mounted) setDocsLoading(false);
      }
    }

    loadDocuments();
    return () => {
      mounted = false;
    };
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) { setUploadError('Please select a file.'); return; }
    if (!title.trim()) { setUploadError('Please enter a document title.'); return; }
    if (!category) { setUploadError('Please select a category.'); return; }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('visibleToAll', visibleToAll);
    formData.append('requireSignature', requireSignature);

    setUploading(true);
    setUploadError('');
    try {
      const data = await api.documents.upload(formData);
      if (data?.document) {
        setRecentDocuments((prev) => [data.document, ...prev].slice(0, 8));
      }
      setUploadSuccess(true);
      setSelectedFile(null);
      setTitle('');
      setCategory('');
      setDescription('');
      setVisibleToAll(false);
      setRequireSignature(false);
      setTimeout(() => setUploadSuccess(false), 2500);
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* â”€â”€ Sidebar â”€â”€ */}
      <AdminSidebar />

      {/* â”€â”€ Main Content â”€â”€ */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">Upload New Document</h2>
          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors border border-slate-200">
              Admin Actions
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Document Repository</h3>
            <p className="text-slate-500">Add course materials, circulars, or research papers to the portal.</p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="p-8 flex flex-col gap-8">

              {/* Drag & Drop Area */}
              <div
                className="relative cursor-pointer"
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div
                  className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all duration-200"
                  style={{
                    borderColor: dragOver ? '#2463eb' : '#cbd5e1',
                    background: dragOver ? 'rgba(36,99,235,0.04)' : 'transparent',
                  }}
                >
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform" style={{ background: 'rgba(36,99,235,0.1)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#2463eb' }}>upload_file</span>
                  </div>
                  {selectedFile ? (
                    <>
                      <h4 className="text-lg font-semibold text-slate-800 mb-1">{selectedFile.name}</h4>
                      <p className="text-slate-500 text-sm">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB â€” click to change</p>
                    </>
                  ) : (
                    <>
                      <h4 className="text-lg font-semibold text-slate-800 mb-1">Click to upload or drag and drop</h4>
                      <p className="text-slate-500 text-sm mb-6">PDF, DOCX up to 25MB</p>
                      <button
                        type="button"
                        className="px-6 py-2.5 text-white font-semibold rounded-lg text-sm transition-colors"
                        style={{ background: '#2463eb' }}
                      >
                        Select File from Computer
                      </button>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>

              {/* Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Document Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Advanced Calculus Lecture Notes"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full h-11 px-4 rounded-lg border border-slate-300 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2"
                    style={{ '--tw-ring-color': 'rgba(36,99,235,0.2)' }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700">Category</label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full h-11 pl-4 pr-10 appearance-none rounded-lg border border-slate-300 text-slate-900 bg-white outline-none transition-all focus:ring-2"
                    >
                      <option value="">Select a category</option>
                      <option value="Course Material">Lecture Notes</option>
                      <option value="Circular">Circulars</option>
                      <option value="Other">Assignments</option>
                      <option value="Exam Schedule">Past Exam Papers</option>
                      <option value="Research Paper">Research Publication</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">unfold_more</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea
                  rows={4}
                  placeholder="Briefly describe the contents of this document for students and faculty..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-4 rounded-lg border border-slate-300 text-slate-900 outline-none transition-all resize-none placeholder:text-slate-400 focus:ring-2"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleToAll}
                    onChange={e => setVisibleToAll(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-600">Make visible to all students</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={requireSignature}
                    onChange={e => setRequireSignature(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-600">Require signature on receipt</span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="flex-1">
                {uploadError && (
                  <p className="text-sm text-red-600 font-medium">{uploadError}</p>
                )}
                {uploadSuccess && (
                    <p className="text-sm text-green-600 font-medium">Document uploaded successfully!</p>
                )}
              </div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || uploadSuccess}
                className="px-8 py-2.5 text-white font-semibold rounded-lg text-sm flex items-center gap-2 transition-all disabled:opacity-60"
                style={{ background: '#2463eb', boxShadow: '0 2px 8px rgba(36,99,235,0.25)' }}
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                {uploading ? 'Uploading...' : 'Upload PDF'}
              </button>
            </div>
          </div>

          {/* Storage Info */}
          <div className="mt-6 flex items-start gap-3 p-4 rounded-lg border" style={{ background: 'rgba(36,99,235,0.05)', borderColor: 'rgba(36,99,235,0.2)' }}>
            <span className="material-symbols-outlined mt-0.5" style={{ color: '#2463eb' }}>info</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#2463eb' }}>Departmental Storage Usage</p>
              <p className="text-xs text-slate-500 mt-1">You have used 12.4 GB of your 50 GB departmental document storage quota. Large files over 100MB should be linked via Cloud Drive.</p>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-800">Recently Uploaded Documents</h4>
              <button
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                onClick={() => navigate('/admin/dashboard')}
              >
                View all
              </button>
            </div>

            {docsLoading && <p className="p-4 text-sm text-slate-500">Loading documents...</p>}
            {docsError && <p className="p-4 text-sm text-red-600">{docsError}</p>}

            {!docsLoading && !docsError && recentDocuments.length === 0 && (
              <p className="p-4 text-sm text-slate-500">No documents uploaded yet.</p>
            )}

            {!docsLoading && !docsError && recentDocuments.length > 0 && (
              <div className="divide-y divide-slate-100">
                {recentDocuments.map((doc) => (
                  <div key={doc._id} className="px-5 py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{doc.title}</p>
                      <p className="text-xs text-slate-500 truncate">{doc.category} • {new Date(doc.createdAt).toLocaleString()}</p>
                    </div>
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                    >
                      Open
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


