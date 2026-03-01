/* ============================================================
   CHAT — Message creation, formatting, sending, scrolling
   ============================================================ */

// DOM references (available because this script loads after the HTML)
const chatEl = document.getElementById('chat');
const welcomeEl = document.getElementById('welcome');

/**
 * Creates a message DOM element.
 * @param {'user' | 'ai'} role  — who sent the message
 * @param {string}         text — the message content
 * @returns {HTMLElement}
 */
function createMessageEl(role, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', `message--${role}`);

    const avatar = document.createElement('div');
    avatar.classList.add('message__avatar');
    avatar.textContent = role === 'user' ? 'U' : 'AI';

    const body = document.createElement('div');
    body.classList.add('message__body');
    body.innerHTML = formatText(text);

    msg.appendChild(avatar);
    msg.appendChild(body);
    return msg;
}

/**
 * Very basic text formatter:
 *  - Wraps triple-backtick code blocks in styled divs with a copy button
 *  - Wraps inline `code` in <code>
 */
function formatText(text) {
    let safe = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Code blocks (```)
    safe = safe.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang || 'code';
        return `<div class="code-block">
            <div class="code-header">
                <span class="code-lang">${language}</span>
                <button class="code-copy-btn" onclick="copyCode(this)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    Copy
                </button>
            </div>
            <pre><code>${code}</code></pre>
        </div>`;
    });

    // Inline code (not part of the block above)
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold text (because markdown from Gemini often includes bold text)
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    return safe;
}

// Global copy function for the inline onclick handler
window.copyCode = function (btn) {
    const codeBlock = btn.closest('.code-block');
    const codeEl = codeBlock.querySelector('code');
    const textToCopy = codeEl.textContent;

    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
};

/** Scrolls the chat area smoothly to the bottom. */
function scrollToBottom() {
    chatEl.scrollTo({ top: chatEl.scrollHeight, behavior: 'smooth' });
}

/** Creates a typing indicator element (three bouncing dots). */
function createTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message', 'message--ai');

    const avatar = document.createElement('div');
    avatar.classList.add('message__avatar');
    avatar.textContent = 'AI';

    const body = document.createElement('div');
    body.classList.add('message__body', 'typing-dots');
    body.innerHTML = '<span></span><span></span><span></span>';

    wrapper.appendChild(avatar);
    wrapper.appendChild(body);
    return wrapper;
}

/**
 * Handles sending a user message:
 *  1. Renders the user bubble with text and file names
 *  2. Hides the welcome screen
 *  3. Shows a typing indicator
 *  4. Calls the backend API
 * @param {string} text — the user's message
 * @param {function} resetInput — callback to clear & reset the input field
 * @param {Array} files - array of attached files
 */
async function sendMessage(text, resetInput, files = []) {
    if (!text && files.length === 0) return;

    // Hide welcome screen if visible
    if (welcomeEl) welcomeEl.style.display = 'none';

    // Format user message to include file names if any attached
    let userMsgHTML = formatText(text);
    if (files.length > 0) {
        userMsgHTML += `<div style="margin-top: 8px; font-size: 0.8rem; color: var(--user-text); opacity: 0.8; display: flex; flex-wrap: wrap; gap: 4px;">`;
        files.forEach(f => {
            userMsgHTML += `<span style="background: rgba(0,0,0,0.15); padding: 2px 6px; border-radius: 4px;">📎 ${f.name}</span>`;
        });
        userMsgHTML += `</div>`;
    }

    // Add user message
    const msgEl = createMessageEl('user', '');
    msgEl.querySelector('.message__body').innerHTML = userMsgHTML;
    chatEl.appendChild(msgEl);

    scrollToBottom();

    // Store payload data before clearing input (which clears files)
    const payload = {
        message: text,
        files: files.map(f => ({ name: f.name, type: f.type, data: f.data }))
    };

    // Clear input
    resetInput();

    // Show typing indicator
    const typing = createTypingIndicator();
    chatEl.appendChild(typing);
    scrollToBottom();

    // Call the backend API
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        typing.remove();

        if (response.ok) {
            chatEl.appendChild(createMessageEl('ai', data.reply));
        } else {
            chatEl.appendChild(createMessageEl('ai', `*Error processing request:* \n${data.error || 'Something went wrong.'}`));
        }
    } catch (error) {
        typing.remove();
        console.error('API Error:', error);
        chatEl.appendChild(createMessageEl('ai', `*Network Error:* Could not connect to the backend server.`));
    }
    scrollToBottom();
}

/** Clears all messages and shows the welcome screen again. */
function clearChat() {
    chatEl.querySelectorAll('.message').forEach((m) => m.remove());
    if (welcomeEl) welcomeEl.style.display = '';
}
