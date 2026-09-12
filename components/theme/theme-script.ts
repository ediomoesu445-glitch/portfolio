/**
 * Runs before first paint to apply the stored theme, so there is no flash of
 * the wrong palette. Kept as a string because it must be inlined in <head>.
 */
export const themeInitScript = `
(function () {
  // Signals that JavaScript is running. Scroll-reveal animations start from
  // opacity:0, so without this flag a no-JS visitor (or a crawler that does
  // not execute scripts) would see an empty page — see the html:not(.js)
  // fallback in app/globals.css.
  document.documentElement.classList.add('js');
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (stored !== 'light' && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;
