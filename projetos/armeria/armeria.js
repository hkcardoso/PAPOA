(()=> {
  const device=document.querySelector('.ac-web-device');
  const webFrame=device?.querySelector('.ac-web-frame');
  const webImage=webFrame?.querySelector('img');
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');

  // O mesmo movimento guiado pelo rato usado no cartão da homepage.
  if(device&&webFrame&&webImage){
    const state={active:false,current:0,speed:0,direction:0,overflow:0};
    let frameId=0;
    let lastFrame=0;

    const updateBounds=()=>{
      const width=webFrame.clientWidth;
      const imageWidth=webImage.naturalWidth||626;
      const imageHeight=webImage.naturalHeight||2048;
      state.overflow=Math.max(0,width*imageHeight/imageWidth-webFrame.clientHeight);
      state.current=Math.max(0,Math.min(state.current,state.overflow));
      webFrame.style.setProperty('--ac-web-position',(-state.current).toFixed(2)+'px');
    };

    const animationFrame=now=>{
      frameId=0;
      if(!state.active||!finePointer.matches||reducedMotion.matches){lastFrame=0;return;}
      const dt=lastFrame?Math.min(48,now-lastFrame):16.67;
      lastFrame=now;
      const desired=state.direction*(state.direction>0?620:380);
      state.speed+=(desired-state.speed)*(1-Math.exp(-dt/350));
      state.current=Math.max(0,Math.min(state.overflow,state.current+state.speed*dt/1000));
      webFrame.style.setProperty('--ac-web-position',(-state.current).toFixed(2)+'px');
      const atEdge=(state.current<=0&&state.speed<0)||(state.current>=state.overflow&&state.speed>0);
      if(atEdge)state.speed=0;
      if(!atEdge&&(Math.abs(state.speed)>.3||Math.abs(desired)>.3)){
        frameId=requestAnimationFrame(animationFrame);
      }else lastFrame=0;
    };

    const setDirection=event=>{
      if(event.pointerType==='touch'||!finePointer.matches||reducedMotion.matches)return;
      const rect=device.getBoundingClientRect();
      const relativeY=Math.max(0,Math.min(1,(event.clientY-rect.top)/Math.max(1,rect.height)));
      const axis=(relativeY-.5)*2;
      const deadZone=.035;
      const magnitude=Math.max(0,(Math.abs(axis)-deadZone)/(1-deadZone));
      state.direction=Math.sign(axis)*Math.pow(magnitude,1.3);
      state.active=true;
      if(!frameId){lastFrame=0;frameId=requestAnimationFrame(animationFrame);}
    };

    device.addEventListener('pointerenter',setDirection);
    device.addEventListener('pointermove',setDirection,{passive:true});
    device.addEventListener('pointerleave',()=>{
      state.active=false;
      state.speed=0;
      state.direction=0;
    });

    if(webImage.complete)updateBounds();
    else webImage.addEventListener('load',updateBounds,{once:true});
    window.addEventListener('resize',updateBounds,{passive:true});

  }

  const heroVideo=document.querySelector('.ac-hero-video');
  const videoButton=document.querySelector('[data-video-toggle]');
  if(heroVideo&&videoButton){
    const updateButton=()=>{
      const paused=heroVideo.paused;
      videoButton.textContent=paused?'▶':'Ⅱ';
      videoButton.setAttribute('aria-label',paused?'Reproduzir vídeo':'Pausar vídeo');
      videoButton.title=paused?'Reproduzir vídeo':'Pausar vídeo';
    };
    videoButton.addEventListener('click',async ()=>{
      if(heroVideo.paused){
        try{await heroVideo.play();}catch(e){/* Browser may block playback until interaction. */}
      }else heroVideo.pause();
      updateButton();
    });
    heroVideo.addEventListener('play',updateButton);
    heroVideo.addEventListener('pause',updateButton);
    if(reducedMotion.matches)heroVideo.pause();
    updateButton();
  }

  // A film player above the still-image gallery; native controls provide seek, volume and fullscreen.
  const filmPlayer=document.querySelector('[data-film-player]');
  const film=filmPlayer?.querySelector('.ac-film-video');
  const filmPlay=filmPlayer?.querySelector('[data-film-play]');
  if(film&&filmPlay){
    const updateFilmState=()=>filmPlayer.classList.toggle('is-playing',!film.paused&&!film.ended);
    filmPlay.addEventListener('click',async()=>{
      try{await film.play();}catch(error){/* Native video controls remain usable if playback fails. */}
    });
    film.addEventListener('play',()=>{
      updateFilmState();
      if(heroVideo&&!heroVideo.paused)heroVideo.pause();
    });
    film.addEventListener('pause',updateFilmState);
    film.addEventListener('ended',updateFilmState);
    film.addEventListener('error',()=>filmPlayer.classList.remove('is-playing'));
    updateFilmState();
  }

  // Show newly supplied photographs only after their assets exist; no broken-image tiles.
  document.querySelectorAll('[data-gallery-pending]').forEach(card=>{
    const image=card.querySelector('img');
    if(!image)return;
    const probe=new Image();
    probe.onload=()=>{card.hidden=false;};
    probe.src=image.getAttribute('src');
  });

  // Keep the current video cover as a fallback until the new facade image is available.
  if(film){
    const candidate=film.getAttribute('data-poster-candidate');
    if(candidate){
      const facadePreview=new Image();
      facadePreview.onload=()=>{film.poster=candidate;};
      facadePreview.src=candidate;
    }
  }
})();