(()=>{
  'use strict';

  const html=document.documentElement;
  if(html.dataset.papoaEnhancements==='1')return;
  html.dataset.papoaEnhancements='1';

  const pt=(html.lang||'').toLowerCase().startsWith('pt');
  const path=location.pathname.replace(/\/+/g,'/');
  const run=fn=>{try{fn()}catch(err){console.warn('[PAPOA enhancement]',err)}};

  const setMeta=(selector,attrs)=>{
    let el=document.head.querySelector(selector);
    if(!el){el=document.createElement('meta');document.head.appendChild(el)}
    Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
    return el;
  };
  const setLink=(selector,attrs)=>{
    let el=document.head.querySelector(selector);
    if(!el){el=document.createElement('link');document.head.appendChild(el)}
    Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));
    return el;
  };

  function enhanceSEO(){
    const key=path.replace(/^\/pt(?=\/|$)/,'')||'/';
    const data={
      '/yachts/': pt
        ? ['Refit de Yachts & Interiores em Portugal | PAPOA','Refit de yachts, interiores à medida, 3D e coordenação de projeto em Portugal, Cascais e Vilamoura.']
        : ['Yacht Refit & Interiors Portugal | PAPOA','Yacht refit, bespoke interiors, 3D development and project coordination in Portugal, Cascais and Vilamoura.'],
      '/interiors/': pt
        ? ['Interiores & Remodelação à Medida em Portugal | PAPOA','Interiores residenciais, remodelação, mobiliário à medida, visualização 3D e execução coordenada em Portugal.']
        : ['Bespoke Interiors & Renovation Portugal | PAPOA','Residential interiors, renovation, bespoke furniture, 3D visualisation and coordinated delivery in Portugal.'],
      '/automotive/': pt
        ? ['Interiores Automotive & Personalização | PAPOA','Refit de interiores automóveis, estofos, acabamentos, detailing e personalização discreta em Portugal.']
        : ['Automotive Interiors & Personalisation Portugal | PAPOA','Automotive interior refit, upholstery, finishes, detailing and considered personalisation in Portugal.'],
      '/contact/': pt
        ? ['Contacto | PAPOA — Yachts · Homes · Cars','Fala com a PAPOA sobre um projeto de yacht, interiores residenciais ou automotive em Portugal ou no estrangeiro.']
        : ['Contact | PAPOA — Yachts · Homes · Cars','Talk to PAPOA about a yacht, residential interior or automotive project in Portugal or abroad.'],
      '/team/': pt
        ? ['Sobre a PAPOA | Studio de Design & Refit','Conhece a PAPOA, um studio português focado em yachts, interiores, automotive, 3D e execução coordenada.']
        : ['About PAPOA | Design & Refit Studio Portugal','Meet PAPOA, a Portuguese studio focused on yachts, interiors, automotive, 3D and coordinated delivery.']
    }[key];

    if(data){
      document.title=data[0];
      let desc=document.querySelector('meta[name="description"]');
      if(!desc){desc=document.createElement('meta');desc.name='description';document.head.appendChild(desc)}
      desc.content=data[1];
      setMeta('meta[property="og:title"]',{property:'og:title',content:data[0]});
      setMeta('meta[property="og:description"]',{property:'og:description',content:data[1]});
      setMeta('meta[name="twitter:title"]',{name:'twitter:title',content:data[0]});
      setMeta('meta[name="twitter:description"]',{name:'twitter:description',content:data[1]});
    }

    const canonical=`https://papoa.pt${path.endsWith('/')?path:`${path}/`}`;
    setLink('link[rel="canonical"]',{rel:'canonical',href:canonical});
    setMeta('meta[property="og:url"]',{property:'og:url',content:canonical});
    setMeta('meta[name="robots"]',{name:'robots',content:'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'});
    setLink('link[rel="me"]',{rel:'me',href:'https://www.instagram.com/papoa.pt/'});

    if(!document.getElementById('papoa-page-schema')){
      const schema=document.createElement('script');
      schema.type='application/ld+json';
      schema.id='papoa-page-schema';
      schema.textContent=JSON.stringify({
        '@context':'https://schema.org',
        '@type':'ProfessionalService',
        name:'PAPOA',
        url:'https://papoa.pt/',
        email:'hello@papoa.pt',
        telephone:'+351925347982',
        areaServed:[{'@type':'City',name:'Cascais'},{'@type':'Place',name:'Vilamoura'},{'@type':'Country',name:'Portugal'}],
        sameAs:['https://www.instagram.com/papoa.pt/']
      });
      document.head.appendChild(schema);
    }
  }

  function enhancePerformance(){
    const hero=document.querySelector('.hero-media img,.page-hero>img');
    document.querySelectorAll('img').forEach(img=>{
      img.decoding='async';
      if(img===hero){
        img.loading='eager';
        try{img.fetchPriority='high'}catch{}
      }else if(!img.hasAttribute('loading')){
        img.loading='lazy';
      }
    });
  }

  function tightenHomepage(){
    if(!(path==='/'||path==='/pt/'||path==='/pt'))return;
    const intro=document.querySelector('.studio-intro-body p');
    if(intro)intro.textContent=pt
      ?'Concebemos e desenvolvemos refits de yachts, interiores residenciais e projetos automotive, unindo design, 3D, materiais e execução.'
      :'We develop yacht refits, residential interiors and automotive projects by bringing design, 3D, materials and execution into one process.';
    const materials=document.querySelector('.materials-note p');
    if(materials)materials.textContent=pt
      ?'Selecionamos materiais pela estética, desempenho e durabilidade — sempre de acordo com o contexto do projeto.'
      :'We select materials for beauty, performance and durability — always around the needs of the project.';
  }

  function addCapabilities(){
    if(!(path==='/'||path==='/pt/'||path==='/pt'))return;
    if(document.querySelector('.papoa-capabilities'))return;
    const anchor=document.querySelector('#process')||document.querySelector('.materials');
    if(!anchor)return;
    const section=document.createElement('section');
    section.className='papoa-capabilities';
    const items=pt
      ?['Design','Visualização 3D','Desenvolvimento técnico','Fabrico','Instalação','Coordenação de projeto']
      :['Design','3D Visualisation','Technical Development','Fabrication','Installation','Project Coordination'];
    section.innerHTML=`<div class="papoa-capabilities-head"><div><div class="eyebrow">${pt?'Capacidades':'Capabilities'}</div><h2>${pt?'Da ideia à execução.':'From idea to execution.'}</h2></div><p class="papoa-capabilities-intro">${pt?'Uma abordagem integrada para transformar conceito, detalhe e matéria num resultado coerente.':'An integrated approach that connects concept, detail and material into one coherent result.'}</p></div><div class="papoa-capabilities-grid">${items.map((item,i)=>`<article class="papoa-capability"><small>0${i+1}</small><h3>${item}</h3></article>`).join('')}</div>`;
    anchor.parentNode.insertBefore(section,anchor);
  }

  function simplifyFooter(){
    const footer=document.querySelector('.site-footer');
    if(!footer||footer.dataset.papoaMinimal==='1')return;
    footer.dataset.papoaMinimal='1';
    footer.classList.add('papoa-footer-minimal');
    footer.innerHTML=`
      <div class="footer-top">
        <div><div class="footer-brand">PAPOA</div><p class="footer-note">${pt?'Yachts · Homes · Cars<br>Cascais · Vilamoura · Portugal':'Yachts · Homes · Cars<br>Cascais · Vilamoura · Portugal'}</p></div>
        <div class="footer-links"><div class="footer-title">${pt?'Áreas':'Worlds'}</div><a href="${pt?'/pt/yachts/':'/yachts/'}">Yachts</a><a href="${pt?'/pt/interiors/':'/interiors/'}">Homes</a><a href="${pt?'/pt/automotive/':'/automotive/'}">Cars</a></div>
        <div class="footer-links"><div class="footer-title">${pt?'Localização':'Presence'}</div><span>Cascais</span><span>Vilamoura</span><span>Portugal</span></div>
        <div class="footer-links papoa-footer-socials"><div class="footer-title">Contact</div><a href="mailto:hello@papoa.pt">hello@papoa.pt</a><a href="https://wa.me/351925347982" target="_blank" rel="noopener noreferrer">WhatsApp</a><a href="https://www.instagram.com/papoa.pt/" target="_blank" rel="me noopener noreferrer">Instagram</a></div>
      </div>
      <div class="footer-bottom"><span>© 2026 PAPOA.</span><span><a href="${pt?'/pt/privacy/':'/privacy/'}">${pt?'Privacidade':'Privacy'}</a> · <a href="${pt?'/pt/terms/':'/terms/'}">${pt?'Termos':'Terms'}</a> · <a href="${pt?'/':'/pt/'}">${pt?'English':'Português'}</a></span></div>`;
  }

  function addScrollCue(){
    const hero=document.querySelector('.hero-showcase,.page-hero');
    if(!hero||hero.querySelector('.papoa-scroll-cue'))return;
    const cue=document.createElement('div');
    cue.className='papoa-scroll-cue';
    cue.innerHTML=`<span>${pt?'Explorar':'Scroll'}</span><i></i>`;
    hero.appendChild(cue);
  }

  function addLightbox(){
    const images=[...document.querySelectorAll('.reference-tile img,.homes-tile img')];
    if(!images.length)return;
    const box=document.createElement('div');
    box.className='papoa-lightbox';
    box.setAttribute('role','dialog');
    box.setAttribute('aria-modal','true');
    box.setAttribute('aria-label',pt?'Galeria de imagens':'Image gallery');
    box.innerHTML=`<div class="papoa-lightbox-top"><span class="papoa-lightbox-count"></span><span class="papoa-lightbox-caption"></span><button class="papoa-lightbox-close" type="button" aria-label="${pt?'Fechar':'Close'}">×</button></div><button class="papoa-lightbox-prev" type="button" aria-label="${pt?'Anterior':'Previous'}">‹</button><div class="papoa-lightbox-stage"><img class="papoa-lightbox-image" alt=""></div><button class="papoa-lightbox-next" type="button" aria-label="${pt?'Seguinte':'Next'}">›</button>`;
    document.body.appendChild(box);
    const display=box.querySelector('.papoa-lightbox-image');
    const count=box.querySelector('.papoa-lightbox-count');
    const caption=box.querySelector('.papoa-lightbox-caption');
    let index=0;
    let lastFocus=null;
    let touchStart=0;
    const render=()=>{
      const source=images[index];
      display.src=source.currentSrc||source.src;
      display.alt=source.alt||'';
      count.textContent=`${String(index+1).padStart(2,'0')} / ${String(images.length).padStart(2,'0')}`;
      caption.textContent=source.alt||'';
    };
    const open=i=>{index=i;lastFocus=document.activeElement;render();box.classList.add('is-open');document.body.style.overflow='hidden';box.querySelector('.papoa-lightbox-close').focus()};
    const close=()=>{box.classList.remove('is-open');document.body.style.overflow='';if(lastFocus?.focus)lastFocus.focus()};
    const move=step=>{index=(index+step+images.length)%images.length;render()};
    images.forEach((img,i)=>img.addEventListener('click',()=>open(i)));
    box.querySelector('.papoa-lightbox-close').addEventListener('click',close);
    box.querySelector('.papoa-lightbox-prev').addEventListener('click',()=>move(-1));
    box.querySelector('.papoa-lightbox-next').addEventListener('click',()=>move(1));
    box.addEventListener('click',e=>{if(e.target===box||e.target.classList.contains('papoa-lightbox-stage'))close()});
    box.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].clientX},{passive:true});
    box.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>45)move(delta>0?-1:1)},{passive:true});
    document.addEventListener('keydown',e=>{if(!box.classList.contains('is-open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')move(-1);if(e.key==='ArrowRight')move(1)});
  }

  function initBeforeAfter(){
    document.querySelectorAll('.papoa-before-after').forEach(wrap=>{
      if(wrap.dataset.ready==='1')return;
      wrap.dataset.ready='1';
      const range=wrap.querySelector('.papoa-ba-range');
      if(!range)return;
      const apply=()=>wrap.style.setProperty('--split',`${range.value}%`);
      range.addEventListener('input',apply,{passive:true});
      apply();
    });
  }

  function upgradeContact(){
    const form=document.querySelector('form[data-contact-form]');
    if(!form||form.dataset.papoaExtra==='1')return;
    form.dataset.papoaExtra='1';
    form.action='https://formsubmit.co/hello@papoa.pt';
    form.method='POST';
    form.enctype='multipart/form-data';
    const grid=form.querySelector('.form-grid');
    const details=[...grid.querySelectorAll('.field.full')].at(-1);
    if(!grid||!details)return;

    const extra=document.createElement('div');
    extra.className='papoa-contact-extra';
    extra.innerHTML=`<div class="field"><label>${pt?'Barco / imóvel / veículo':'Boat / property / vehicle'}</label><input name="${pt?'Barco imóvel ou veículo':'Boat property or vehicle'}" placeholder="${pt?'Ex.: Princess 56, moradia, Porsche 911':'e.g. Princess 56, villa, Porsche 911'}"></div><div class="field papoa-file-field"><label>${pt?'Planta, fotografia ou referência':'Plan, photo or reference'}</label><input type="file" name="attachment" accept="image/jpeg,image/png,image/webp,application/pdf,.dwg,.dxf"><div class="papoa-file-note">${pt?'Opcional · máximo total 10 MB':'Optional · maximum total 10 MB'}</div></div>`;
    grid.insertBefore(extra,details);

    const next=document.createElement('input');
    next.type='hidden';next.name='_next';next.value=`https://papoa.pt${pt?'/pt/contact/':'/contact/'}?sent=1`;
    grid.appendChild(next);

    const file=extra.querySelector('input[type=file]');
    form.addEventListener('submit',e=>{
      if(file.files?.length){
        e.stopImmediatePropagation();
      }
    },true);

    if(new URLSearchParams(location.search).get('sent')==='1'){
      const status=form.querySelector('.form-status');
      if(status){status.textContent=pt?'Obrigado. O pedido e o ficheiro foram enviados.':'Thank you. Your enquiry and file were sent.';status.dataset.state='success'}
      history.replaceState({},'',location.pathname);
    }
  }

  function markEnhancements(){
    document.body.classList.add('papoa-enhanced');
  }

  [enhanceSEO,enhancePerformance,tightenHomepage,addCapabilities,simplifyFooter,addScrollCue,addLightbox,initBeforeAfter,upgradeContact,markEnhancements].forEach(fn=>run(fn));
})();
