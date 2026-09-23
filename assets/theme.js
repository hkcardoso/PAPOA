// Apply the saved palette before the page is painted. Storage may be unavailable.
(() => {
  let theme = 'light';
  try {
    if (localStorage.getItem('papoa-theme-default-v2') !== 'set') {
      localStorage.setItem('papoa-theme', 'light');
      localStorage.setItem('papoa-theme-default-v2', 'set');
    } else if (localStorage.getItem('papoa-theme') === 'dark') theme = 'dark';
  } catch {}
  document.documentElement.dataset.theme = theme;
  const color = document.querySelector('meta[name="theme-color"]');
  if (color) color.content = theme === 'light' ? '#ffffff' : '#0b0d0d';
})();
