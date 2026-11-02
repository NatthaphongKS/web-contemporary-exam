// Web Contemporary Exam Companion - Interactive Application
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initCopyButtons();
  initSearch();
  initChecklistPersistence();
});

// Tab Navigation
function initTabs() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.module-section');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');

      // Update Nav active
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');

      // Show Section
      sections.forEach(sec => {
        if (sec.id === targetId) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });

      // Scroll to top of content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Keyboard shortcut for switching tabs (1-6)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const key = parseInt(e.key);
    if (key >= 1 && key <= navItems.length) {
      navItems[key - 1].click();
    }
  });
}

// Copy to Clipboard with Visual Feedback
function initCopyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-copy');
    if (!btn) return;

    const wrapper = btn.closest('.code-wrapper');
    const codeEl = wrapper ? wrapper.querySelector('pre code, pre') : null;
    if (!codeEl) return;

    const codeText = codeEl.innerText.trim();

    navigator.clipboard.writeText(codeText).then(() => {
      const origText = btn.innerHTML;
      btn.classList.add('copied');
      btn.innerHTML = '<span>✓</span> คัดลอกแล้ว';
      showToast('คัดลอกโค้ดลง Clipboard เรียบร้อยแล้ว');

      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = origText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      // Fallback
      fallbackCopyText(codeText);
      btn.innerHTML = '<span>✓</span> คัดลอกแล้ว';
      setTimeout(() => { btn.innerHTML = origText; }, 2000);
    });
  });
}

// Fallback copy for older browsers or restricted permissions
function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('คัดลอกโค้ดเรียบร้อย');
  } catch (err) {
    console.error('Fallback copy error', err);
  }
  document.body.removeChild(textArea);
}

// Toast notification
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

// Search Filter across all code cards
function initSearch() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.step-card');
    const sections = document.querySelectorAll('.module-section');

    if (!query) {
      cards.forEach(card => card.style.display = '');
      return;
    }

    // When searching, display cards that match
    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      if (text.includes(query)) {
        card.style.display = '';
        // ensure parent section is active or visible
        const parentSec = card.closest('.module-section');
        if (parentSec) {
          sections.forEach(s => s.classList.remove('active'));
          parentSec.classList.add('active');
          // update nav active
          const targetId = parentSec.id;
          document.querySelectorAll('.nav-item').forEach(n => {
            if (n.getAttribute('data-target') === targetId) {
              n.classList.add('active');
            } else {
              n.classList.remove('active');
            }
          });
        }
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Focus search with '/' key
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

// Checklist progress persistence
function initChecklistPersistence() {
  const checkboxes = document.querySelectorAll('.checklist-checkbox');
  checkboxes.forEach((cb, idx) => {
    const key = `exam_prep_chk_${idx}`;
    if (localStorage.getItem(key) === 'true') {
      cb.checked = true;
    }

    cb.addEventListener('change', () => {
      localStorage.setItem(key, cb.checked);
    });
  });
}
