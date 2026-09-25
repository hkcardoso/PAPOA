(()=>{
  const body=document.body;
  let revealed=false;

  const reveal=()=>{
    if(revealed)return;
    revealed=true;
    const show=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>body.classList.add('site-ready')));
    if(document.fonts&&document.fonts.ready){
      Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,260))]).then(show);
    }else show();
  };

  const waitForPolish=()=>{
    const polish=document.querySelector('link[data-papoa-polish]');
    if(!polish||polish.sheet){reveal();return;}
    polish.addEventListener('load',reveal,{once:true});
    polish.addEventListener('error',reveal,{once:true});
    setTimeout(reveal,650);
  };

  const current=document.currentScript;
  const core=document.createElement('script');
  core.src=new URL('./papoa-v2-core.js?v=20260925-1',current?.src||location.href).href;
  core.async=false;
  core.addEventListener('load',waitForPolish,{once:true});
  core.addEventListener('error',reveal,{once:true});
  document.head.appendChild(core);

  /* Never leave the page blank if an external asset fails unexpectedly. */
  setTimeout(reveal,1400);
})();
