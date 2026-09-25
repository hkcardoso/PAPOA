(()=>{
  'use strict';
  const path=location.pathname.replace(/\/+$/,'/')||'/';
  if(!/(^|\/)yachts\/$/.test(path))return;

  const wrap=document.querySelector('.papoa-before-after');
  if(!wrap||wrap.dataset.papoaDemoLoaded==='1')return;
  wrap.dataset.papoaDemoLoaded='1';

  const before=wrap.querySelector('.papoa-ba-before');
  const after=wrap.querySelector('.papoa-ba-after');
  if(!before||!after)return;

  const pt=(document.documentElement.lang||'').toLowerCase().startsWith('pt');
  const beforeParts=[
    '/assets/images/before-after/yacht-salon-before-1.txt',
    '/assets/images/before-after/yacht-salon-before-2.txt',
    '/assets/images/before-after/yacht-salon-before-3a.txt',
    '/assets/images/before-after/yacht-salon-before-3b.txt'
  ];
  const afterParts=[
    '/assets/images/before-after/yacht-salon-after-1.txt',
    '/assets/images/before-after/yacht-salon-after-2.txt',
    '/assets/images/before-after/yacht-salon-after-3.txt',
    '/assets/images/before-after/yacht-salon-after-4.txt',
    '/assets/images/before-after/yacht-salon-after-5.txt'
  ];

  const style=document.createElement('style');
  style.textContent=`
    .papoa-before-after.papoa-ba-demo-loading:after{content:"";position:absolute;z-index:5;inset:0;background:rgba(8,9,9,.46);pointer-events:none;transition:opacity .25s ease}
    .papoa-before-after.papoa-ba-demo-ready:after{opacity:0}
    .papoa-ba-demo-note{margin:12px 0 0;font-size:10px;line-height:1.5;color:rgba(255,255,255,.5);letter-spacing:.02em}
  `;
  document.head.appendChild(style);

  wrap.classList.add('papoa-ba-demo-loading');
  before.alt=pt?'Exemplo conceptual do interior de yacht antes do refit':'Conceptual yacht interior before refit';
  after.alt=pt?'Interior de yacht depois do refit':'Yacht interior after refit';

  const section=wrap.closest('.papoa-ba-section');
  if(section&&!section.querySelector('.papoa-ba-demo-note')){
    const note=document.createElement('p');
    note.className='papoa-ba-demo-note';
    note.textContent=pt?'Exemplo visual conceptual — a imagem “antes” foi criada para demonstrar o sistema.':'Conceptual visual example — the “before” image was created to demonstrate the comparison system.';
    wrap.insertAdjacentElement('afterend',note);
  }

  const loadData=async parts=>{
    const responses=await Promise.all(parts.map(url=>fetch(url,{cache:'force-cache'})));
    if(responses.some(response=>!response.ok))throw new Error('Before/after image data unavailable');
    const chunks=await Promise.all(responses.map(response=>response.text()));
    return `data:image/jpeg;base64,${chunks.join('').replace(/\s+/g,'')}`;
  };

  Promise.all([loadData(beforeParts),loadData(afterParts)])
    .then(([beforeSrc,afterSrc])=>{
      before.src=beforeSrc;
      after.src=afterSrc;
      before.removeAttribute('srcset');
      after.removeAttribute('srcset');
      wrap.classList.remove('papoa-ba-demo-loading');
      wrap.classList.add('papoa-ba-demo-ready');
      requestAnimationFrame(()=>wrap.classList.remove('papoa-ba-demo-ready'));
    })
    .catch(error=>{
      wrap.classList.remove('papoa-ba-demo-loading');
      console.warn('[PAPOA before/after]',error);
    });
})();
