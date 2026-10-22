(()=> {
  const legacy=location.hash.slice(1);
  const legacyRoutes={portfolio:'/',arquitectura:'/arquitectura',construcao:'/construcao',visualizacao3d:'/visualizacao-3d','visualizacao-3d':'/visualizacao-3d',sobre:'/studio',contacto:'/contact'};
  if(legacyRoutes[legacy]){location.replace(legacyRoutes[legacy]+location.search);return;}
  const data=window.PAPOA_PORTFOLIO;
  const portfolio=document.querySelector('#portfolio');
  if(!data||!portfolio)return;
  const {projects,rows}=data;
  const filters=document.querySelector('.project-filters');
  let category=new URLSearchParams(location.search).get('category')||'all';
  function render(){
    portfolio.replaceChildren();
    const matching=rows.map(items=>items.filter(item=>{
      if(category==='all')return true;
      const p=projects[item.project]||item;
      return (item.category||p.category||'residential')===category;
    })).filter(items=>items.length);
    if(!matching.length){
      const empty=document.createElement('p');empty.className='project-empty';
      const lang=window.PAPOA_LANG||'pt';
      empty.textContent=lang==='en'?'Projects in this category are coming soon.':'Em breve, novos projectos nesta categoria.';
      portfolio.append(empty);return;
    }
    matching.forEach((items,rowIndex)=>{
      const row=document.createElement('div');row.className='portfolio-row';
      items.forEach((item,itemIndex)=>{
        const p=Object.assign({},projects[item.project]||{},item);
        if(p.placeholder==='armeria'){
          // Cartão interactivo com a captura real da homepage.
          const tile=document.createElement('a');
          tile.className='tile tile-armeria';
          tile.href='https://armeriabaleal.com/';
          tile.target='_blank';tile.rel='noopener noreferrer';
          tile.style.flex=(p.width/p.height)+' 1 0';
          tile.style.aspectRatio=p.width+'/'+p.height;
          tile.setAttribute('aria-label',p.title+' — site');
          const floating=document.createElement('div');floating.className='teaser-floating';
          const browser=document.createElement('div');browser.className='teaser-browser';
          const chrome=document.createElement('div');chrome.className='teaser-browser-chrome';
          const dots=document.createElement('span');dots.className='teaser-browser-dots';
          dots.setAttribute('aria-hidden','true');
          const address=document.createElement('span');address.className='teaser-browser-address';
          address.textContent='armeriabaleal.com';
          chrome.append(dots,address);
          const screen=document.createElement('div');screen.className='teaser-browser-screen';
          const shot=document.createElement('img');shot.src=p.image;
          shot.alt='Homepage do website Armeria Baleal';
          shot.loading='eager';shot.decoding='async';shot.fetchPriority='low';
          shot.width=626;shot.height=2048;
          screen.append(shot);browser.append(chrome,screen);
          floating.append(browser);tile.append(floating);
          const copy=document.createElement('div');copy.className='tile-copy';
          const title=document.createElement('strong');title.textContent=p.title;
          const subtitle=document.createElement('span');subtitle.textContent=p.author||'';
          copy.append(title,subtitle);tile.append(copy);
          row.append(tile);return;
        }
        if(p.placeholder){
          const pending=document.createElement('div');
          pending.className='tile tile-placeholder';
          pending.style.flex=(p.width/p.height)+' 1 0';
          pending.style.aspectRatio=p.width+'/'+p.height;
          pending.setAttribute('role','img');
          pending.setAttribute('aria-label',window.PAPOA_LANG==='en'?'Project to be announced':'Projeto a anunciar');
          const mark=document.createElement('span');
          mark.className='placeholder-symbol';
          mark.textContent='?';
          mark.setAttribute('aria-hidden','true');
          pending.append(mark);
          row.append(pending);
          return;
        }
        const link=document.createElement(p.href?'a':'div');link.className='tile';if(p.href)link.href=p.href;
        link.style.flex=(p.width/p.height)+' 1 0';
        link.setAttribute('aria-label',p.href?'View project '+p.title:p.title);
        const pic=document.createElement('div');pic.className='picture';
        const img=document.createElement('img');img.src=p.image;img.alt=p.project?p.title+' — project visualisation':p.title;
        img.loading=rowIndex<2?'eager':'lazy';img.decoding='async';img.sizes='(max-width: 650px) 100vw, 50vw';
        if(rowIndex===0&&itemIndex===0)img.fetchPriority='high';else if(rowIndex>1)img.fetchPriority='low';img.width=p.width;img.height=p.height;
        if(p.crop){const crop=p.crop;pic.classList.add('reference-picture');pic.style.aspectRatio=crop.w+'/'+crop.h;Object.assign(img.style,{position:'absolute',width:(crop.sourceWidth/crop.w*100)+'%',maxWidth:'none',height:'auto',left:(-crop.x/crop.w*100)+'%',top:(-crop.y/crop.h*100)+'%'});}
        pic.append(img);link.append(pic);
        if(p.project){const copy=document.createElement('div');copy.className='tile-copy';const title=document.createElement('strong');title.textContent=p.title;const subtitle=document.createElement('span');subtitle.textContent=p.author||'';copy.append(title,subtitle);link.append(copy);}
        row.append(link);
      });portfolio.append(row);
    });
    // Actualiza o limite do scroll depois de trocar filtros/idioma.
    bindArmeriaImage();
  }
  // O rato controla o scroll interno da imagem ao longo de toda a altura do ecrã.
  let pointerY=0;
  let pointerActive=false;
  let pointerFrame=0;
  const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');

  function updateArmeriaBounds(){
    portfolio.querySelectorAll('.tile-armeria').forEach(tile=>{
      const screen=tile.querySelector('.teaser-browser-screen');
      const img=screen&&screen.querySelector('img');
      if(!screen||!img)return;
      const width=screen.clientWidth;
      const height=screen.clientHeight;
      const naturalWidth=img.naturalWidth||img.width||626;
      const naturalHeight=img.naturalHeight||img.height||2048;
      const scrollOverflow=Math.max(0,width*naturalHeight/naturalWidth-height);
      tile.dataset.scrollOverflow=String(scrollOverflow);
      tile.style.setProperty('--teaser-max-scroll',(-scrollOverflow).toFixed(1)+'px');
    });
  }

  function updateTeaserPointer(){
    pointerFrame=0;
    const position=reducedMotion.matches?0:Math.max(0,Math.min(1,pointerY/Math.max(1,window.innerHeight)));
    portfolio.querySelectorAll('.tile-armeria').forEach(tile=>{
      const overflow=Number(tile.dataset.scrollOverflow||0);
      tile.style.setProperty('--teaser-scroll-y',(-overflow*position).toFixed(1)+'px');
      tile.classList.toggle('is-pointer-controlled',pointerActive&&!reducedMotion.matches);
    });
  }

  function bindArmeriaImage(){
    portfolio.querySelectorAll('.tile-armeria img').forEach(img=>{
      if(!img.complete){
        img.addEventListener('load',()=>{
          updateArmeriaBounds();
          updateTeaserPointer();
        },{once:true});
      }
    });
    updateArmeriaBounds();
    updateTeaserPointer();
  }

  window.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||reducedMotion.matches)return;
    pointerY=event.clientY;
    pointerActive=true;
    if(!pointerFrame)pointerFrame=requestAnimationFrame(updateTeaserPointer);
  },{passive:true});
  window.addEventListener('resize',()=>{
    updateArmeriaBounds();
    if(!pointerFrame)pointerFrame=requestAnimationFrame(updateTeaserPointer);
  },{passive:true});
  if(filters){filters.addEventListener('click',e=>{const button=e.target.closest('[data-category]');if(!button)return;category=button.dataset.category;filters.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();});}
  window.addEventListener('papoa:languagechange',render);
  render();
})();