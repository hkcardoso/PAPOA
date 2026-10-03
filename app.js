(()=> {
  const legacy=location.hash.slice(1);
  const legacyRoutes={portfolio:'/',arquitectura:'/arquitectura',construcao:'/construcao',visualizacao3d:'/visualizacao-3d','visualizacao-3d':'/visualizacao-3d',sobre:'/sobre',contacto:'/contacto'};
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
        const link=document.createElement(p.href?'a':'div');link.className='tile';if(p.href)link.href=p.href;
        link.style.flex=(p.width/p.height)+' 1 0';
        link.setAttribute('aria-label',p.href?'View project '+p.title:p.title);
        const pic=document.createElement('div');pic.className='picture';
        const img=document.createElement('img');img.src=p.image;img.alt=p.project?p.title+' — project visualisation':p.title;
        img.loading=(rowIndex===0&&itemIndex===0)?'eager':'lazy';img.decoding='async';img.sizes='(max-width: 650px) 100vw, 50vw';
        if(rowIndex===0&&itemIndex===0)img.fetchPriority='high';else if(rowIndex>0)img.fetchPriority='low';img.width=p.width;img.height=p.height;
        if(p.crop){const crop=p.crop;pic.classList.add('reference-picture');pic.style.aspectRatio=crop.w+'/'+crop.h;Object.assign(img.style,{position:'absolute',width:(crop.sourceWidth/crop.w*100)+'%',maxWidth:'none',height:'auto',left:(-crop.x/crop.w*100)+'%',top:(-crop.y/crop.h*100)+'%'});}
        pic.append(img);link.append(pic);
        if(p.project){const copy=document.createElement('div');copy.className='tile-copy';const title=document.createElement('strong');title.textContent=p.title;const subtitle=document.createElement('span');subtitle.textContent=p.author||'';copy.append(title,subtitle);link.append(copy);}
        row.append(link);
      });portfolio.append(row);
    });
  }
  if(filters){filters.addEventListener('click',e=>{const button=e.target.closest('[data-category]');if(!button)return;category=button.dataset.category;filters.querySelectorAll('[data-category]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}}
  window.addEventListener('papoa:languagechange',render);
  render();
})();