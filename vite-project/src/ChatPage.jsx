import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { queries } from './api';

/* ── SVG helpers ── */
const BookIcon = () => (
  <img src="/bit.jpg" alt="BIT Logo" className="h-8 w-8 object-contain rounded" />
);
const BoltIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const SendIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const CalendarIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

/* ── Typing dots ── */
const TypingDots = () => (
  <div className="flex justify-start items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-600">
      <BoltIcon />
    </div>
    <div className="bg-[#F8FAFC] px-4 py-2 rounded-2xl rounded-tl-none text-xs flex items-center border border-[#E2E8F0]">
      <span className="mr-2 text-[#64748B]">ChatBot is typing</span>
      <span style={dotStyle(0)} />
      <span style={dotStyle(0.2)} />
      <span style={dotStyle(0.4)} />
    </div>
  </div>
);

const dotStyle = (delay) => ({
  display: 'inline-block',
  width: 4,
  height: 4,
  margin: '0 1px',
  backgroundColor: '#0F172A',
  borderRadius: '50%',
  animation: `chatTyping 1.4s ${delay}s infinite`,
});

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'user',
    text: 'Hey ChatBot! Can you help me find the current scholarship deadlines for the Computer Science department?',
  },
  {
    id: 2,
    role: 'bot',
    text: null,
    rich: true,
  },
  {
    id: 3,
    role: 'user',
    text: "That's great. Also, what are the library hours for this weekend?",
  },
];

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [queryPopup, setQueryPopup] = useState({
    open: false,
    subject: 'General Query',
    message: '',
    isSubmitting: false,
    error: '',
    success: '',
  });
  const bottomRef = useRef(null);

  const openQueryPopup = () => {
    setQueryPopup({
      open: true,
      subject: 'General Query',
      message: '',
      isSubmitting: false,
      error: '',
      success: '',
    });
  };

  const closeQueryPopup = () => {
    if (queryPopup.isSubmitting) return;
    setQueryPopup((prev) => ({ ...prev, open: false, error: '', success: '' }));
  };

  const handleQueryFieldChange = (field, value) => {
    setQueryPopup((prev) => ({ ...prev, [field]: value, error: '', success: '' }));
  };

  const submitQueryToAdmin = async () => {
    const subject = queryPopup.subject.trim();
    const message = queryPopup.message.trim();

    if (!subject || !message) {
      setQueryPopup((prev) => ({ ...prev, error: 'Please enter both subject and message.' }));
      return;
    }

    try {
      setQueryPopup((prev) => ({ ...prev, isSubmitting: true, error: '', success: '' }));
      await queries.create({ subject, message });

      setQueryPopup((prev) => ({
        ...prev,
        isSubmitting: false,
        success: 'Your query has been submitted to admin.',
        subject: 'General Query',
        message: '',
      }));
    } catch (err) {
      setQueryPopup((prev) => ({
        ...prev,
        isSubmitting: false,
        error: err?.message || 'Failed to submit query. Please try again.',
      }));
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const newId = Date.now();
    setMessages((prev) => [...prev, { id: newId, role: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    try {
      setIsSending(true);
      const res = await fetch('https://college-chat-bot-z5sj.onrender.com/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to get chatbot response');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: newId + 1,
          role: 'bot',
          text: data?.message?.text || 'I could not generate a response right now. Please try again.',
        },
      ]);
    } catch (_err) {
      setMessages((prev) => [
        ...prev,
        {
          id: newId + 1,
          role: 'bot',
          text: 'Sorry, I could not reach the chatbot service right now. Please try again.',
        },
      ]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <style>{`
        @keyframes chatTyping {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
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
        {/* ── Left Sidebar ── */}
        <aside className="w-72 chat-glass rounded-2xl flex flex-col p-6 h-full flex-shrink-0">
          {/* Branding */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10  rounded-xl flex items-center justify-center chat-glow">
              <BookIcon />
            </div>
            <div>
              <h1 className="text-[#0F172A] font-bold text-lg leading-tight">FAQ ChatBot</h1>
              <p className="text-xs text-[#64748B] font-medium tracking-wide">ASSISTANT</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="mb-8 flex items-center gap-3 p-3 chat-glass-dark rounded-xl border border-[#E2E8F0]">
            {/* <div className="w-10 h-10 rounded-full border border-[#E2E8F0] bg-[#F1F5F9] flex items-center justify-center text-[#0F172A] font-bold text-sm flex-shrink-0">
              RM
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
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-[#F1F5F9] text-[#64748B]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span className="text-sm font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-[#0F172A]/5 text-[#0F172A] border border-[#0F172A]/15">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              <span className="text-sm font-medium">AI Chat</span>
            </a>
            <a
              href="https://campustour.bitsathy.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-[#F1F5F9] text-[#64748B]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="text-sm font-medium">Campus Map</span>
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); navigate('/queries'); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-[#F1F5F9] text-[#64748B]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
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

        {/* ── Center Chat Pane ── */}
        <main className="flex-1 flex flex-col h-full chat-glass rounded-2xl overflow-hidden relative">
          {/* Header */}
          <header className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-white/60 flex-shrink-0">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                Chat with AI
                <span className="flex h-2 w-2 rounded-full bg-[#0F172A] chat-glow" />
              </h2>
              <p className="text-xs text-[#64748B]">Your interactive guide for campus life, academics, and beyond.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 chat-glass-dark rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <svg className="h-5 w-5 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              <button className="p-2 chat-glass-dark rounded-lg hover:bg-[#F1F5F9] transition-colors">
                <svg className="h-5 w-5 text-[#64748B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
              </button>
            </div>
          </header>

          {/* Messages */}
          
            {/* Overlay to keep messages readable */}
            <div className="absolute inset-0 bg-white/80 pointer-events-none" />
            <div className="relative z-10 space-y-6">
            <div className="flex justify-center">
              <span className="text-[10px] text-[#64748B] bg-[#F8FAFC] px-3 py-1 rounded-full border border-[#E2E8F0] uppercase tracking-widest font-bold">Today</span>
            </div>

            {messages.map((msg) => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end items-start gap-3">
                    <div className="max-w-[70%] bg-[#F1F5F9] border border-[#E2E8F0] px-4 py-3 rounded-2xl rounded-tr-none text-sm text-[#0F172A] leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                    {/* <div className="w-8 h-8 rounded-full border border-[#E2E8F0] flex-shrink-0 bg-[#F1F5F9] flex items-center justify-center text-[#0F172A] font-bold text-xs">
                      RM
                    </div> */}
                     <img src="/rohith.jpg" alt="Profile" className="w-10 h-10 rounded-full border border-[#E2E8F0] object-cover flex-shrink-0" />
                  </div>
                );
              }
              if (msg.rich) {
                return (
                  <div key={msg.id} className="flex justify-start items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 text-[#0F172A]">
                      <img src="/ai.png" alt="AI Bot" className="h-6 w-6 object-contain rounded-full" />
                    </div>
                    <div className="max-w-[70%] bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 rounded-2xl rounded-tl-none text-sm text-[#0F172A] leading-relaxed">
                      <p className="mb-2">Hello Alex! For the Fall 2024 semester, the CS department scholarship application dates are as follows:</p>
                      <ul className="list-disc list-inside space-y-1 text-[#0F172A] text-xs font-medium mb-3">
                        <li>Merit-Based Excellence: Oct 15th</li>
                        <li>Undergraduate Research: Nov 1st</li>
                        <li>Diversity in Tech: Dec 10th</li>
                      </ul>
                      <p>Would you like me to link the application portal for you?</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button className="px-3 py-1.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#0F172A] text-white rounded-lg text-xs transition-colors">Yes, please link it</button>
                        <button className="px-3 py-1.5 chat-glass-dark hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] rounded-lg text-xs transition-colors">Check eligibility</button>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={msg.id} className="flex justify-start items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 border border-[#E2E8F0] flex items-center justify-center flex-shrink-0 text-[#0F172A]">
                     <img src="/ai.png" alt="AI Bot" className="h-6 w-6 object-contain rounded-full" />
                  </div>
                  <div className="max-w-[70%] bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3 rounded-2xl rounded-tl-none text-sm text-[#0F172A] leading-relaxed">
                    <div className="space-y-1">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ ...props }) => <p className="my-1" {...props} />,
                          ul: ({ ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                          ol: ({ ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                          li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
                          strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
                          a: ({ ...props }) => <a className="underline" target="_blank" rel="noreferrer" {...props} />,
                          code: ({ ...props }) => <code className="bg-[#E2E8F0] rounded px-1 py-0.5 text-xs" {...props} />,
                        }}
                      >
                        {msg.text || ''}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && <TypingDots />}
            <div ref={bottomRef} />
            </div>{/* end z-10 wrapper */}
        

          {/* Input Footer */}
          <footer className="p-6 pt-2 flex-shrink-0">
            <div className="relative group">
              <div className="absolute inset-0 bg-black/5 blur-xl rounded-2xl group-focus-within:bg-black/10 transition-all duration-300" />
              <div className="relative chat-glass-dark rounded-2xl border border-[#E2E8F0] flex items-center p-2 focus-within:border-[#0F172A]/40 transition-all shadow-2xl">
                <button className="p-3 text-[#64748B] hover:text-[#0F172A] transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                </button>
                <input
                  className="bg-transparent border-none outline-none text-sm text-[#0F172A] placeholder-[#CBD5E1] flex-1 px-2"
                  placeholder="Write your campus query here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button className="p-3 text-[#64748B] hover:text-[#0F172A] transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                </button>
                <button
                  onClick={handleSend}
                  disabled={isSending}
                  className="ml-2 w-10 h-10 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl flex items-center justify-center transition-all chat-glow hover:scale-105 active:scale-95"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
            <p className="text-[10px] text-[#64748B] text-center mt-3">
              University Smart Assistant may provide automated information. Always verify critical deadlines with the Registrar's office.
            </p>
          </footer>
        </main>

        {/* ── Right Pane ── */}
        <aside className="w-80 space-y-4 h-full overflow-y-auto chat-scrollbar flex-shrink-0">

          {/* Contact Info */}
          <div className="chat-glass rounded-2xl p-5 border border-[#E2E8F0]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#0F172A] tracking-wide">Contact Information</h3>
              <span className="px-2 py-0.5 bg-[#0F172A]/5 text-[#0F172A] text-[10px] rounded uppercase font-bold tracking-tighter">Available</span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Support Desk', phone: '+1 (555) 123-4567' },
                { label: 'Hostel Manager', phone: '+1 (555) 987-6543' },
                { label: 'Principal Office', phone: '+1 (555) 246-8135' },
              ].map(({ label, phone }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#64748B] uppercase font-bold">{label}</span>
                    <span className="text-xs text-[#0F172A]">{phone}</span>
                  </div>
                  <button className="p-1.5 chat-glass-dark rounded-lg text-[#0F172A] hover:bg-[#F1F5F9] transition-colors">
                    <PhoneIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Placement This Week */}
          <div className="chat-glass rounded-2xl p-5 border border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0F172A] tracking-wide">
                Placement This Week
              </h3>
              <span className="p-1 text-[#0F172A]">
                <CalendarIcon />
              </span>
            </div>

            <ul className="space-y-3">
              {[
                { company: "TCS", date: "Oct 25, 2024", status: "Ongoing" },
                { company: "Infosys", date: "Oct 27, 2024", status: "Upcoming" },
                { company: "Zoho", date: "Oct 28, 2024", status: "Upcoming" },
              ].map(({ company, date, status }) => {

                const isOngoing = status === "Ongoing";

                return (
                  <li
                    key={company}
                    className="flex flex-col gap-3 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">

                        <div className="w-8 h-8 rounded-lg flex items-center justify-center border bg-gray-100 border-gray-200">
                          <span className="material-symbols-outlined text-gray-700 text-sm">
                            business
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#0F172A] uppercase">
                            {company}
                          </span>
                          <span className="text-[10px] text-[#64748B]">{date}</span>
                        </div>
                      </div>

                      {/* STATUS BADGE */}
                      <span
                        className={`px-2 py-0.5 text-[9px] rounded uppercase font-bold tracking-tighter
              ${isOngoing
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                          }`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* BUTTON */}
                    <button
                      className={`w-full py-1.5 rounded-lg text-[10px] font-semibold border hover:bg-gray-500 transition-all
            ${isOngoing
                          ? "bg-gray"
                          : ""
                        }`}
                    >
                      {isOngoing ? "Register Now" : "View Details"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>




                        {/* Query Options */}
                        <div className="chat-glass rounded-2xl p-5 border border-[#E2E8F0]">
                          <h3 className="text-sm font-bold text-[#0F172A] tracking-wide mb-3">Query Options</h3>
                          <p className="text-[11px] text-[#64748B] mb-4">Choose a quick query type to continue.</p>

                          <button
                            className="w-full py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#1E293B] transition-colors"
                            onClick={openQueryPopup}
                          >
                            Add Query To Admin
                          </button>

                          <button
                            className="w-full mt-2 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#0F172A] text-xs font-semibold hover:bg-[#F1F5F9] transition-colors"
                            onClick={() => navigate('/queries')}
                          >
                            View My Queries
                          </button>

                          
                        </div>

                        {queryPopup.open && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div
                              className="absolute inset-0 bg-black/40"
                              onClick={closeQueryPopup}
                              aria-hidden="true"
                            />

                            <div className="relative w-full max-w-md chat-glass rounded-2xl border border-[#E2E8F0] p-5 shadow-2xl">
                              <div className="flex items-start justify-between gap-3 mb-3">
                                <h3 className="text-base font-bold text-[#0F172A]">Submit Query to Admin</h3>
                                <button
                                  className="text-xs px-2 py-1 rounded-md border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9]"
                                  onClick={closeQueryPopup}
                                >
                                  Close
                                </button>
                              </div>

                              <div className="space-y-3 text-sm text-[#0F172A] leading-relaxed bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Subject</label>
                                  <input
                                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm outline-none focus:border-[#0F172A]/40"
                                    value={queryPopup.subject}
                                    onChange={(e) => handleQueryFieldChange('subject', e.target.value)}
                                    placeholder="Enter subject"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Message</label>
                                  <textarea
                                    className="w-full min-h-28 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm outline-none resize-none focus:border-[#0F172A]/40"
                                    value={queryPopup.message}
                                    onChange={(e) => handleQueryFieldChange('message', e.target.value)}
                                    placeholder="Describe your query for admin"
                                  />
                                </div>

                                {queryPopup.error && (
                                  <p className="text-xs text-red-600">{queryPopup.error}</p>
                                )}
                                {queryPopup.success && (
                                  <p className="text-xs text-green-700">{queryPopup.success}</p>
                                )}
                              </div>

                              <div className="mt-4 flex justify-end gap-2">
                                <button
                                  className="px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs text-[#0F172A] hover:bg-[#F1F5F9]"
                                  disabled={queryPopup.isSubmitting}
                                  onClick={closeQueryPopup}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="px-3 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-semibold hover:bg-[#1E293B]"
                                  onClick={submitQueryToAdmin}
                                  disabled={queryPopup.isSubmitting}
                                >
                                  {queryPopup.isSubmitting ? 'Submitting...' : 'Submit Query'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

        </aside>
      </div>
    </>
  );
}
