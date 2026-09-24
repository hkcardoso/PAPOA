(()=>{
  const body=document.body;
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.querySelector('.mobile-menu');
  const header=document.querySelector('.site-header');
  const brand=document.querySelector('.site-header .brand');
  const mainNav=document.querySelector('.main-nav');
  const removableMenuItems=/^(Projects?|Process|Projetos?|Processo)$/i;
  document.querySelectorAll('.main-nav a,.mobile-menu a').forEach(link=>{
    if(removableMenuItems.test((link.textContent||'').trim()))link.remove();
  });
  const pt=(document.documentElement.lang||'').toLowerCase().startsWith('pt');
  const cssLink=document.querySelector('link[href*="papoa-v2.css"]');
  const assetsBase=cssLink?new URL('./',cssLink.href):new URL('../assets/',location.href);
  const asset=(path)=>new URL(path.replace(/^assets\//,''),assetsBase).href;

  if(brand&&mainNav&&!mainNav.querySelector('[data-home-link]')){
    const home=document.createElement('a');
    home.dataset.homeLink='';
    home.href=brand.getAttribute('href')||'./';
    home.textContent=pt?'Início':'Home';
    const currentPath=location.pathname.replace(/index\.html$/,'').replace(/\/+$/,'/');
    const homePath=new URL(home.href,location.href).pathname.replace(/index\.html$/,'').replace(/\/+$/,'/');
    if(currentPath===homePath){home.classList.add('active');home.setAttribute('aria-current','page')}
    mainNav.prepend(home);
    if(menu&&!menu.querySelector('[data-home-link]'))menu.prepend(home.cloneNode(true));
  }

  if(header&&!header.querySelector('.language-switch')){
    const current=location.pathname;
    const enPath=pt?(current.replace(/\/pt(?=\/|$)/,'')||'/'):current;
    const ptPath=pt?current:(current==='/'?'/pt/':`/pt${current.startsWith('/')?current:`/${current}`}`);
    const lang=document.createElement('div');
    lang.className='language-switch';
    lang.setAttribute('aria-label',pt?'Idioma':'Language');
    lang.innerHTML=`<a href="${ptPath}" class="${pt?'active':''}">PT</a><span>/</span><a href="${enPath}" class="${pt?'':'active'}">ENG</a>`;
    const cta=header.querySelector('.header-cta');
    header.insertBefore(lang,cta||toggle||null);
  }

  if(toggle&&menu){
    toggle.addEventListener('click',()=>{
      body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded',body.classList.contains('menu-open')?'true':'false');
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  const globalStyle=document.createElement('style');
  globalStyle.textContent=`
    .site-header .brand{display:inline-block!important;font-family:Benzin,Arial,sans-serif!important;font-size:21px!important;font-weight:600!important;letter-spacing:-.105em!important;line-height:1!important;transform:scaleY(.82)!important;transform-origin:left center!important;white-space:nowrap!important}
    .footer-brand{display:inline-block!important;font-family:Benzin,Arial,sans-serif!important;font-weight:600!important;letter-spacing:-.07em!important;transform:scaleY(.78)!important;transform-origin:left center!important}
    .hero-showcase-logo{letter-spacing:-.14em!important}
    .language-switch{margin-left:22px;display:flex;align-items:center;gap:6px;font-family:Benzin,Arial,sans-serif;font-size:7px;letter-spacing:.12em;white-space:nowrap;color:rgba(255,255,255,.5)}
    .language-switch a{opacity:.55;transition:opacity .2s ease;color:#fff}.language-switch a:hover,.language-switch a.active{opacity:1}.language-switch span{opacity:.34}
    main h1,main h2,main h3,.serif,.mobile-menu a,.studio-intro h2,.page-hero h1,.section h2,.featured h2,.materials-copy h2,.world-copy h2,.service h3,.project-info h3,.editorial-copy h2,.person h3,.contact-direct h2,.cta-copy h2{font-family:"Helvetica Neue",Arial,Helvetica,sans-serif!important;font-weight:300!important;letter-spacing:-.045em!important}
    .mobile-menu a{letter-spacing:-.035em!important}
    @media(max-width:980px){.site-header .brand{font-size:19px!important}.site-header .language-switch{margin-left:auto;margin-right:10px}.menu-toggle{margin-left:0!important}}
    @media(max-width:640px){.site-header .brand{font-size:18px!important}.language-switch{font-size:6px;gap:5px;margin-right:7px!important}}
  `;
  document.head.appendChild(globalStyle);

  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
    const parent=node.parentElement;
    if(!parent||['SCRIPT','STYLE'].includes(parent.tagName))continue;
    if(/Peniche/i.test(node.nodeValue||'')){
      node.nodeValue=node.nodeValue
        .replace(/Peniche\s*·\s*Portugal/gi,'Vilamoura · Cascais · Portugal')
        .replace(/Peniche,\s*Portugal/gi,'Vilamoura · Cascais, Portugal')
        .replace(/Costa de Peniche/gi,'Costa de Cascais')
        .replace(/Peniche coast/gi,'Cascais coast')
        .replace(/Peniche/gi,'Vilamoura · Cascais');
    }
  }
  document.querySelectorAll('[alt]').forEach(el=>{
    el.alt=(el.alt||'')
      .replace(/Costa de Peniche/gi,'Costa de Cascais')
      .replace(/Peniche coast/gi,'Cascais coast')
      .replace(/Peniche/gi,'Vilamoura · Cascais');
  });

  const homeHero=document.querySelector('body.homes-page .page-hero img');
  if(homeHero){
    homeHero.src='https://clasto.pt/projects/Giraldo/giraldo-exterior-horizontal.webp';
    homeHero.alt='PAPOA Homes — Giraldo residential exterior';
  }

  const homepageWorlds=document.querySelector('#worlds');
  const heroShowcase=document.querySelector('.hero-showcase');
  if(homepageWorlds&&heroShowcase){
    const media=heroShowcase.querySelector('.hero-media');
    if(media){
      media.innerHTML='<img src="https://images.unsplash.com/photo-1622974261006-56c31d0c2220?auto=format&fit=crop&fm=jpg&q=88&w=2600" alt="Marina de Vilamoura" style="width:100%;height:100%;object-fit:cover;object-position:center 54%">';
      media.style.pointerEvents='none';
    }
    heroShowcase.classList.remove('hero-3d');
    heroShowcase.querySelector('.hero-3d-hint')?.remove();
    homepageWorlds.querySelectorAll('.world-card').forEach(card=>{
      const title=card.querySelector('h2')?.textContent?.trim();
      const img=card.querySelector('img');
      if(!img)return;
      if(title==='Yachts'){
        img.src=asset('images/yachts/PRESTIGE_M8EVO_PHOTOS_EXTERIOR (1).webp');
        img.alt='Prestige yacht exterior lounge';
        img.style.objectPosition='center 52%';
      }
      if(title==='Cars'){
        img.src=asset('images/references/cars/porsche-cockpit.webp');
        img.alt='Premium Porsche cockpit interior';
        img.style.objectPosition='center 50%';
      }
    });
  }

  const isTeam=/\/team\/(?:index\.html)?$/.test(location.pathname);
  if(isTeam){
    const hero=document.querySelector('.page-hero img');
    if(hero){
      hero.src='https://images.unsplash.com/photo-1763151427832-790f3dadc8de?auto=format&fit=crop&fm=jpg&q=88&w=2600';
      hero.alt=pt?'Marina de Cascais':'Cascais Marina';
      hero.style.objectPosition='center 52%';
    }
    const editorial=document.querySelector('.editorial-split .media img');
    if(editorial){
      editorial.src='https://images.unsplash.com/photo-1622974261006-56c31d0c2220?auto=format&fit=crop&fm=jpg&q=88&w=2200';
      editorial.alt=pt?'Marina de Vilamoura':'Vilamoura Marina';
      editorial.style.objectPosition='center 55%';
    }
    const copy=document.querySelector('.editorial-copy p');
    if(copy){
      copy.textContent=pt
        ?'A PAPOA trabalha entre Vilamoura e Cascais, com um modelo pensado para acompanhar o projeto onde estiver — através de planeamento, visualização, coordenação e uma rede de especialistas.'
        :'PAPOA works between Vilamoura and Cascais, with a model built to follow the project wherever it is — through planning, visualisation, coordination and a trusted network of specialists.';
    }
  }

  const isYachts=/\/yachts\/(?:index\.html)?$/.test(location.pathname);
  if(isYachts){
    const grid=document.querySelector('.reference-gallery .reference-grid');
    if(grid){
      const yachtImages=[
        ['yachts/124I0302_d.webp',pt?'Interior Prestige 620':'Prestige 620 interior'],
        ['yachts/124I0314_d.webp',pt?'Zona de jantar Prestige 620':'Prestige 620 dining area'],
        ['yachts/PR620-2015-006 moquette blanche_d.webp',pt?'Salão Prestige 620':'Prestige 620 saloon'],
        ['yachts/PR620-2015-011 moquette blanche_d.webp',pt?'Interior Prestige 620':'Prestige 620 interior'],
        ['yachts/PRESTIGE_F6.7_PHOTOS_EXTERIOR (1).webp',pt?'Cockpit Prestige F6.7':'Prestige F6.7 cockpit'],
        ['yachts/PRESTIGE_F6.7_PHOTOS_EXTERIOR.webp',pt?'Lounge Prestige F6.7':'Prestige F6.7 lounge'],
        ['yachts/PRESTIGE_M8EVO_PHOTOS_EXTERIOR (1).webp',pt?'Flybridge Prestige M8 EVO':'Prestige M8 EVO flybridge'],
        ['yachts/PRESTIGE_M8EVO_PHOTOS_EXTERIOR (2).webp',pt?'Lounge exterior Prestige M8 EVO':'Prestige M8 EVO exterior lounge'],
        ['yachts/PRESTIGE_M8EVO_PHOTOS_EXTERIOR.webp',pt?'Deck Prestige M8 EVO':'Prestige M8 EVO deck'],
        ['yachts/PRESTIGE_M8EVO_PHOTOS_INTERIOR (1).webp',pt?'Salão Prestige M8 EVO':'Prestige M8 EVO saloon'],
        ['yachts/PRESTIGE_M8EVO_PHOTOS_INTERIORS (1).webp',pt?'Interior Prestige M8 EVO':'Prestige M8 EVO interior'],
        ['yachts/PRESTIGE_M8EVO_PHOTOS_INTERIORS.webp',pt?'Sala principal Prestige M8 EVO':'Prestige M8 EVO main saloon']
      ];
      grid.innerHTML=yachtImages.map(([src,title])=>`<article class="reference-tile"><img src="${asset('images/'+src)}" alt="${title}" loading="lazy" decoding="async"><div class="reference-copy"><strong>${title}</strong></div></article>`).join('');
      const galleryStyle=document.createElement('style');
      galleryStyle.textContent=`.reference-gallery .reference-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important}.reference-gallery .reference-tile{aspect-ratio:4/3!important}.reference-gallery .reference-tile img{width:100%!important;height:100%!important;object-fit:cover!important}@media(max-width:1100px){.reference-gallery .reference-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:720px){.reference-gallery .reference-grid{grid-template-columns:1fr!important;gap:6px!important}}`;
      document.head.appendChild(galleryStyle);
    }
  }

  const isContact=/\/contact\/(?:index\.html)?$/.test(location.pathname);
  if(isContact){
    const contactImages={
      Yachts:'images/yachts/PRESTIGE_M8EVO_PHOTOS_INTERIORS.webp',
      Homes:'images/interiors/arcos-santa-iria-hero.webp',
      Cars:'images/references/cars/car-stitched-seat-nick-flanagan.webp'
    };
    document.querySelectorAll('.worlds .world-card').forEach(card=>{
      const title=card.querySelector('h2')?.textContent?.trim();
      const img=card.querySelector('img');
      if(title&&img&&contactImages[title]){
        img.src=asset(contactImages[title]);
        img.alt=`PAPOA ${title}`;
      }
    });

    const contactStyle=document.createElement('style');
    contactStyle.textContent=`
      .contact-wrap{grid-template-columns:minmax(300px,.78fr) minmax(0,1.22fr)!important;gap:clamp(48px,7vw,110px)!important;align-items:start!important}
      .contact-direct,.form{min-width:0!important;position:relative!important}
      .contact-direct h2{font-size:clamp(36px,4vw,60px)!important;line-height:1!important;overflow-wrap:anywhere!important}
      .form-grid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}
      .project-options{display:flex;flex-wrap:wrap;gap:8px;padding-top:4px}
      .project-option{position:relative;cursor:pointer}
      .project-option input{position:absolute!important;opacity:0!important;pointer-events:none!important}
      .project-option span{display:block;border:1px solid rgba(255,255,255,.22);padding:11px 15px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.74);transition:.2s ease}
      .project-option input:checked+span{background:#fff;color:#111;border-color:#fff}
      @media(max-width:1180px){.contact-wrap{grid-template-columns:1fr!important;gap:46px!important}.contact-direct{max-width:760px!important}.form{width:100%!important}}
      @media(max-width:700px){.form-grid{grid-template-columns:1fr!important}.field.full{grid-column:auto!important}.project-options{gap:6px}.project-option span{padding:10px 12px}}
    `;
    document.head.appendChild(contactStyle);

    const form=document.querySelector('form[data-mailto]');
    const select=form?.querySelector('select[name="Project"],select[name="Projeto"]');
    if(select){
      const field=select.closest('.field');
      const group=document.createElement('div');
      group.className='project-options';
      [...select.options].forEach((opt,i)=>{
        const label=document.createElement('label');
        label.className='project-option';
        label.innerHTML=`<input type="radio" name="${select.name}" value="${opt.value||opt.textContent}" ${i===0?'checked':''}><span>${opt.textContent}</span>`;
        group.appendChild(label);
      });
      select.replaceWith(group);
      field?.classList.add('full');
    }
  }

  document.querySelectorAll('.reference-copy span').forEach(el=>el.remove());
  document.querySelectorAll('.homes-tile-copy span').forEach(el=>{if(/Diana Parracho|Manuel Tainha/i.test(el.textContent||''))el.remove()});

  const io=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}
  }),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  document.querySelectorAll('form[data-mailto]').forEach(form=>form.addEventListener('submit',e=>{
    e.preventDefault();
    const data=new FormData(form);
    const subject=encodeURIComponent(data.get('subject')||'New PAPOA project enquiry');
    const lines=[];
    for(const [k,v] of data.entries())if(k!=='subject'&&String(v).trim())lines.push(`${k}: ${v}`);
    window.location.href=`mailto:hello@papoa.pt?subject=${subject}&body=${encodeURIComponent(lines.join('\n\n'))}`;
  }));
})();