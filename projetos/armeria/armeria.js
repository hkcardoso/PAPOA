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


  // Lightbox applies only to the renders gallery. Editorial design mockups remain static.
  const lightboxGroups=[
    [...document.querySelectorAll('.ac-gallery-card img')]
  ].filter(group=>group.length);
  if(lightboxGroups.length&&typeof HTMLDialogElement!=='undefined'){
    const dialog=document.createElement('dialog');
    dialog.className='ac-lightbox';
    dialog.setAttribute('aria-label','Galeria Armeria Baleal Residence');
    dialog.innerHTML=`
      <div class="ac-lightbox-top"><span class="ac-lightbox-index" aria-live="polite"></span><button type="button" class="ac-lightbox-close" aria-label="Fechar galeria" title="Fechar">×</button></div>
      <div class="ac-lightbox-stage">
        <button type="button" class="ac-lightbox-prev" aria-label="Imagem anterior">‹</button>
        <img class="ac-lightbox-image" alt="">
        <button type="button" class="ac-lightbox-next" aria-label="Imagem seguinte">›</button>
      </div>
      <div class="ac-lightbox-bottom"><p class="ac-lightbox-caption"></p><div class="ac-lightbox-thumbs" aria-label="Miniaturas da galeria"></div></div>
    `;
    document.body.append(dialog);
    const fullImage=dialog.querySelector('.ac-lightbox-image');
    const counter=dialog.querySelector('.ac-lightbox-index');
    const caption=dialog.querySelector('.ac-lightbox-caption');
    const thumbs=dialog.querySelector('.ac-lightbox-thumbs');
    const closeButton=dialog.querySelector('.ac-lightbox-close');
    let items=[],selected=0,returnFocus=null;

    const showImage=index=>{
      if(!items.length)return;
      selected=(index+items.length)%items.length;
      const chosen=items[selected];
      fullImage.src=chosen.currentSrc||chosen.src;
      fullImage.alt=chosen.alt;
      caption.textContent=chosen.alt;
      counter.textContent=String(selected+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0');
      [...thumbs.children].forEach((btn,i)=>{
        const active=i===selected;
        btn.classList.toggle('is-selected',active);
        if(active){btn.setAttribute('aria-current','true');btn.scrollIntoView({block:'nearest',inline:'nearest'});}
        else btn.removeAttribute('aria-current');
      });
      // Load the next image early for fluid navigation.
      const next=items[(selected+1)%items.length];
      if(next){const preload=new Image();preload.src=next.currentSrc||next.src;}
    };
    const openGallery=(group,index,trigger)=>{
      items=group;
      returnFocus=trigger;
      thumbs.replaceChildren();
      group.forEach((img,i)=>{
        const thumb=document.createElement('button');
        thumb.type='button';
        thumb.className='ac-lightbox-thumb';
        thumb.setAttribute('aria-label','Ver imagem '+(i+1));
        const preview=document.createElement('img');
        preview.src=img.currentSrc||img.src;
        preview.alt='';
        preview.loading='lazy';
        thumb.append(preview);
        thumb.addEventListener('click',()=>showImage(i));
        thumbs.append(thumb);
      });
      dialog.showModal();
      document.documentElement.classList.add('ac-lightbox-open');
      showImage(index);
      closeButton.focus();
    };
    const closeGallery=()=>dialog.close();
    dialog.querySelector('.ac-lightbox-prev').addEventListener('click',()=>showImage(selected-1));
    dialog.querySelector('.ac-lightbox-next').addEventListener('click',()=>showImage(selected+1));
    closeButton.addEventListener('click',closeGallery);
    dialog.querySelector('.ac-lightbox-stage').addEventListener('click',e=>{
      if(e.target.classList.contains('ac-lightbox-stage'))closeGallery();
    });
    dialog.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'||e.key==='ArrowLeft'){
        e.preventDefault();
        showImage(selected+(e.key==='ArrowRight'?1:-1));
      }
    });
    let touchX=null;
    dialog.querySelector('.ac-lightbox-stage').addEventListener('touchstart',e=>{
      touchX=e.touches.length===1?e.touches[0].clientX:null;
    },{passive:true});
    dialog.querySelector('.ac-lightbox-stage').addEventListener('touchend',e=>{
      if(touchX===null||!e.changedTouches.length)return;
      const delta=e.changedTouches[0].clientX-touchX;
      touchX=null;
      if(Math.abs(delta)>55)showImage(selected+(delta<0?1:-1));
    },{passive:true});
    dialog.addEventListener('close',()=>{
      document.documentElement.classList.remove('ac-lightbox-open');
      fullImage.removeAttribute('src');
      if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});
    });

    lightboxGroups.forEach(group=>group.forEach((img,index)=>{
      const button=document.createElement('button');
      button.type='button';
      button.className='ac-photo-trigger';
      button.setAttribute('aria-label','Ampliar imagem: '+img.alt);
      img.before(button);
      button.append(img);
      button.addEventListener('click',()=>openGallery(group,index,button));
    }));
  }
})();