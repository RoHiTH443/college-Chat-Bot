import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import * as api from './api.js';

export default function AdminParagraph() {
  const navigate = useNavigate();
  const [paragraph, setParagraph] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
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
        setDocsError(err.message || 'Failed to load saved entries.');
      } finally {
        if (mounted) setDocsLoading(false);
      }
    }

    loadDocuments();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSaveParagraph = async () => {
    if (!paragraph.trim()) {
      setSaveError('Please enter a paragraph.');
      return;
    }

    const formData = new FormData();
    formData.append('description', paragraph.trim());
    formData.append('content', paragraph.trim());
    formData.append('category', 'Other');
    formData.append('visibleToAll', 'true');
    formData.append('requireSignature', 'false');

    setSaving(true);
    setSaveError('');
    try {
      const data = await api.documents.upload(formData);
      if (data?.document) {
        setRecentDocuments((prev) => [data.document, ...prev].slice(0, 8));
      }
      setSaveSuccess(true);
      setParagraph('');
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setSaveError(err.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">Add Paragraph</h2>
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

        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Knowledge Paragraph</h3>
            <p className="text-slate-500">Add a paragraph to the chatbot knowledge base.</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="p-8 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Paragraph</label>
                <textarea
                  rows={10}
                  placeholder="Write the paragraph you want to add to the chatbot knowledge base..."
                  value={paragraph}
                  onChange={(e) => setParagraph(e.target.value)}
                  className="w-full p-4 rounded-lg border border-slate-300 text-slate-900 outline-none transition-all resize-none placeholder:text-slate-400 focus:ring-2"
                />
              </div>
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
              <div className="flex-1">
                {saveError && (
                  <p className="text-sm text-red-600 font-medium">{saveError}</p>
                )}
                {saveSuccess && (
                  <p className="text-sm text-green-600 font-medium">Paragraph saved successfully!</p>
                )}
              </div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveParagraph}
                disabled={saving || saveSuccess}
                className="px-8 py-2.5 text-white font-semibold rounded-lg text-sm flex items-center gap-2 transition-all disabled:opacity-60"
                style={{ background: '#2463eb', boxShadow: '0 2px 8px rgba(36,99,235,0.25)' }}
              >
                <span className="material-symbols-outlined text-lg">check_circle</span>
                {saving ? 'Saving...' : 'Save Paragraph'}
              </button>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 rounded-lg border" style={{ background: 'rgba(36,99,235,0.05)', borderColor: 'rgba(36,99,235,0.2)' }}>
            <span className="material-symbols-outlined mt-0.5" style={{ color: '#2463eb' }}>info</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#2463eb' }}>Knowledge Base Note</p>
              <p className="text-xs text-slate-500 mt-1">Saved paragraphs are indexed into the chatbot knowledge base and stored alongside the existing documents list.</p>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-800">Recently Saved Entries</h4>
              <button
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                onClick={() => navigate('/admin/dashboard')}
              >
                View all
              </button>
            </div>

            {docsLoading && <p className="p-4 text-sm text-slate-500">Loading entries...</p>}
            {docsError && <p className="p-4 text-sm text-red-600">{docsError}</p>}

            {!docsLoading && !docsError && recentDocuments.length === 0 && (
              <p className="p-4 text-sm text-slate-500">No entries saved yet.</p>
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
