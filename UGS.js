// UGS.js v1.0.17 – Download buttons integrated + search hides sections
(function() {
  // Inject CSS for hidden elements
  const style = document.createElement('style');
  style.textContent = `
    .hidden-btn { display: none !important; }
    .hidden-section { display: none !important; }
    .sidebar-btn.dimmed { opacity: 0.4; pointer-events: none; }
  `;
  document.head.appendChild(style);

  // ---------- Download icon SVG ----------
  const downloadIconSVG = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>`;

  function addDownloadButtonIfNeeded(gameElement) {
    if (gameElement.querySelector('.download-btn')) return;
    // Skip "no files" placeholders (the text content will already be set)
    const text = (gameElement.textContent || '').trim().toLowerCase();
    if (text === 'no files' || text === '') return;

    // Ensure the button is relatively positioned
    gameElement.style.position = 'relative';

    const btn = document.createElement('span');
    btn.className = 'download-btn';
    btn.innerHTML = downloadIconSVG;
    btn.title = 'Download this game';
    btn.style.cssText = `
      position:absolute; bottom:6px; right:6px;
      width:28px; height:28px; border-radius:50%;
      background:rgba(0,0,0,0.65); border:1px solid rgba(255,255,255,0.3);
      cursor:pointer; z-index:999;
      display:flex; align-items:center; justify-content:center;
      padding:0; box-shadow:0 2px 6px rgba(0,0,0,0.4);
      transition:transform 0.2s, background 0.2s;
    `;
    btn.addEventListener('mouseenter', () => {
      btn.style.background = 'rgba(0,0,0,0.85)';
      btn.style.transform = 'scale(1.15)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = 'rgba(0,0,0,0.65)';
      btn.style.transform = 'scale(1)';
    });

    const svg = btn.querySelector('svg');
    if (svg) svg.style.cssText = 'width:16px; height:16px; fill:white; display:block;';

    btn.addEventListener('click', async function(e) {
      e.stopPropagation();
      e.preventDefault();

      // Get the game URL (capturing window.open if needed)
      const originalOpen = window.open;
      let url = null;
      // Try to capture the URL by simulating a click on the parent
      window.open = function(_url, target, features) {
        url = _url;
        return null;
      };
      gameElement.click();
      window.open = originalOpen;

      if (!url) {
        alert('Could not retrieve game URL.');
        return;
      }

      // Download via fetch
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        const filename = url.split('/').pop() || 'game.html';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.warn('Download failed, opening in new tab:', err);
        originalOpen(url, '_blank');
      }
    });

    gameElement.appendChild(btn);
  }

  // ---------- Sidebar ----------
  function buildSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    sidebar.innerHTML = '';
    const sections = document.querySelectorAll('.letter-section');
    sections.forEach((sec, index) => {
      const header = sec.querySelector('.letter-header');
      if (!header) return;
      const letter = header.textContent.trim();
      const btn = document.createElement('button');
      btn.className = 'sidebar-btn';
      btn.textContent = letter;
      const hue = (index * 137.5 + 60) % 360;
      const hue2 = (hue + 50) % 360;
      btn.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
      btn.addEventListener('click', () => { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      sidebar.appendChild(btn);
    });
  }

  // ---------- Rename (preserve child elements) ----------
  function renameButtons() {
    document.querySelectorAll('.buttons-container > *').forEach(btn => {
      let raw = (btn.value || btn.textContent || '').trim();
      let display = raw.replace(/^cl/i, '').replace(/\.html$/i, '');

      if (btn.tagName.toLowerCase() === 'input') {
        btn.value = display;
      } else {
        // Replace text content of the first text node only
        const textNode = Array.from(btn.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        if (textNode) {
          textNode.textContent = display;
        } else {
          // No text node: insert one at the beginning
          btn.insertBefore(document.createTextNode(display), btn.firstChild);
        }
      }

      // Now add download button to this element
      addDownloadButtonIfNeeded(btn);
    });
  }

  // ---------- Fix "No files" placeholders ----------
  function fixEmptyButtons() {
    document.querySelectorAll('.buttons-container > *').forEach(btn => {
      let text = (btn.value || btn.textContent || '').trim().toLowerCase();
      if (text === 'no files' || text === '') {
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
      const hue = (index * 137.5) % 360;
      const hue2 = (hue + 60) % 360;
      const gradient = `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
      btn.style.background = gradient;
    });
  }

  // ---------- Search ----------
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

        const header = sec.querySelector('.letter-header');
        if (header) {
          const letter = header.textContent.trim();
          const sidebar = document.getElementById('sidebar');
          if (sidebar) {
            sidebar.querySelectorAll('.sidebar-btn').forEach(btn => {
              if (btn.textContent.trim() === letter) {
                btn.classList.toggle('dimmed', sectionVisible === 0 && term !== '');
              }
            });
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
    buildSidebar();
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
