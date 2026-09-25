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

  core.addEventListener('load',()=>{
    /* Keep navigation extremely short. This style is appended after the polish layer link,
       so the slower legacy transition can never win the cascade. */
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

  core.addEventListener('error',reveal,{once:true});
  document.head.appendChild(core);

  /* Fallback only for a genuine asset failure, not part of the normal navigation path. */
  setTimeout(reveal,700);
})();
