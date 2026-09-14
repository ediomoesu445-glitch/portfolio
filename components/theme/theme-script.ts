/**
 * Runs before first paint so the page never flashes the wrong theme.
 *
 * Dark is the default: the `light` class is added only when the visitor has
 * explicitly chosen light. A visitor whose OS prefers light still gets dark
 * unless they use the toggle - the site is a control room, and that is a
 * deliberate identity choice rather than an oversight.
 */
export const themeInitScript = `
(function () {
  var root = document.documentElement;
  // Signals that JavaScript is running; entrance animations start hidden and
  // the html:not(.js) rule in globals.css reveals them if it never does.
  root.classList.add('js');
  try {
    if (localStorage.getItem('theme') === 'light') {
      root.classList.add('light');
    }
  } catch (e) {}
})();
`;
