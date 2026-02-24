/* ============================================================
   REPLIES — Mock AI responses (replace with backend later)
   ============================================================ */

/**
 * Returns a context-aware mock reply based on the user's input.
 * This will be replaced with real backend calls later.
 * @param {string} userText — the user's message
 * @returns {string}
 */
function getMockReply(userText) {
    const lower = userText.toLowerCase();

    if (lower.includes('undefined')) {
        return `That usually happens when a variable hasn't been assigned a value, or a function doesn't have a \`return\` statement.\n\nCommon causes:\n• Accessing an object property that doesn't exist\n• Forgetting to return a value from a function\n• Calling a function before it's defined\n\nCould you share the relevant code snippet? I can pinpoint the exact issue.`;
    }

    if (lower.includes('typeerror') || lower.includes('cannot read')) {
        return `This is a classic \`TypeError\`. It means you're trying to access a property on something that is \`null\` or \`undefined\`.\n\nQuick fix checklist:\n1. Check if the variable is properly initialised\n2. Add a null-check before accessing .property\n3. Verify your API response structure\n\n\`\`\`js\n// Example guard\nif (data && data.user) {\n  console.log(data.user.name);\n}\n\`\`\``;
    }

    if (lower.includes('error') || lower.includes('bug') || lower.includes('fix')) {
        return `I'd be happy to help debug that! To give you the best answer I need a bit more context:\n\n1. The exact error message (if any)\n2. The relevant code snippet\n3. What you expected vs. what actually happened\n\nPaste those in and I'll take a look 🔍`;
    }

    if (lower.includes('review') || lower.includes('code')) {
        return `Sure, paste your code and I'll review it for:\n\n• **Logic errors** — incorrect conditions, off-by-one, etc.\n• **Performance** — unnecessary loops, redundant calls\n• **Best practices** — naming, structure, edge cases\n\nJust drop the snippet here when you're ready!`;
    }

    // Default reply
    return `Thanks for your message! I'm a mock AI right now — the backend isn't connected yet.\n\nOnce the backend is wired up, I'll be able to:\n• Analyse your code for bugs\n• Explain error messages\n• Suggest fixes with code examples\n\nFeel free to test the UI in the meantime! 🚀`;
}
