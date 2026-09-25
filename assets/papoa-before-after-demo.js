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
  before.src='/assets/images/before-after/yacht-salon-before.jpg';
  after.src='/assets/images/before-after/yacht-salon-after.jpg';
  before.alt=pt?'Exemplo conceptual do interior de yacht antes do refit':'Conceptual yacht interior before refit';
  after.alt=pt?'Interior de yacht depois do refit':'Yacht interior after refit';
  before.decoding='async';
  after.decoding='async';

  const section=wrap.closest('.papoa-ba-section');
  if(section&&!section.querySelector('.papoa-ba-demo-note')){
    const note=document.createElement('p');
    note.className='papoa-ba-demo-note';
    note.textContent=pt?'Exemplo visual conceptual — a imagem “antes” foi criada para demonstrar o sistema.':'Conceptual visual example — the “before” image was created to demonstrate the comparison system.';
    wrap.insertAdjacentElement('afterend',note);
  }

  if(!document.getElementById('papoa-ba-demo-style')){
    const style=document.createElement('style');
    style.id='papoa-ba-demo-style';
    style.textContent='.papoa-ba-demo-note{margin:12px 0 0;font-size:10px;line-height:1.5;color:rgba(255,255,255,.5);letter-spacing:.02em}';
    document.head.appendChild(style);
  }
})();
