(()=>{
  const body=document.body;
  let revealed=false;
  let enhancementsLoaded=false;

  const reveal=()=>{
    if(revealed)return;
    revealed=true;
    requestAnimationFrame(()=>body.classList.add('site-ready'));
  };

  const current=document.currentScript;
  const base=new URL('./',current?.src||location.href);
  const core=document.createElement('script');
  core.src=new URL('./papoa-v2-core.js?v=20260925-1',base).href;
  core.async=false;

  const loadEnhancements=()=>{
    if(enhancementsLoaded)return;
    enhancementsLoaded=true;
    if(!document.querySelector('link[data-papoa-enhancements]')){
      const css=document.createElement('link');
      css.rel='stylesheet';
      css.href=new URL('./papoa-enhancements.css?v=20260926-1',base).href;
      css.dataset.papoaEnhancements='';
      document.head.appendChild(css);
    }
    if(!document.querySelector('script[data-papoa-enhancements]')){
      const script=document.createElement('script');
      script.src=new URL('./papoa-enhancements.js?v=20260926-1',base).href;
      script.defer=true;
      script.dataset.papoaEnhancements='';
      document.head.appendChild(script);
    }
  };

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

  const addInstagramLink=()=>{
    const href='https://www.instagram.com/papoa.pt/';
    document.querySelectorAll('.footer-contact').forEach(footer=>{
      if(footer.querySelector('.papoa-instagram-link'))return;
      const link=document.createElement('a');
      link.className='papoa-instagram-link';
      link.href=href;
      link.target='_blank';
      link.rel='me noopener noreferrer';
      link.textContent='Instagram';
      footer.appendChild(document.createElement('br'));
      footer.appendChild(link);
    });
  };

  const addWhatsAppContact=()=>{
    const pt=(document.documentElement.lang||'').toLowerCase().startsWith('pt');
    const text=pt?'Olá, gostaria de falar sobre um projeto PAPOA.':'Hello, I would like to talk about a PAPOA project.';
    const whatsappHref=`https://wa.me/351925347982?text=${encodeURIComponent(text)}`;
    const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A11.86 11.86 0 0 0 12.07 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.15 1.6 5.96L0 24l6.28-1.65a11.9 11.9 0 0 0 5.79 1.48h.01c6.57 0 11.92-5.35 11.92-11.93 0-3.18-1.24-6.17-3.48-8.42ZM12.08 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.63-.23-.37a9.83 9.83 0 0 1-1.51-5.26c0-5.49 4.47-9.96 9.97-9.96 2.66 0 5.16 1.04 7.04 2.92a9.88 9.88 0 0 1 2.91 7.03c0 5.5-4.47 9.97-9.95 9.97Zm5.46-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.19.29-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.77-1.65-2.07-.17-.29-.02-.45.13-.6.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.08-.79.38-.27.29-1.04 1.01-1.04 2.46s1.06 2.86 1.2 3.06c.15.2 2.08 3.17 5.03 4.45.7.3 1.25.48 1.68.61.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.43.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35Z"/></svg>';

    if(!document.getElementById('papoa-whatsapp-style')){
      const style=document.createElement('style');
      style.id='papoa-whatsapp-style';
      style.textContent=`
        .papoa-whatsapp-float{position:fixed;right:18px;bottom:18px;z-index:9999;display:flex;align-items:center;justify-content:center;width:56px;height:56px;padding:0;border-radius:50%;background:#000;color:#fff!important;text-decoration:none!important;border:1px solid rgba(255,255,255,.12);box-shadow:0 10px 28px rgba(0,0,0,.28);transition:transform .2s ease,box-shadow .2s ease,background .2s ease;overflow:hidden}
        .papoa-whatsapp-float:hover{transform:translateY(-2px);background:#111;box-shadow:0 14px 34px rgba(0,0,0,.34)}
        .papoa-whatsapp-float span{display:none}
        .papoa-whatsapp-float svg{width:24px;height:24px;display:block;flex:none;color:#fff}
        .footer-contact .papoa-whatsapp-link{display:inline-block;margin-top:5px;text-decoration:underline;text-underline-offset:3px}
        .contact-direct .papoa-whatsapp-direct{display:inline-flex;align-items:center;gap:8px;margin-top:18px;padding:12px 16px;border:1px solid rgba(255,255,255,.34);color:#fff!important;text-decoration:none!important;text-transform:uppercase;font-size:10px;letter-spacing:.1em;transition:.2s ease}
        .contact-direct .papoa-whatsapp-direct:hover{background:#fff;color:#111!important}
        .contact-direct .papoa-whatsapp-direct svg{width:16px;height:16px;display:block}
        @media(max-width:720px){.papoa-whatsapp-float{right:14px;bottom:14px;width:54px;height:54px}.papoa-whatsapp-float svg{width:23px;height:23px}}
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
    const yachtPriority=['prestige_m8evo_photos_exterior (1).webp','prestige_m8evo_photos_interiors.webp','prestige_m8_warm sand_photos_shooting_hong kong (1).webp','prestige_m7_photos_interior.webp','prestige_f6.7_photos_exterior.webp','prestige_m8evo_photos_exterior (2).webp','prestige_m8evo_photos_interior (1).webp','prestige_f4.9_hard_top_version_shooting_newport_california_2024.webp','prestige_m8evo_photos_interiors (1).webp','prestige_m8evo_photos_exterior.webp','prestige_m8_warm sand_photos_shooting_hong kong.webp','prestige_m7_interior_details_photos.webp','prestige_f6.7_photos_exterior (1).webp','prestige_f4.9_hard_top_version_shooting_newport_california_2024 (1).webp','prestige_460s_photos_interior.webp','124i0302_d.webp','124i0314_d.webp','pr620-2015-006 moquette blanche_d.webp','pr620-2015-011 moquette blanche_d.webp'];
    const carPriority=['1773766487829-d1df4d487980','1760550818717-4b948c14c5de','car-wood-trim-garvin-villier.webp','car-stitched-seat-nick-flanagan.webp','1775500818778-d5bef5e56e21','1758391439365-ee4abc04027a','car-white-leather-ammy-k.webp','car-dark-leather-garvin-villier.webp','1757926331188-cffceee50760','1652967786801-1b6ba8a00075','1756239772853-dd42ad5115c3','1675012813012-7c9fbe5664a2'];
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

  const finish=()=>{
    prioritizeGallery();
    addPhoneContact();
    addInstagramLink();
    addWhatsAppContact();
    reveal();
    setTimeout(loadEnhancements,0);
  };

  core.addEventListener('load',finish,{once:true});
  core.addEventListener('error',finish,{once:true});
  document.head.appendChild(core);
  setTimeout(finish,700);
})();
