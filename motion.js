(()=>{
  const header=document.querySelector('.site-header');
  const toggle=document.querySelector('.menu-toggle');

  if(header&&toggle){
    const closeMenu=()=>{
      header.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
    };
    toggle.addEventListener('click',()=>{
      const open=header.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded',String(open));
    });
    header.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  }

  const track=(name,params={})=>{if(typeof window.gtag==='function')window.gtag('event',name,params);};

  document.addEventListener('click',event=>{
    const link=event.target.closest('a');
    if(!link)return;
    const href=link.getAttribute('href')||'';
    if(href.startsWith('/projetos/')) track('select_content',{content_type:'project',item_id:href});
    else if(href.includes('wa.me/')) track('whatsapp_click',{link_url:href});
    else if(href.startsWith('tel:')) track('phone_click');
    else if(href.startsWith('mailto:')) track('email_click');
    else if(link.classList.contains('map-place-link')||link.getAttribute('aria-label')==='Google') track('google_maps_click');
  });

  document.addEventListener('submit',event=>{
    const form=event.target;
    if(!form.classList.contains('contact-form'))return;
    const service=form.querySelector('[name="servico"]')?.value||'';
    track('generate_lead',{lead_source:'website_form',service});
  });

  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced)return;
  document.documentElement.classList.add('motion-enabled');

  const addReveal=(selector,step=0)=>{
    document.querySelectorAll(selector).forEach((el,index)=>{
      el.classList.add('reveal');
      if(step)el.style.setProperty('--reveal-delay',Math.min(index*step,240)+'ms');
    });
  };

  addReveal('.home-intro, .home-services, .home-local',0);
  addReveal('.portfolio-row:nth-child(n+3)',70);
  addReveal('.service-block',70);
  addReveal('.about-page > p',70);
  addReveal('.service-heading, .about-heading, .service-links, .about-contact, .project-buttons, .map-frame, .contact-details, .contact-form, .project-heading, .service-cta, .project-meta, .project-nav, .process-section, .project-case, .footer-legal',60);
  addReveal('.project-gallery-single img');
  addReveal('.footer-contact, .social-links',80);

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -4% 0px'});

  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
})();