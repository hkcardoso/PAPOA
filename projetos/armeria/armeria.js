(()=> {
  const device=document.querySelector('.ac-web-device');
  const webImage=device?.querySelector('.ac-web-frame img');
  const webFrame=device?.querySelector('.ac-web-frame');
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateDeviceScroll=()=>{
    if(!webImage||!webFrame)return;
    const imageWidth=webImage.naturalWidth||626;
    const imageHeight=webImage.naturalHeight||2048;
    const renderedHeight=webFrame.clientWidth*imageHeight/imageWidth;
    const overflow=Math.max(0,renderedHeight-webFrame.clientHeight);
    device.style.setProperty('--ac-web-scroll',(-overflow).toFixed(1)+'px');
  };
  if(device&&webImage){
    if(webImage.complete)updateDeviceScroll();
    else webImage.addEventListener('load',updateDeviceScroll,{once:true});
    window.addEventListener('resize',updateDeviceScroll,{passive:true});
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{
        for(const entry of entries)device.classList.toggle('is-in-view',entry.isIntersecting&&!reduce.matches);
      },{threshold:.15});
      observer.observe(device);
    }else if(!reduce.matches){
      device.classList.add('is-in-view');
    }
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
    if(reduce.matches)heroVideo.pause();
    updateButton();
  }
})();