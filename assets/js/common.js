/* ==============================================
   THEME TOGGLE
   Saves preference to localStorage so it
   persists between sessions.
============================================== */
(function() {
  const body    = document.body;
  const btn     = document.getElementById('themeBtn');
  const icon    = document.getElementById('themeIcon');
  const label   = document.getElementById('themeLabel');

  function applyTheme(dark) {
    body.classList.toggle('dark', dark);
    icon.className  = dark ? 'fas fa-sun' : 'fas fa-moon';
    label.textContent = dark ? 'Light' : 'Dark';
  }

  // Restore saved preference on load
  applyTheme(localStorage.getItem('ffTheme') === 'dark');

  btn.addEventListener('click', () => {
    const nowDark = !body.classList.contains('dark');
    applyTheme(nowDark);
    localStorage.setItem('ffTheme', nowDark ? 'dark' : 'light');
  });
})();
