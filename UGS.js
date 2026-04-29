// UGS.js – Remove "cl" prefix, alphabetical order, search, random gradients (v1.0.13)
(function() {

    // --- CSS helper for hiding during search ---
    const style = document.createElement('style');
    style.textContent = `.hidden-btn { display: none !important; }`;
    document.head.appendChild(style);

    // ---------- Rename ----------
    function renameButtons() {
        document.querySelectorAll('.buttons-container > *').forEach(btn => {
            let raw = (btn.value || btn.textContent || '').trim();
            let display = raw.replace(/^cl/i, '').replace(/\.html$/i, '');
            if (btn.tagName.toLowerCase() === 'input') {
                btn.value = display;
            } else {
                btn.textContent = display;
            }
        });
    }

    // ---------- Replace "No files" buttons with text ----------
    function fixEmptyButtons() {
        document.querySelectorAll('.buttons-container > *').forEach(btn => {
            let text = (btn.value || btn.textContent || '').trim().toLowerCase();
            if (text === 'no files' || text === 'nofiles') {
                // Replace the button with a simple text element
                const span = document.createElement('span');
                span.textContent = 'No files';
                span.style.color = 'rgba(255,255,255,0.6)';
                span.style.fontStyle = 'italic';
                span.style.padding = '10px';
                btn.replaceWith(span);
            }
        });
    }

    // ---------- Assign random gradients ----------
    function assignRandomGradients() {
        const buttons = document.querySelectorAll('.buttons-container > *');
        buttons.forEach(btn => {
            // Skip if it's not an actual button/input
            if (btn.tagName.toLowerCase() !== 'input' && btn.tagName.toLowerCase() !== 'button') return;
            // Generate a vibrant, unique gradient
            const hue1 = Math.floor(Math.random() * 360);
            const hue2 = (hue1 + 40 + Math.floor(Math.random() * 80)) % 360;
            const gradient = `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
            btn.style.background = gradient;
        });
    }

    // ---------- Search ----------
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const noResults = document.getElementById('noResults');
        if (!searchInput) {
            console.warn('UGS: searchInput not found');
            return;
        }

        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase().trim();
            const allItems = document.querySelectorAll('.buttons-container > *'); // includes both buttons and text spans
            let visible = 0;

            allItems.forEach(el => {
                // Only hide functional buttons, not the "No files" text (but it can be hidden too if no match)
                const text = (el.value || el.textContent || '').toLowerCase();
                if (term === '' || text.includes(term)) {
                    el.classList.remove('hidden-btn');
                    visible++;
                } else {
                    el.classList.add('hidden-btn');
                }
            });

            if (noResults) {
                noResults.style.display = (visible === 0 && term !== '') ? 'block' : 'none';
            }
        });
    }

    // ---------- Run when buttons exist ----------
    function init() {
        renameButtons();
        fixEmptyButtons();   // replace any "No files" button
        assignRandomGradients();  // unique colour per button
        setupSearch();
    }

    function waitForButtons() {
        if (document.querySelectorAll('.buttons-container > *').length > 0) {
            init();
        } else {
            setTimeout(waitForButtons, 100);
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        waitForButtons();
    } else {
        window.addEventListener('DOMContentLoaded', waitForButtons);
    }
})();
