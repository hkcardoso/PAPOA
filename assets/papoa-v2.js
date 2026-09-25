(()=>{
  const body=document.body;
  let revealed=false;

  const reveal=()=>{
    if(revealed)return;
    revealed=true;
    requestAnimationFrame(()=>body.classList.add('site-ready'));
  };

  const current=document.currentScript;
  const core=document.createElement('script');
  core.src=new URL('./papoa-v2-core.js?v=20260925-1',current?.src||location.href).href;
  core.async=false;

  const addPhoneContact=()=>{
    const phoneLabel='+351 925 347 982';
    const phoneHref='tel:+351925347982';

    document.querySelectorAll('.footer-contact').forEach(footer=>{
      if(footer.querySelector('a[href^="tel:"]'))return;
      const email=footer.querySelector('a[href^="mailto:"]');
      if(!email)return;
      const br=document.createElement('br');
      const phone=document.createElement('a');
      phone.href=phoneHref;
      phone.textContent=phoneLabel;
      email.insertAdjacentElement('afterend',br);
      br.insertAdjacentElement('afterend',phone);
    });

    const directEmail=document.querySelector('.contact-direct .email');
    if(directEmail&&!document.querySelector('.contact-direct a[href^="tel:"]')){
      const phone=document.createElement('a');
      phone.href=phoneHref;
      phone.textContent=phoneLabel;
      phone.className='email';
      phone.style.display='block';
      phone.style.marginTop='8px';
      directEmail.insertAdjacentElement('afterend',phone);
    }
  };

  const addWhatsAppContact=()=>{
    const pt=(document.documentElement.lang||'').toLowerCase().startsWith('pt');
    const text=pt?'Olá, gostaria de falar sobre um projeto PAPOA.':'Hello, I would like to talk about a PAPOA project.';
    const whatsappHref=`https://wa.me/351925347982?text=${encodeURIComponent(text)}`;
    const icon='<svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M19.11 17.41c-.28-.14-1.65-.81-1.91-.91-.26-.1-.45-.14-.64.14-.19.28-.73.91-.9 1.1-.16.19-.33.21-.61.07-.28-.14-1.18-.44-2.25-1.39-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.64-1.54-.87-2.11-.23-.55-.46-.48-.64-.49h-.54c-.19 0-.49.07-.75.35-.26.28-.99.97-.99 2.36s1.01 2.74 1.15 2.93c.14.19 1.99 3.04 4.82 4.26.67.29 1.2.46 1.61.59.68.22 1.29.19 1.78.12.54-.08 1.65-.68 1.89-1.33.23-.66.23-1.22.16-1.33-.07-.12-.26-.19-.54-.33zM16.03 5.33c-5.87 0-10.64 4.76-10.64 10.63 0 1.87.49 3.7 1.41 5.3l-1.5 5.47 5.6-1.47a10.61 10.61 0 0 0 5.13 1.31h.01c5.86 0 10.63-4.77 10.63-10.64 0-2.84-1.11-5.51-3.12-7.52a10.57 10.57 0 0 0-7.52-3.08zm0 19.45h-.01a8.79 8.79 0 0 1-4.48-1.23l-.32-.19-3.32.87.89-3.23-.21-.33a8.82 8.82 0 1 1 7.45 4.11z"/></svg>';

    if(!document.getElementById('papoa-whatsapp-style')){
      const style=document.createElement('style');
      style.id='papoa-whatsapp-style';
      style.textContent=`
        .papoa-whatsapp-float{position:fixed;right:18px;bottom:18px;z-index:9999;display:flex;align-items:center;justify-content:center;width:56px;height:56px;padding:0;border-radius:50%;background:#000;color:#fff!important;text-decoration:none!important;border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 28px rgba(0,0,0,.28);transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
        .papoa-whatsapp-float:hover{transform:translateY(-2px);background:#111;box-shadow:0 14px 34px rgba(0,0,0,.34)}
        .papoa-whatsapp-float span{display:none}
        .papoa-whatsapp-float svg{width:28px;height:28px;display:block;flex:none}
        .footer-contact .papoa-whatsapp-link{display:inline-block;margin-top:5px;text-decoration:underline;text-underline-offset:3px}
        .contact-direct .papoa-whatsapp-direct{display:inline-flex;align-items:center;gap:8px;margin-top:18px;padding:12px 16px;border:1px solid rgba(255,255,255,.34);color:#fff!important;text-decoration:none!important;text-transform:uppercase;font-size:10px;letter-spacing:.1em;transition:.2s ease}
        .contact-direct .papoa-whatsapp-direct:hover{background:#fff;color:#111!important}
        .contact-direct .papoa-whatsapp-direct svg{width:17px;height:17px;display:block}
        @media(max-width:720px){.papoa-whatsapp-float{right:14px;bottom:14px;width:54px;height:54px}.papoa-whatsapp-float svg{width:27px;height:27px}}
      `;
      document.head.appendChild(style);
    }

    if(!document.querySelector('.papoa-whatsapp-float')){
      const floating=document.createElement('a');
      floating.className='papoa-whatsapp-float';
      floating.href=whatsappHref;
      floating.target='_blank';
      floating.rel='noopener noreferrer';
      floating.setAttribute('aria-label','WhatsApp');
      floating.innerHTML=`${icon}<span>WhatsApp</span>`;
      document.body.appendChild(floating);
    }

    document.querySelectorAll('.footer-contact').forEach(footer=>{
      if(footer.querySelector('.papoa-whatsapp-link'))return;
      const phone=footer.querySelector('a[href^="tel:"]')||footer.querySelector('a[href^="mailto:"]');
      if(!phone)return;
      const br=document.createElement('br');
      const link=document.createElement('a');
      link.className='papoa-whatsapp-link';
      link.href=whatsappHref;
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.textContent='WhatsApp';
      phone.insertAdjacentElement('afterend',br);
      br.insertAdjacentElement('afterend',link);
    });

    const direct=document.querySelector('.contact-direct');
    if(direct&&!direct.querySelector('.papoa-whatsapp-direct')){
      const locationCopy=[...direct.querySelectorAll('.section-copy')].at(-1);
      const button=document.createElement('a');
      button.className='papoa-whatsapp-direct';
      button.href=whatsappHref;
      button.target='_blank';
      button.rel='noopener noreferrer';
      button.innerHTML=`${icon}<span>${pt?'Falar no WhatsApp':'Chat on WhatsApp'}</span>`;
      (locationCopy||direct.lastElementChild)?.insertAdjacentElement('afterend',button);
    }
  };

  const prioritizeGallery=()=>{
    const grid=document.querySelector('.reference-gallery .reference-grid');
    if(!grid)return;
    const path=location.pathname.toLowerCase();
    const yachtPriority=[
      'prestige_m8evo_photos_exterior (1).webp',
      'prestige_m8evo_photos_interiors.webp',
      'prestige_m8_warm sand_photos_shooting_hong kong (1).webp',
      'prestige_m7_photos_interior.webp',
      'prestige_f6.7_photos_exterior.webp',
      'prestige_m8evo_photos_exterior (2).webp',
      'prestige_m8evo_photos_interior (1).webp',
      'prestige_f4.9_hard_top_version_shooting_newport_california_2024.webp',
      'prestige_m8evo_photos_interiors (1).webp',
      'prestige_m8evo_photos_exterior.webp',
      'prestige_m8_warm sand_photos_shooting_hong kong.webp',
      'prestige_m7_interior_details_photos.webp',
      'prestige_f6.7_photos_exterior (1).webp',
      'prestige_f4.9_hard_top_version_shooting_newport_california_2024 (1).webp',
      'prestige_460s_photos_interior.webp',
      '124i0302_d.webp',
      '124i0314_d.webp',
      'pr620-2015-006 moquette blanche_d.webp',
      'pr620-2015-011 moquette blanche_d.webp'
    ];
    const carPriority=[
      '1773766487829-d1df4d487980',
      '1760550818717-4b948c14c5de',
      'car-wood-trim-garvin-villier.webp',
      'car-stitched-seat-nick-flanagan.webp',
      '1775500818778-d5bef5e56e21',
      '1758391439365-ee4abc04027a',
      'car-white-leather-ammy-k.webp',
      'car-dark-leather-garvin-villier.webp',
      '1757926331188-cffceee50760',
      '1652967786801-1b6ba8a00075',
      '1756239772853-dd42ad5115c3',
      '1675012813012-7c9fbe5664a2'
    ];
    const priority=path.includes('/yachts/')?yachtPriority:path.includes('/automotive/')?carPriority:null;
    if(!priority)return;
    const tiles=[...grid.querySelectorAll('.reference-tile')];
    const rank=tile=>{
      const img=tile.querySelector('img');
      let src='';
      try{src=decodeURIComponent(img?.currentSrc||img?.src||'').toLowerCase()}catch{src=(img?.currentSrc||img?.src||'').toLowerCase()}
      const index=priority.findIndex(key=>src.includes(key));
      return index===-1?999:index;
    };
    tiles.sort((a,b)=>rank(a)-rank(b)).forEach(tile=>grid.appendChild(tile));
  };

  core.addEventListener('load',()=>{
    prioritizeGallery();
    addPhoneContact();
    addWhatsAppContact();

    const fastTransition=document.createElement('style');
    fastTransition.textContent=`
      ::view-transition-group(root){animation-duration:.16s!important;animation-timing-function:ease-out!important}
      ::view-transition-old(root){animation:papoa-fast-out .11s ease-out both!important;z-index:1}
      ::view-transition-new(root){animation:papoa-fast-in .16s ease-out both!important;z-index:2}
      @keyframes papoa-fast-out{from{opacity:1}to{opacity:.88}}
      @keyframes papoa-fast-in{from{opacity:.35}to{opacity:1}}
      @media(prefers-reduced-motion:reduce){::view-transition-old(root),::view-transition-new(root),::view-transition-group(root){animation:none!important}}
    `;
    document.head.appendChild(fastTransition);
    reveal();
  },{once:true});

  core.addEventListener('error',()=>{
    addPhoneContact();
    addWhatsAppContact();
    reveal();
  },{once:true});
  document.head.appendChild(core);

  setTimeout(()=>{
    addPhoneContact();
    addWhatsAppContact();
    reveal();
  },700);
})();
