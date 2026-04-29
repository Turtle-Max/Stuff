// UGS.js – Sidebar, golden‑angle gradients, no‑blue hover, search hides sections (v1.0.14)
(function() {
    // Inject CSS for hidden elements
    const style = document.createElement('style');
    style.textContent = `
        .hidden-btn { display: none !important; }
        .hidden-section { display: none !important; }
        .sidebar-btn.dimmed { opacity: 0.4; pointer-events: none; }
    `;
    document.head.appendChild(style);

    // ---------- Sidebar ----------
    function buildSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;
        // Clear existing
        sidebar.innerHTML = '';

        const sections = document.querySelectorAll('.letter-section');
        sections.forEach(sec => {
            const header = sec.querySelector('.letter-header');
            if (!header) return;
            const letter = header.textContent.trim();
            const btn = document.createElement('button');
            btn.className = 'sidebar-btn';
            btn.textContent = letter;
            btn.addEventListener('click', () => {
                sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            sidebar.appendChild(btn);
        });
    }

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
            if (text === 'no files' || text === 'nofiles' || text === '') {
                const span = document.createElement('span');
                span.textContent = 'No files';
                span.style.color = 'rgba(255,255,255,0.6)';
                span.style.fontStyle = 'italic';
                span.style.padding = '10px';
                btn.replaceWith(span);
            }
        });
    }

    // ---------- Golden‑angle unique gradients ----------
    function assignUniqueGradients() {
        const buttons = document.querySelectorAll('.buttons-container > input, .buttons-container > button');
        buttons.forEach((btn, index) => {
            // Golden angle: 137.5° ensures hues are well‑spaced
            const hue = (index * 137.5) % 360;
            const hue2 = (hue + 60) % 360;   // complementary offset
            const gradient = `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
            btn.style.background = gradient;
        });
    }

    // ---------- Search with section hiding ----------
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const noResults = document.getElementById('noResults');
        if (!searchInput) return;

        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase().trim();
            const sections = document.querySelectorAll('.letter-section');
            let overallVisible = 0;

            sections.forEach(sec => {
                const items = sec.querySelectorAll('.buttons-container > *');
                let sectionVisible = 0;

                items.forEach(el => {
                    const text = (el.value || el.textContent || '').toLowerCase();
                    if (term === '' || text.includes(term)) {
                        el.classList.remove('hidden-btn');
                        sectionVisible++;
                    } else {
                        el.classList.add('hidden-btn');
                    }
                });

                if (sectionVisible === 0 && term !== '') {
                    sec.classList.add('hidden-section');
                } else {
                    sec.classList.remove('hidden-section');
                    overallVisible += sectionVisible;
                }

                // Update sidebar button opacity
                const header = sec.querySelector('.letter-header');
                if (header) {
                    const letter = header.textContent.trim();
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) {
                        const btn = sidebar.querySelector(`.sidebar-btn`);
                        if (btn && btn.textContent.trim() === letter) {
                            if (sectionVisible === 0 && term !== '') {
                                btn.classList.add('dimmed');
                            } else {
                                btn.classList.remove('dimmed');
                            }
                        }
                    }
                }
            });

            if (noResults) {
                noResults.style.display = (overallVisible === 0 && term !== '') ? 'block' : 'none';
            }
        });
    }

    // ---------- Run when buttons exist ----------
    function init() {
        renameButtons();
        fixEmptyButtons();
        assignUniqueGradients();
        buildSidebar();      // create sidebar after sections are present
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
