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
const fileInput = document.getElementById('fileInput');
const attachmentsContainer = document.getElementById('attachmentsContainer');

// ========== STATE ==========
let attachedFiles = []; // Array of { name, type, data }

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
    attachedFiles = [];
    renderAttachments();
    checkSendButtonStatus();
}

function checkSendButtonStatus() {
    // Enable send if there's text or if there are attached files
    sendBtn.disabled = userInput.value.trim() === '' && attachedFiles.length === 0;
}

// ========== EVENT LISTENERS ==========

// Theme toggle
themeToggle.addEventListener('click', toggleTheme);

// Auto-resize + enable/disable send
userInput.addEventListener('input', () => {
    autoResize();
    checkSendButtonStatus();
});

// Send on button click
sendBtn.addEventListener('click', () => {
    sendMessage(userInput.value.trim(), resetInput, attachedFiles);
});

// Send on Enter (Shift+Enter for new line)
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        // Only send if not disabled (either text or files exist)
        if (!sendBtn.disabled) {
            sendMessage(userInput.value.trim(), resetInput, attachedFiles);
        }
    }
});

// Suggestion chips
document.querySelectorAll('.suggestion-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
        userInput.value = chip.getAttribute('data-prompt');
        checkSendButtonStatus();
        sendMessage(userInput.value.trim(), resetInput, attachedFiles);
    });
});

// New Chat
newChatBtn.addEventListener('click', () => {
    clearChat();
    resetInput();
});

// Attach button click -> opens file dialog
attachBtn.addEventListener('click', () => {
    fileInput.click();
});

// File input change -> read files
fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
        const reader = new FileReader();

        reader.onload = (event) => {
            attachedFiles.push({
                name: file.name,
                type: file.type || getExtensionType(file.name),
                data: event.target.result // base64 / data URL
            });
            renderAttachments();
            checkSendButtonStatus();
        };

        reader.readAsDataURL(file);
    }

    // reset input so the same file could be selected again if removed
    fileInput.value = '';
});

// Render the attached files UI
function renderAttachments() {
    attachmentsContainer.innerHTML = '';

    attachedFiles.forEach((file, index) => {
        const chip = document.createElement('div');
        chip.classList.add('attachment-chip');

        // Truncate name if it's too long
        chip.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
            <span title="${file.name}">${file.name}</span>
            <button class="attachment-btn-remove" data-index="${index}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
        `;

        attachmentsContainer.appendChild(chip);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.attachment-btn-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.currentTarget.getAttribute('data-index');
            attachedFiles.splice(index, 1);
            renderAttachments();
            checkSendButtonStatus();
        });
    });
}

function getExtensionType(filename) {
    if (filename.endsWith('.js')) return 'text/javascript';
    if (filename.endsWith('.html')) return 'text/html';
    if (filename.endsWith('.css')) return 'text/css';
    if (filename.endsWith('.json')) return 'application/json';
    if (filename.endsWith('.md')) return 'text/markdown';
    return 'text/plain';
}
