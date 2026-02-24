/* ============================================================
   CODEMEDIC AI — Main entry point
   Wires up all event listeners.
   Depends on: js/theme.js, js/replies.js, js/chat.js
   (loaded via separate <script> tags in index.html)
   ============================================================ */

// ========== DOM REFERENCES ==========
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const themeToggle = document.getElementById('themeToggle');
const attachBtn = document.getElementById('attachBtn');

// ========== INIT THEME ==========
applySavedTheme();

// ========== TEXTAREA AUTO-RESIZE ==========
function autoResize() {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
}

/** Resets the input field after sending */
function resetInput() {
    userInput.value = '';
    autoResize();
    sendBtn.disabled = true;
}

// ========== EVENT LISTENERS ==========

// Theme toggle
themeToggle.addEventListener('click', toggleTheme);

// Auto-resize + enable/disable send
userInput.addEventListener('input', () => {
    autoResize();
    sendBtn.disabled = userInput.value.trim() === '';
});

// Send on button click
sendBtn.addEventListener('click', () => {
    sendMessage(userInput.value.trim(), resetInput);
});

// Send on Enter (Shift+Enter for new line)
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(userInput.value.trim(), resetInput);
    }
});

// Suggestion chips
document.querySelectorAll('.suggestion-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
        userInput.value = chip.getAttribute('data-prompt');
        sendBtn.disabled = false;
        sendMessage(userInput.value.trim(), resetInput);
    });
});

// New Chat
newChatBtn.addEventListener('click', () => {
    clearChat();
    resetInput();
});

// Attach button placeholder
attachBtn.addEventListener('click', () => {
    alert('📎 Attach-code feature coming soon!\nThis will let you upload or paste code files.');
});
