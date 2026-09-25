(()=>{
  const body=document.body;
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.querySelector('.mobile-menu');
  const header=document.querySelector('.site-header');
  const brand=document.querySelector('.site-header .brand');
  const mainNav=document.querySelector('.main-nav');
  const pt=(document.documentElement.lang||'').toLowerCase().startsWith('pt');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cssLink=document.querySelector('link[href*="papoa-v2.css"]');
  const assetsBase=cssLink?new URL('./',cssLink.href):new URL('../assets/',location.href);
  const asset=(path)=>new URL(path.replace(/^assets\//,''),assetsBase).href;

  /* Navigation cleanup + home/language controls */
  const removableMenuItems=/^(Projects?|Process|Projetos?|Processo)$/i;
  document.querySelectorAll('.main-nav a,.mobile-menu a').forEach(link=>{
    if(removableMenuItems.test((link.textContent||'').trim()))link.remove();
  });

  if(brand&&mainNav&&!mainNav.querySelector('[data-home-link]')){
    const home=document.createElement('a');
    home.dataset.homeLink='';
    home.href=brand.getAttribute('href')||'./';
    home.textContent=pt?'Início':'Home';
    const cleanPath=(value)=>value.replace(/index\.html$/,'').replace(/\/+$/,'/');
    if(cleanPath(location.pathname)===cleanPath(new URL(home.href,location.href).pathname)){
      home.classList.add('active');
      home.setAttribute('aria-current','page');
    }
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
    toggle.setAttribute('aria-expanded','false');
    toggle.addEventListener('click',()=>{
      body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded',body.classList.contains('menu-open')?'true':'false');
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  /* Keep PAPOA identity and heading system uniform */
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

  /* Load the final polish layer after page-specific CSS so it can unify all pages. */
  if(!document.querySelector('link[data-papoa-polish]')){
    const polish=document.createElement('link');
    polish.rel='stylesheet';
    polish.href=asset('papoa-polish.css?v=20260925-1');
    polish.dataset.papoaPolish='';
    document.head.appendChild(polish);
  }

  /* Keep old page copy/location references aligned with the current studio positioning. */
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

  const isHome=/^(\/|\/pt\/?)(?:index\.html)?$/.test(location.pathname);
  const isTeam=/\/team\/(?:index\.html)?$/.test(location.pathname);
  const isYachts=/\/yachts\/(?:index\.html)?$/.test(location.pathname);
  const isCars=/\/automotive\/(?:index\.html)?$/.test(location.pathname);
  const isContact=/\/contact\/(?:index\.html)?$/.test(location.pathname);

  if(isTeam)body.classList.add('about-page');
  if(isContact)body.classList.add('contact-page');

  /* Keep homepage hero exactly as the current static marina direction. */
  if(isHome){
    const heroShowcase=document.querySelector('.hero-showcase');
    const media=heroShowcase?.querySelector('.hero-media');
    if(media){
      media.innerHTML='<img src="https://images.unsplash.com/photo-1622974261006-56c31d0c2220?auto=format&fit=crop&fm=jpg&q=88&w=2600" alt="Marina de Vilamoura" style="width:100%;height:100%;object-fit:cover;object-position:center 54%">';
      media.style.pointerEvents='none';
    }
    heroShowcase?.classList.remove('hero-3d');
    heroShowcase?.querySelector('.hero-3d-hint')?.remove();
    document.querySelectorAll('#worlds .world-card').forEach(card=>{
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

  const homeHero=document.querySelector('body.homes-page .page-hero img');
  if(homeHero){
    homeHero.src='https://clasto.pt/projects/Giraldo/giraldo-exterior-horizontal.webp';
    homeHero.alt='PAPOA Homes — Giraldo residential exterior';
  }

  if(isTeam){
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

  /* Yachts: keep the curated local set, but let the polish CSS create an editorial composition. */
  if(isYachts){
    const grid=document.querySelector('.reference-gallery .reference-grid');
    if(grid){
      const yachtImages=[
        ['yachts/124I0302_d.webp',pt?'Interior Prestige 620':'Prestige 620 interior'],
        ['yachts/124I0314_d.webp',pt?'Zona de jantar Prestige 620':'Prestige 620 dining area'],
        ['yachts/PR620-2015-006 moquette blanche_d.webp',pt?'Salão Prestige 620':'Prestige 620 saloon'],
        ['yachts/PR620-2015-011 moquette blanche_d.webp',pt?'Interior Prestige 620':'Prestige 620 interior'],
        ['yachts/news/PRESTIGE_460S_PHOTOS_INTERIOR.webp',pt?'Interior Prestige 460S':'Prestige 460S interior'],
        ['yachts/news/PRESTIGE_F4.9_HARD_TOP_VERSION_SHOOTING_NEWPORT_CALIFORNIA_2024 (1).webp',pt?'Prestige F4.9 hard top':'Prestige F4.9 hard top'],
        ['yachts/news/PRESTIGE_F4.9_HARD_TOP_VERSION_SHOOTING_NEWPORT_CALIFORNIA_2024.webp',pt?'Exterior Prestige F4.9':'Prestige F4.9 exterior'],
        ['yachts/news/PRESTIGE_M7_INTERIOR_DETAILS_PHOTOS.webp',pt?'Detalhe interior Prestige M7':'Prestige M7 interior detail'],
        ['yachts/news/PRESTIGE_M7_PHOTOS_INTERIOR.webp',pt?'Interior Prestige M7':'Prestige M7 interior'],
        ['yachts/news/PRESTIGE_M8_WARM SAND_PHOTOS_SHOOTING_HONG KONG (1).webp',pt?'Interior Prestige M8 Warm Sand':'Prestige M8 Warm Sand interior'],
        ['yachts/news/PRESTIGE_M8_WARM SAND_PHOTOS_SHOOTING_HONG KONG.webp',pt?'Detalhe Prestige M8 Warm Sand':'Prestige M8 Warm Sand detail'],
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
    }
  }

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

    /* Legacy PT/contact markup can still be converted into the same project pills. */
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
  document.querySelectorAll('.homes-tile-copy span').forEach(el=>{
    if(/Diana Parracho|Manuel Tainha/i.test(el.textContent||''))el.remove();
  });

  /* Lightbox shared by Yachts, Homes and Cars */
  const galleryImages=[...document.querySelectorAll('.reference-gallery .reference-tile img,.homes-gallery .homes-tile img')];
  if(galleryImages.length){
    const lightbox=document.createElement('div');
    lightbox.className='gallery-lightbox';
    lightbox.setAttribute('role','dialog');
    lightbox.setAttribute('aria-modal','true');
    lightbox.setAttribute('aria-label',pt?'Imagem ampliada':'Enlarged image');
    lightbox.innerHTML=`<button class="gallery-lightbox-close" type="button" aria-label="${pt?'Fechar':'Close'}">×</button><button class="gallery-lightbox-nav gallery-lightbox-prev" type="button" aria-label="${pt?'Imagem anterior':'Previous image'}">‹</button><img alt=""><button class="gallery-lightbox-nav gallery-lightbox-next" type="button" aria-label="${pt?'Imagem seguinte':'Next image'}">›</button>`;
    body.appendChild(lightbox);

    const lightboxStyle=document.createElement('style');
    lightboxStyle.textContent=`
      .reference-gallery .reference-tile img,.homes-gallery .homes-tile img{cursor:pointer}
      .gallery-lightbox{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;background:rgba(7,8,8,.95);opacity:0;visibility:hidden;transition:opacity .22s ease,visibility .22s ease;padding:32px}
      .gallery-lightbox.open{opacity:1;visibility:visible}
      .gallery-lightbox img{display:block;max-width:min(92vw,1800px);max-height:88vh;width:auto;height:auto;object-fit:contain;box-shadow:0 18px 60px rgba(0,0,0,.36)}
      .gallery-lightbox-close,.gallery-lightbox-nav{position:absolute;z-index:2;border:0;background:transparent;color:#fff;cursor:pointer;font-family:Arial,sans-serif;font-weight:200;line-height:1;opacity:.78;transition:opacity .2s ease,transform .2s ease}
      .gallery-lightbox-close{top:22px;right:28px;font-size:42px;padding:4px 8px}
      .gallery-lightbox-nav{top:50%;transform:translateY(-50%);font-size:58px;padding:16px 20px}
      .gallery-lightbox-prev{left:12px}.gallery-lightbox-next{right:12px}
      .gallery-lightbox-close:hover,.gallery-lightbox-nav:hover{opacity:1}
      .gallery-lightbox-nav:hover{transform:translateY(-50%) scale(1.05)}
      @media(max-width:720px){.gallery-lightbox{padding:54px 8px 28px}.gallery-lightbox img{max-width:96vw;max-height:80vh}.gallery-lightbox-close{top:10px;right:12px;font-size:38px}.gallery-lightbox-nav{font-size:46px;padding:14px 10px}.gallery-lightbox-prev{left:0}.gallery-lightbox-next{right:0}}
      @media(prefers-reduced-motion:reduce){.gallery-lightbox,.gallery-lightbox-close,.gallery-lightbox-nav{transition:none}}
    `;
    document.head.appendChild(lightboxStyle);

    const modalImage=lightbox.querySelector('img');
    const prev=lightbox.querySelector('.gallery-lightbox-prev');
    const next=lightbox.querySelector('.gallery-lightbox-next');
    const closeButton=lightbox.querySelector('.gallery-lightbox-close');
    let activeIndex=0;
    const show=(index)=>{
      activeIndex=(index+galleryImages.length)%galleryImages.length;
      const source=galleryImages[activeIndex];
      modalImage.src=source.currentSrc||source.src;
      modalImage.alt=source.alt||'';
    };
    const open=(index)=>{
      show(index);
      lightbox.classList.add('open');
      body.classList.add('gallery-lightbox-open');
    };
    const close=()=>{
      lightbox.classList.remove('open');
      body.classList.remove('gallery-lightbox-open');
    };
    galleryImages.forEach((image,index)=>image.addEventListener('click',event=>{
      event.preventDefault();
      event.stopPropagation();
      open(index);
    }));
    closeButton.addEventListener('click',close);
    prev.addEventListener('click',event=>{event.stopPropagation();show(activeIndex-1)});
    next.addEventListener('click',event=>{event.stopPropagation();show(activeIndex+1)});
    lightbox.addEventListener('click',event=>{if(event.target===lightbox)close()});
    document.addEventListener('keydown',event=>{
      if(!lightbox.classList.contains('open'))return;
      if(event.key==='Escape')close();
      if(event.key==='ArrowLeft')show(activeIndex-1);
      if(event.key==='ArrowRight')show(activeIndex+1);
    });
  }

  /* Original reveals */
  if('IntersectionObserver' in window){
    const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    }),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
  }else{
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));
  }

  /* 03 — assign distinct motion behaviours by content type */
  const titleTargets=document.querySelectorAll('.page-hero h1,.section h2,.featured h2,.materials-copy h2,.editorial-copy h2,.contact-direct h2,.reference-gallery-intro h2,.homes-gallery-intro h2,.studio-intro h2');
  titleTargets.forEach(el=>el.classList.add('motion-title'));
  document.querySelectorAll('.eyebrow').forEach(el=>el.classList.add('motion-kicker'));

  const mediaTargets=document.querySelectorAll('.featured,.materials-image,.editorial-split .media');
  mediaTargets.forEach(el=>el.classList.add('motion-media'));

  const staggerGroups=document.querySelectorAll('.service-grid,.reference-grid,.refit-grid,.founders-grid');
  staggerGroups.forEach(group=>{
    group.classList.add('motion-stagger');
    [...group.children].forEach((child,index)=>child.style.setProperty('--motion-i',String(index%8)));
  });
  document.querySelectorAll('.homes-gallery-row').forEach((row,index)=>{
    row.classList.add('motion-stagger');
    [...row.children].forEach((child,i)=>child.style.setProperty('--motion-i',String(i)));
    if(index===2||index===6)row.classList.add('homes-feature-row');
  });

  const motionTargets=[...document.querySelectorAll('.motion-title,.motion-kicker,.motion-media,.motion-stagger')];
  if(reducedMotion||!('IntersectionObserver' in window)){
    motionTargets.forEach(el=>el.classList.add('motion-in'));
  }else{
    const motionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('motion-in');
        motionObserver.unobserve(entry.target);
      }
    }),{threshold:.08,rootMargin:'0px 0px -4% 0px'});
    motionTargets.forEach(el=>motionObserver.observe(el));
  }

  /* 04 — process line progress follows the scroll position. */
  const process=document.querySelector('.process');
  const processSteps=process?[...process.querySelectorAll('.step')]:[];
  const updateProcess=()=>{
    if(!process)return;
    if(reducedMotion){
      process.style.setProperty('--process-progress','1');
      processSteps.forEach(step=>step.classList.add('is-active'));
      return;
    }
    const rect=process.getBoundingClientRect();
    const start=window.innerHeight*.84;
    const travel=Math.max(rect.height+window.innerHeight*.38,1);
    const progress=Math.max(0,Math.min(1,(start-rect.top)/travel));
    process.style.setProperty('--process-progress',progress.toFixed(3));
    processSteps.forEach((step,index)=>{
      const threshold=processSteps.length>1?(index/(processSteps.length-1))*.94:0;
      step.classList.toggle('is-active',progress>=threshold);
    });
  };

  /* 06 — very subtle image depth on Homes. */
  const homeTiles=[...document.querySelectorAll('.homes-gallery .homes-tile img')];
  const updateHomesParallax=()=>{
    if(reducedMotion||!homeTiles.length)return;
    const viewportCenter=window.innerHeight/2;
    homeTiles.forEach(img=>{
      const rect=img.parentElement.getBoundingClientRect();
      if(rect.bottom<0||rect.top>window.innerHeight)return;
      const center=rect.top+rect.height/2;
      const offset=Math.max(-14,Math.min(14,(viewportCenter-center)*.022));
      img.style.setProperty('--parallax-y',`${offset.toFixed(1)}px`);
    });
  };

  let scrollTick=false;
  const onScroll=()=>{
    if(scrollTick)return;
    scrollTick=true;
    requestAnimationFrame(()=>{
      updateProcess();
      updateHomesParallax();
      scrollTick=false;
    });
  };
  updateProcess();
  updateHomesParallax();
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});

  /* Mailto fallback used by legacy forms; current AJAX contact form remains untouched. */
  document.querySelectorAll('form[data-mailto]').forEach(form=>form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    const subject=encodeURIComponent(data.get('subject')||'New PAPOA project enquiry');
    const lines=[];
    for(const [key,value] of data.entries())if(key!=='subject'&&String(value).trim())lines.push(`${key}: ${value}`);
    window.location.href=`mailto:hello@papoa.pt?subject=${subject}&body=${encodeURIComponent(lines.join('\n\n'))}`;
  }));
})();