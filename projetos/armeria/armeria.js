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

  const gallery=document.querySelector('[data-gallery]');
  if(!gallery)return;
  const img=gallery.querySelector('[data-gallery-image]');
  const count=gallery.querySelector('[data-gallery-count]');
  const caption=gallery.querySelector('[data-gallery-caption]');
  const dots=gallery.querySelector('[data-gallery-dots]');
  const images=[1,2,3,4,5,6,7].map(n=>({
    src:'/assets/armeria/interior-'+String(n).padStart(2,'0')+'.webp',
    alt:'Armeria Baleal Residence — visualização 3D do interior, vista '+n
  }));
  let index=0;
  let changing=false;
  const dotButtons=images.map((image,n)=>{
    const button=document.createElement('button');
    button.type='button';
    button.setAttribute('aria-label','Ver imagem '+(n+1));
    button.addEventListener('click',()=>show(n));
    dots.append(button);
    return button;
  });
  function show(next){
    if(changing)return;
    const target=(next+images.length)%images.length;
    if(target===index)return;
    index=target;
    changing=true;
    img.classList.add('is-changing');
    const nextImg=new Image();
    nextImg.onload=()=>{
      img.src=images[index].src;
      img.alt=images[index].alt;
      if(count)count.textContent=String(index+1).padStart(2,'0')+' / '+String(images.length).padStart(2,'0');
      if(caption)caption.textContent='INTERIOR '+String(index+1).padStart(2,'0');
      dotButtons.forEach((button,n)=>button.setAttribute('aria-current',String(index===n)));
      requestAnimationFrame(()=>{img.classList.remove('is-changing');changing=false;});
    };
    nextImg.onerror=()=>{
      img.classList.remove('is-changing');changing=false;
    };
    nextImg.src=images[index].src;
  }
  dotButtons.forEach((button,n)=>button.setAttribute('aria-current',String(index===n)));
  gallery.querySelector('[data-gallery-prev]')?.addEventListener('click',()=>show(index-1));
  gallery.querySelector('[data-gallery-next]')?.addEventListener('click',()=>show(index+1));
  gallery.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();show(index-1);}
    if(event.key==='ArrowRight'){event.preventDefault();show(index+1);}
  });
})();