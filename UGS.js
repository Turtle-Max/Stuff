// UGS.js – Rename, shuffle, and search

(function() {
    // ========== PASTE YOUR COMPLETE BASE64 HERE ==========
    const MAPPING_BASE64 = "";  // <-- replace "" with your full string

    let nameMap = null;

    // Try to decode the mapping
    try {
        if (MAPPING_BASE64) {
            nameMap = JSON.parse(atob(MAPPING_BASE64));
        }
    } catch (e) {
        console.warn('UGS: Could not parse name mapping, using raw names.', e);
    }

    function renameButtons() {
        if (!nameMap) return;
        document.querySelectorAll('.buttons-container > *').forEach(btn => {
            let raw = (btn.value || btn.textContent || '').trim();
            // Strip the "cl" prefix and ".html" extension to get the key
            let key = raw.replace(/^cl/i, '').replace(/\.html$/i, '');
            let display = nameMap[key] || key;
            if (btn.tagName.toLowerCase() === 'input') {
                btn.value = display;
            } else {
                btn.textContent = display;
            }
        });
    }

    function shuffleButtons() {
        const container = document.getElementById('sections-container');
        if (!container) return;
        const buttonsContainers = container.querySelectorAll('.buttons-container');
        const allButtons = [];
        buttonsContainers.forEach(c => {
            while (c.firstChild) {
                allButtons.push(c.firstChild);
                c.removeChild(c.firstChild);
            }
        });
        // Fisher‑Yates shuffle
        for (let i = allButtons.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allButtons[i], allButtons[j]] = [allButtons[j], allButtons[i]];
        }
        container.innerHTML = '';
        const sec = document.createElement('div');
        sec.className = 'letter-section';
        const btns = document.createElement('div');
        btns.className = 'buttons-container';
        allButtons.forEach(b => btns.appendChild(b));
        sec.appendChild(btns);
        container.appendChild(sec);
    }

    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const noResults = document.getElementById('noResults');
        if (!searchInput) return;
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase().trim();
            const buttons = document.querySelectorAll('.buttons-container > *');
            let visible = 0;
            buttons.forEach(btn => {
                const text = (btn.value || btn.textContent || '').toLowerCase();
                if (term === '' || text.includes(term)) {
                    btn.style.display = '';
                    visible++;
                } else {
                    btn.style.display = 'none';
                }
            });
            if (noResults) {
                noResults.style.display = (visible === 0 && term !== '') ? 'block' : 'none';
            }
        });
    }

    function init() {
        renameButtons();
        shuffleButtons();
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
