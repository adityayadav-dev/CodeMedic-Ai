/* ============================================================
   THEME — Dark / Light mode toggle
   ============================================================ */

/**
 * Reads saved theme from localStorage, or defaults to 'light'.
 * Applies the theme to the <html> element immediately.
 */
function applySavedTheme() {
    const saved = localStorage.getItem('codemedic-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
}

/**
 * Toggles between light and dark themes.
 * Persists the choice in localStorage.
 */
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('codemedic-theme', next);
}
