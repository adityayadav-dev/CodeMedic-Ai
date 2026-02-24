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
 *  - Wraps triple-backtick code blocks in <pre><code>
 *  - Wraps inline `code` in <code>
 */
function formatText(text) {
    let safe = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // Code blocks (```)
    safe = safe.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');

    return safe;
}

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
 *  1. Renders the user bubble
 *  2. Hides the welcome screen
 *  3. Shows a typing indicator
 *  4. After a short delay, shows a mock AI reply
 * @param {string} text — the user's message
 * @param {function} resetInput — callback to clear & reset the input field
 */
function sendMessage(text, resetInput) {
    if (!text) return;

    // Hide welcome screen if visible
    if (welcomeEl) welcomeEl.style.display = 'none';

    // Add user message
    chatEl.appendChild(createMessageEl('user', text));
    scrollToBottom();

    // Clear input
    resetInput();

    // Show typing indicator
    const typing = createTypingIndicator();
    chatEl.appendChild(typing);
    scrollToBottom();

    // Simulate AI reply after a short delay
    setTimeout(() => {
        typing.remove();
        const reply = getMockReply(text);
        chatEl.appendChild(createMessageEl('ai', reply));
        scrollToBottom();
    }, 1200 + Math.random() * 800);
}

/** Clears all messages and shows the welcome screen again. */
function clearChat() {
    chatEl.querySelectorAll('.message').forEach((m) => m.remove());
    if (welcomeEl) welcomeEl.style.display = '';
}
