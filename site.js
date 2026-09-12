document.querySelectorAll('.logo b').forEach(el=>el.textContent='SEVEN');
document.querySelectorAll('footer b').forEach(el=>el.textContent='曾林祥 / Seven');

const progress=document.createElement('div');
progress.className='scroll-progress';
document.body.append(progress);
requestAnimationFrame(()=>document.body.classList.add('page-ready'));
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`},{passive:true});

const projectRoot=document.querySelector('#projects');
if(projectRoot){
  const render=filter=>{
    projectRoot.classList.add('switching');
    setTimeout(()=>{
      const items=PROJECTS.filter(p=>filter==='all'||p.tags.includes(filter));
      projectRoot.innerHTML=items.map((p,i)=>`<article class="project-card reveal"><a href="project.html?id=${PROJECTS.indexOf(p)}"><div class="project-visual"><img src="${p.cover}" alt="${p.title}" ${i<3?'fetchpriority="high"':'loading="lazy"'}><span>VIEW CASE · 查看案例</span><em>${String(PROJECTS.indexOf(p)+1).padStart(2,'0')}</em></div><div class="project-info"><div class="project-no">${p.year}</div><div><p>${p.type}</p><h3>${p.title}</h3><h4>${p.client}</h4><p class="summary">${p.summary}</p><ul>${p.role.split('、').map(x=>`<li>${x}</li>`).join('')}</ul></div><i>↗</i></div></a></article>`).join('');
      projectRoot.classList.remove('switching');
      observeReveals();
    },180);
  };
  render('all');
  document.querySelectorAll('.filters button').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.filters .active').classList.remove('active');button.classList.add('active');render(button.dataset.filter)}));
}

function observeReveals(){
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');observer.unobserve(e.target)}}),{threshold:.1});
  document.querySelectorAll('.reveal:not(.revealed),.job:not(.revealed),.method-grid article:not(.revealed),.index-columns>div:not(.revealed),.case-gallery figure:not(.revealed)').forEach(el=>observer.observe(el));
}
observeReveals();

const marquee=document.querySelector('.marquee');
if(marquee){const control=marquee.querySelector('button');control.addEventListener('click',()=>{const paused=marquee.classList.toggle('paused');control.setAttribute('aria-pressed',String(paused));control.setAttribute('aria-label',paused?'继续滚动文字':'暂停滚动文字');control.textContent=paused?'▶':'Ⅱ'})}

const contact=document.createElement('div');
contact.className='contact-drawer';
contact.innerHTML=`<div class="contact-backdrop" data-close-contact></div><section role="dialog" aria-modal="true" aria-label="联系方式"><button class="contact-close" data-close-contact aria-label="关闭">×</button><p>CONTACT / 联系</p><h2>如果项目合适，<br>我们可以聊聊。</h2><div class="contact-row"><span>EMAIL</span><b>1259198644@qq.com</b><button data-copy="1259198644@qq.com">复制</button></div><div class="contact-row"><span>WECHAT</span><b>sanqi520680</b><button data-copy="sanqi520680">复制</button></div><a href="mailto:1259198644@qq.com" data-direct-mail>发送邮件 ↗</a><small>视觉设计 · 活动执行 · 广州</small></section>`;
document.body.append(contact);
document.querySelectorAll('a[href^="mailto:"]:not([data-direct-mail])').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();contact.classList.add('open');document.body.classList.add('no-scroll')}));
contact.querySelectorAll('[data-close-contact]').forEach(x=>x.addEventListener('click',()=>{contact.classList.remove('open');document.body.classList.remove('no-scroll')}));
contact.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);btn.textContent='已复制'}catch{btn.textContent='请手动复制'}setTimeout(()=>btn.textContent='复制',1600)}));
addEventListener('keydown',e=>{if(e.key==='Escape'){contact.classList.remove('open');document.body.classList.remove('no-scroll')}});

document.querySelectorAll('.case-gallery img').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','放大查看图片');const open=()=>{const box=document.createElement('div');box.className='lightbox';box.innerHTML=`<button aria-label="关闭">×</button><img src="${img.src}" alt="${img.alt}"><p>${img.alt}</p>`;document.body.append(box);requestAnimationFrame(()=>box.classList.add('open'));const close=()=>{box.classList.remove('open');setTimeout(()=>box.remove(),250)};box.addEventListener('click',e=>{if(e.target===box||e.target.tagName==='BUTTON')close()});addEventListener('keydown',e=>{if(e.key==='Escape')close()},{once:true})};img.addEventListener('click',open);img.addEventListener('keydown',e=>{if(e.key==='Enter')open()})});
