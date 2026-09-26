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
  before.src='/assets/images/yachts/before.webp';
  after.src='/assets/images/yachts/PRESTIGE_M8EVO_PHOTOS_INTERIORS.webp';
  before.alt=pt?'Interior do yacht antes do refit':'Yacht interior before refit';
  after.alt=pt?'Interior do yacht depois do refit':'Yacht interior after refit';
  before.decoding='async';
  after.decoding='async';

  const section=wrap.closest('.papoa-ba-section');
  section?.querySelector('.papoa-ba-demo-note')?.remove();
})();
