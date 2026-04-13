<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gemini Chatbot</title>
    <style>
        :root {
            --bg: #0f172a;
            --panel: #111827;
            --panel-soft: #1f2937;
            --accent: #38bdf8;
            --accent-2: #22c55e;
            --text: #e5e7eb;
            --muted: #94a3b8;
            --border: rgba(148, 163, 184, 0.2);
        }

        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background:
                radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 35%),
                radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.12), transparent 30%),
                var(--bg);
            color: var(--text);
            min-height: 100vh;
        }

        .shell {
            max-width: 1080px;
            margin: 0 auto;
            padding: 24px;
        }

        .hero {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 20px;
            align-items: stretch;
        }

        .card {
            background: rgba(17, 24, 39, 0.9);
            border: 1px solid var(--border);
            border-radius: 24px;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(12px);
        }

        .brand {
            padding: 28px;
        }

        .brand h1 {
            margin: 0 0 10px;
            font-size: clamp(2rem, 4vw, 3.5rem);
            line-height: 1;
        }

        .brand p {
            margin: 0;
            color: var(--muted);
            line-height: 1.6;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(56, 189, 248, 0.12);
            color: #7dd3fc;
            border: 1px solid rgba(56, 189, 248, 0.2);
            font-size: 0.875rem;
            margin-bottom: 18px;
        }

        .stats {
            padding: 28px;
            display: grid;
            gap: 14px;
        }

        .stat {
            background: rgba(31, 41, 55, 0.75);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 16px;
        }

        .stat strong {
            display: block;
            margin-bottom: 6px;
            color: #fff;
        }

        .chat-card {
            margin-top: 20px;
            padding: 20px;
        }

        .chat-window {
            height: min(64vh, 640px);
            overflow-y: auto;
            padding: 8px;
            display: flex;
            flex-direction: column;
            gap: 14px;
        }

        .message {
            max-width: min(75%, 760px);
            padding: 14px 16px;
            border-radius: 18px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-word;
            animation: pop 0.18s ease-out;
        }

        .message.user {
            align-self: flex-end;
            background: linear-gradient(135deg, var(--accent), #2563eb);
            color: white;
            border-bottom-right-radius: 6px;
        }

        .message.bot {
            align-self: flex-start;
            background: rgba(31, 41, 55, 0.95);
            border: 1px solid var(--border);
            border-bottom-left-radius: 6px;
        }

        .composer {
            display: flex;
            gap: 12px;
            margin-top: 16px;
        }

        .composer input {
            flex: 1;
            background: rgba(15, 23, 42, 0.7);
            color: var(--text);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 14px 16px;
            font-size: 1rem;
            outline: none;
        }

        .composer input:focus {
            border-color: rgba(56, 189, 248, 0.55);
            box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.12);
        }

        .composer button {
            background: linear-gradient(135deg, var(--accent-2), #16a34a);
            color: white;
            border: none;
            border-radius: 16px;
            padding: 0 22px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.15s ease, opacity 0.15s ease;
        }

        .composer button:hover { transform: translateY(-1px); }
        .composer button:disabled { opacity: 0.65; cursor: not-allowed; }

        .status {
            margin-top: 10px;
            color: var(--muted);
            font-size: 0.92rem;
            min-height: 1.2em;
        }

        .typing {
            display: inline-flex;
            gap: 6px;
            align-items: center;
        }

        .dot {
            width: 7px;
            height: 7px;
            border-radius: 999px;
            background: #7dd3fc;
            animation: blink 1s infinite ease-in-out;
        }

        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }

        @keyframes blink {
            0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
            40% { opacity: 1; transform: translateY(-2px); }
        }

        @keyframes pop {
            from { transform: translateY(6px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 900px) {
            .hero { grid-template-columns: 1fr; }
            .message { max-width: 90%; }
        }
    </style>
</head>
<body>
<div class="shell">
    <div class="hero">
        <section class="card brand">
            <div class="badge">Google Gemini API</div>
            <h1>Servlet + JSP Chatbot</h1>
            <p>
                Ask a question and the backend will forward it to Gemini through a clean MVC flow.
                The response is returned as JSON and rendered dynamically in this page.
            </p>
        </section>

        <aside class="card stats">
            <div class="stat">
                <strong>MVC structure</strong>
                <span>JSP view, Servlet controller, and Gemini service layer.</span>
            </div>
            <div class="stat">
                <strong>Transport</strong>
                <span>OkHttp POST request to Gemini with JSON payload.</span>
            </div>
            <div class="stat">
                <strong>Deployment</strong>
                <span>Package as WAR and deploy to Apache Tomcat.</span>
            </div>
        </aside>
    </div>

    <main class="card chat-card">
        <div id="chatWindow" class="chat-window" aria-live="polite">
            <div class="message bot">Hello. I am your chatbot. Ask me anything about campus, documents, or general support.</div>
        </div>

        <form id="chatForm" class="composer">
            <input
                type="text"
                id="messageInput"
                name="message"
                placeholder="Type your message here..."
                autocomplete="off"
                required
            />
            <button type="submit" id="sendBtn">Send</button>
        </form>
        <div id="statusText" class="status"></div>
    </main>
</div>

<script>
    const contextPath = '<%= request.getContextPath() %>';
    const form = document.getElementById('chatForm');
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatWindow = document.getElementById('chatWindow');
    const statusText = document.getElementById('statusText');

    function scrollToBottom() {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function appendMessage(text, role) {
        const bubble = document.createElement('div');
        bubble.className = `message ${role}`;
        bubble.textContent = text;
        chatWindow.appendChild(bubble);
        scrollToBottom();
    }

    function showTyping() {
        const indicator = document.createElement('div');
        indicator.id = 'typingIndicator';
        indicator.className = 'message bot';
        indicator.innerHTML = '<span class="typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>';
        chatWindow.appendChild(indicator);
        scrollToBottom();
    }

    function hideTyping() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.remove();
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const message = input.value.trim();
        if (!message) {
            return;
        }

        appendMessage(message, 'user');
        input.value = '';
        sendBtn.disabled = true;
        statusText.textContent = 'Generating response...';
        showTyping();

        try {
            const payload = new URLSearchParams();
            payload.append('message', message);

            const response = await fetch(`${contextPath}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: payload.toString()
            });

            const data = await response.json();
            hideTyping();

            if (!response.ok || !data.success) {
                appendMessage(data.error || 'An error occurred while generating a response.', 'bot');
                statusText.textContent = 'Request failed.';
                return;
            }

            appendMessage(data.response, 'bot');
            statusText.textContent = 'Response received.';
        } catch (error) {
            hideTyping();
            appendMessage('Unable to contact the server. Please try again.', 'bot');
            statusText.textContent = 'Network error.';
        } finally {
            sendBtn.disabled = false;
            input.focus();
        }
    });
</script>
</body>
</html>
