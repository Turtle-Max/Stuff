function renameButtons() {
    document.querySelectorAll('.buttons-container > *').forEach(btn => {
        let raw = (btn.value || btn.textContent || '').trim();
        // 1. Remove "cl" prefix (case‑insensitive)
        let display = raw.replace(/^cl/i, '');
        // 2. Remove ".html" extension
        display = display.replace(/\.html$/i, '');
        // 3. Remove trailing " (1)", " (2)", etc. (with optional spaces)
        display = display.replace(/\s*\(\d+\)$/, '');
        // Update the button text
        if (btn.tagName.toLowerCase() === 'input') {
            btn.value = display;
        } else {
            btn.textContent = display;
        }
    });
}
