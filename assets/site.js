(() => {
  const pt = document.documentElement.lang === 'pt-PT';
  const form = document.getElementById('contactForm');
  if (form) {
    const params = new URLSearchParams(location.search);
    const discipline = form.elements.namedItem('discipline');
    const selected = params.get('discipline');
    if ([...discipline.options].some(option => option.value === selected)) discipline.value = selected;
    const subject = params.get('subject');
    if (subject) form.elements.namedItem('subject').value = subject.slice(0, 200);
    form.addEventListener('submit', () => {
      form.elements.namedItem('_subject').value = 'PAPOA — ' + form.elements.namedItem('subject').value.slice(0, 150);
    });
  }
  document.querySelectorAll('.languageSwitch a').forEach(link => {
    const target = new URL(link.href);target.search = location.search;target.hash = location.hash;link.href = target.href;
  });
  document.querySelectorAll('.videoToggle').forEach(button => {
    const video = button.parentElement.querySelector('video');
    const sync = () => {button.textContent = video.paused ? (pt ? 'Reproduzir vídeo' : 'Play video') : (pt ? 'Pausar vídeo' : 'Pause video');button.setAttribute('aria-pressed', String(video.paused));};
    button.addEventListener('click', () => {if (video.paused) video.play().catch(() => {});else video.pause();sync();});
    video.addEventListener('play', sync);video.addEventListener('pause', sync);sync();
  });
  const toggle = document.querySelector('.mobileMenuToggle');
  const menu = document.getElementById('mobileNav');
  if (menu && toggle) {
    const update = () => {menu.inert = !document.body.classList.contains('menuOpen');};
    update();new MutationObserver(update).observe(document.body,{attributes:true,attributeFilter:['class']});
    document.addEventListener('keydown', event => {
      if (!document.body.classList.contains('menuOpen')) return;
      if (event.key === 'Escape') {toggle.click();toggle.focus();}
      if (event.key === 'Tab') {
        const items = [toggle,...menu.querySelectorAll('a,button')];
        if (event.shiftKey && document.activeElement === items[0]) {event.preventDefault();items.at(-1).focus();}
        else if (!event.shiftKey && document.activeElement === items.at(-1)) {event.preventDefault();items[0].focus();}
      }
    });
  }
})();
// Compare the existing concept image with its animation, without implying a built result.
(() => {
  const hero = document.querySelector('.page-yachts .hero');
  if (!hero) return;
  const video = hero.querySelector('video');
  if (!video) return;
  const pt = document.documentElement.lang === 'pt-PT';
  const button = document.createElement('button');button.className = 'mediaSwitch';button.type = 'button';button.setAttribute('aria-pressed','false');button.textContent = pt ? 'Ver imagem 3D' : 'View 3D image';
  button.addEventListener('click', () => {const poster = hero.classList.toggle('showPoster');button.setAttribute('aria-pressed', String(poster));button.textContent = poster ? (pt ? 'Ver animação' : 'View animation') : (pt ? 'Ver imagem 3D' : 'View 3D image');if (poster) video.pause();else video.play().catch(() => {});});
  hero.append(button);
})();
