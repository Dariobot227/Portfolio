// main.js
// Minimal, dependency-free interactions:
// - Theme toggle (dark <-> light)
// - IntersectionObserver reveal for subtle entrance animations
// - Small accessibility touches
// Keep this file intentionally small for performance.

/* Utilities */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* THEME TOGGLE
   Persist preference in localStorage. Default: dark.
*/
(function themeToggle() {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggle.setAttribute('aria-pressed', String(theme === 'light'));
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  // Initialize from storage or system preference
  const saved = (() => {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  })();

  if (saved) setTheme(saved);
  else setTheme('dark');

  toggle.addEventListener('click', () => {
    const next = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
    setTheme(next);
  });
})();

/* REVEAL ON SCROLL
   Use IntersectionObserver to toggle .in-view on elements with .reveal
*/
(function reveals() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        // optional: unobserve to avoid repeated work
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.08 });

  elements.forEach(el => io.observe(el));
})();

/* SMALL ACCESSORY: Open external links in new tab with noopener (already in markup),
   but add rel and target if some links are dynamically added later.
*/
(function externalLinks() {
  const links = $$('a[href^="http"]');
  links.forEach(a => {
    if (!a.target) a.target = '_blank';
    if (!a.rel) a.rel = 'noopener';
  });
})();