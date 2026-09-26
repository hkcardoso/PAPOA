(()=>{
  'use strict';
  const path=location.pathname.replace(/\/+$/,'/')||'/';
  const pt=(document.documentElement.lang||'').toLowerCase().startsWith('pt');

  /* Move client feedback off the homepage and place it at the end of Contact. */
  const isHome=path==='/'||path==='/pt/';
  const isContact=/(^|\/)contact\/$/.test(path);

  if(isHome){
    document.querySelector('.testimonials-section')?.remove();
  }

  if(isContact&&!document.querySelector('.testimonials-section')){
    const main=document.querySelector('main');
    if(main){
      const section=document.createElement('section');
      section.className='testimonials-section';
      section.innerHTML=pt
        ? `<div class="testimonials-head"><div><div class="eyebrow">Feedback de clientes</div><h2>O bom trabalho sente-se nos detalhes.</h2></div></div><div class="testimonials-grid"><article class="testimonial-card"><blockquote>“Uma visão clara desde o primeiro dia, com um sentido impecável de proporções e carpintaria náutica.”</blockquote><div class="testimonial-meta"><strong>FREDERIK VAN DEN BERG</strong><span>Refit de yacht · Portugal</span></div></article><article class="testimonial-card"><blockquote>“O 3D tornou todas as decisões simples. Percebemos completamente o espaço antes de a obra começar.”</blockquote><div class="testimonial-meta"><strong>HELENA VAZ PINTO</strong><span>Interior residencial · Cascais</span></div></article><article class="testimonial-card"><blockquote>“Preciso, pragmático e muito fácil de trabalhar. O design final ficou contido, sem parecer excessivo.”</blockquote><div class="testimonial-meta"><strong>ALEXANDER KAUFMANN</strong><span>Residência privada · Comporta</span></div></article></div>`
        : `<div class="testimonials-head"><div><div class="eyebrow">Client feedback</div><h2>Good work is felt in the details.</h2></div></div><div class="testimonials-grid"><article class="testimonial-card"><blockquote>“A clear vision from day one, with an impeccable sense of proportions and marine joinery.”</blockquote><div class="testimonial-meta"><strong>FREDERIK VAN DEN BERG</strong><span>Yacht refit · Portugal</span></div></article><article class="testimonial-card"><blockquote>“The 3D made every decision effortless. We completely understood the space before construction started.”</blockquote><div class="testimonial-meta"><strong>HELENA VAZ PINTO</strong><span>Residential interior · Cascais</span></div></article><article class="testimonial-card"><blockquote>“Precise, pragmatic, and effortless to work with. The final design feels restrained rather than overdone.”</blockquote><div class="testimonial-meta"><strong>ALEXANDER KAUFMANN</strong><span>Private residence · Comporta</span></div></article></div>`;
      main.appendChild(section);
    }
  }

  if(!/(^|\/)yachts\/$/.test(path))return;

  const wrap=document.querySelector('.papoa-before-after');
  if(!wrap||wrap.dataset.papoaDemoLoaded==='1')return;
  wrap.dataset.papoaDemoLoaded='1';

  const before=wrap.querySelector('.papoa-ba-before');
  const after=wrap.querySelector('.papoa-ba-after');
  if(!before||!after)return;

  before.src='/assets/images/yachts/PRESTIGE_M8EVO_PHOTOS_INTERIORS.webp';
  after.src='/assets/images/yachts/before.webp';
  before.alt=pt?'Interior do yacht antes do refit':'Yacht interior before refit';
  after.alt=pt?'Interior do yacht depois do refit':'Yacht interior after refit';
  before.decoding='async';
  after.decoding='async';

  const section=wrap.closest('.papoa-ba-section');
  section?.querySelector('.papoa-ba-demo-note')?.remove();
})();
