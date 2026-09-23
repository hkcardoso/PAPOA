(()=>{
  const hero=document.querySelector('.hero');
  const media=hero?.querySelector('.hero-media');
  if(!hero||!media)return;

  const poster=media.querySelector('img');
  if(poster){
    media.style.backgroundImage=`url("${poster.src}")`;
    media.style.backgroundSize='cover';
    media.style.backgroundPosition='center';
    poster.remove();
  }

  media.classList.add('hero-3d');

  const frame=document.createElement('iframe');
  frame.className='hero-3d-frame';
  frame.title='Princess V65 motor yacht — interactive 3D';
  frame.setAttribute('frameborder','0');
  frame.setAttribute('allowfullscreen','');
  frame.setAttribute('allow','autoplay; fullscreen; xr-spatial-tracking');
  frame.setAttribute('loading','eager');
  frame.src='https://sketchfab.com/models/0f79a9a054574781a393201c7ed0f9b8/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_hint=0&ui_stop=0&ui_watermark_link=0';
  media.prepend(frame);

  const hint=document.createElement('div');
  hint.className='hero-3d-hint';
  hint.textContent=(document.documentElement.lang||'').toLowerCase().startsWith('pt')
    ? 'Arrasta para explorar · 3D interativo'
    : 'Drag to explore · Interactive 3D';
  hero.appendChild(hint);

  document.querySelectorAll('[data-3d-open]').forEach(el=>el.remove());
  document.querySelector('[data-3d-modal]')?.remove();
})();