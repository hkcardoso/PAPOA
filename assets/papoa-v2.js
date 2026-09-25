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
