(()=>{
  const legacy=location.hash.slice(1);
  const legacyRoutes={
    portfolio:'/',
    arquitectura:'/arquitectura',
    construcao:'/construcao',
    visualizacao3d:'/visualizacao-3d',
    'visualizacao-3d':'/visualizacao-3d',
    sobre:'/sobre',
    contacto:'/contacto'
  };
  if(legacyRoutes[legacy]){
    location.replace(legacyRoutes[legacy]+location.search);
    return;
  }

  const data=window.PAPOA_PORTFOLIO;
  const portfolio=document.querySelector('#portfolio');
  if(!data||!portfolio)return;

  const {projects,rows}=data;
  rows.forEach((items,rowIndex)=>{
    const row=document.createElement('div');
    row.className='portfolio-row';

    items.forEach((item,itemIndex)=>{
      const p={...projects[item.project],...item};
      const link=document.createElement(p.href?'a':'div');
      link.className='tile';
      if(p.href)link.href=p.href;
      link.style.flex=`${p.width/p.height} 1 0`;
      link.setAttribute('aria-label',p.href?`Ver projecto ${p.title}`:p.title);

      const pic=document.createElement('div');
      pic.className='picture';
      const img=document.createElement('img');
      img.src=p.image;
      img.alt=p.project?`${p.title} — visualização do projecto`:p.title;
      img.loading=(rowIndex===0&&itemIndex===0)?'eager':'lazy';
      img.decoding='async';
      img.sizes='(max-width: 650px) 100vw, 50vw';
      if(rowIndex===0&&itemIndex===0)img.fetchPriority='high';
      else if(rowIndex>0)img.fetchPriority='low';
      img.width=p.width;
      img.height=p.height;

      if(p.crop){
        const crop=p.crop;
        pic.classList.add('reference-picture');
        pic.style.aspectRatio=`${crop.w}/${crop.h}`;
        Object.assign(img.style,{
          position:'absolute',
          width:`${crop.sourceWidth/crop.w*100}%`,
          maxWidth:'none',
          height:'auto',
          left:`${-crop.x/crop.w*100}%`,
          top:`${-crop.y/crop.h*100}%`
        });
      }

      pic.append(img);
      link.append(pic);

      if(p.project){
        const copy=document.createElement('div');
        copy.className='tile-copy';
        const title=document.createElement('strong');
        title.textContent=p.title;
        const subtitle=document.createElement('span');
        subtitle.textContent=p.author;
        copy.append(title,subtitle);
        link.append(copy);
      }

      row.append(link);
    });

    portfolio.append(row);
  });
})();