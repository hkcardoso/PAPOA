// Apply the saved palette before the page is painted. Storage may be unavailable.
(() => {
  let theme = 'dark';
  try { if (localStorage.getItem('papoa-theme-v2') === 'light') theme = 'light'; } catch {}
  document.documentElement.dataset.theme = theme;
  const color = document.querySelector('meta[name="theme-color"]');
  if (color) color.content = theme === 'light' ? '#ffffff' : '#0b0d0d';
})();
