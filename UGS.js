// UGS.js – Remove "cl" prefix, keep alphabetical order, search (v1.0.12)
(function() {

    // Inject a CSS rule for hiding during search
    const style = document.createElement('style');
    style.textContent = `.hidden-btn { display: none !important; }`;
    document.head.appendChild(style);

    // ---------- Rename: strip "cl" and ".html" ----------
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
            const buttons = document.querySelectorAll('.buttons-container > *');
            let visible = 0;

            buttons.forEach(btn => {
                const text = (btn.value || btn.textContent || '').toLowerCase();
                if (term === '' || text.includes(term)) {
                    btn.classList.remove('hidden-btn');
                    visible++;
                } else {
                    btn.classList.add('hidden-btn');
                }
            });

            if (noResults) {
                if (visible === 0 && term !== '') {
                    noResults.style.display = 'block';
                } else {
                    noResults.style.display = 'none';
                }
            }
        });
    }

    // ---------- Init ----------
    function init() {
        renameButtons();
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
