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

const archiveGrid=document.querySelector('#archive-grid');
if(archiveGrid){
  let archiveFilter='all', visibleCount=12;
  const more=document.createElement('button');
  more.className='archive-more';more.type='button';
  archiveGrid.after(more);
  const renderArchive=(filter,reset=true)=>{
    if(reset){archiveFilter=filter;visibleCount=12}
    const images=ARCHIVE_IMAGES.filter(src=>archiveFilter==='all'||(archiveFilter==='2024'?src.includes('2024-page'):!src.includes('2024-page')));
    archiveGrid.innerHTML=images.slice(0,visibleCount).map((src,i)=>{const set=src.includes('2024-page')?'2024 作品集':'2026 作品集',page=(src.match(/(?:page-)(\d+)/)||[])[1]||i+1;return `<figure class="archive-item reveal"><img src="${src}" alt="${set}第 ${Number(page)} 页项目画面" loading="lazy"><figcaption><span>${set}</span><b>PAGE ${String(page).padStart(2,'0')}</b></figcaption></figure>`}).join('');
    document.querySelector('#archive-count').textContent=images.length;
    more.hidden=visibleCount>=images.length;
    more.textContent=`继续浏览 · 已展示 ${Math.min(visibleCount,images.length)} / ${images.length}`;
    observeReveals();bindLightboxes(archiveGrid);
  };
  more.addEventListener('click',()=>{const firstNew=visibleCount;visibleCount+=12;renderArchive(archiveFilter,false);const next=archiveGrid.children[firstNew]?.querySelector('img');next?.focus({preventScroll:true})});
  renderArchive('all');
  document.querySelectorAll('[data-archive]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('[data-archive].active')?.classList.remove('active');button.classList.add('active');renderArchive(button.dataset.archive)}));
}

const contact=document.createElement('div');
contact.className='contact-drawer';
contact.innerHTML=`<div class="contact-backdrop" data-close-contact></div><section role="dialog" aria-modal="true" aria-label="联系方式"><button class="contact-close" data-close-contact aria-label="关闭">×</button><p>CONTACT / 联系</p><h2>如果项目合适，<br>我们可以聊聊。</h2><div class="contact-row"><span>EMAIL</span><b>1259198644@qq.com</b><button data-copy="1259198644@qq.com">复制</button></div><div class="contact-row"><span>WECHAT</span><b>Zenglx7</b><button data-copy="Zenglx7">复制</button></div><a href="mailto:1259198644@qq.com" data-direct-mail>发送邮件 ↗</a><small>视觉设计 · 活动执行 · 广州</small></section>`;
document.body.append(contact);
document.querySelectorAll('a[href^="mailto:"]:not([data-direct-mail])').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();contact.classList.add('open');document.body.classList.add('no-scroll')}));
contact.querySelectorAll('[data-close-contact]').forEach(x=>x.addEventListener('click',()=>{contact.classList.remove('open');document.body.classList.remove('no-scroll')}));
contact.querySelectorAll('[data-copy]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(btn.dataset.copy);btn.textContent='已复制'}catch{btn.textContent='请手动复制'}setTimeout(()=>btn.textContent='复制',1600)}));
addEventListener('keydown',e=>{if(e.key==='Escape'){contact.classList.remove('open');document.body.classList.remove('no-scroll')}});

function bindLightboxes(root=document){
  const images=[...root.querySelectorAll('.case-gallery img,.archive-grid img')];
  images.forEach(img=>{
    if(img.dataset.lightboxBound)return;
    img.dataset.lightboxBound='1';img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label',`放大查看：${img.alt}`);
    const open=()=>{
      let index=images.indexOf(img);
      const box=document.createElement('div');box.className='lightbox';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','作品图片浏览');
      box.innerHTML='<button class="lightbox-close" aria-label="关闭图片浏览">×</button><button class="lightbox-prev" aria-label="上一张">←</button><img><button class="lightbox-next" aria-label="下一张">→</button><p aria-live="polite"></p>';
      const show=()=>{const current=images[index];box.querySelector('img').src=current.src;box.querySelector('img').alt=current.alt;box.querySelector('p').textContent=`${index+1} / ${images.length} · ${current.alt}`};
      const move=step=>{index=(index+step+images.length)%images.length;show()};
      const wasLocked=document.body.classList.contains('no-scroll');
      const close=()=>{document.removeEventListener('keydown',keys);box.remove();if(!wasLocked)document.body.classList.remove('no-scroll');img.focus({preventScroll:true})};
      const keys=e=>{
        if(e.key==='Escape'){e.preventDefault();close()}
        if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}
        if(e.key==='ArrowRight'){e.preventDefault();move(1)}
        if(e.key==='Tab'){const buttons=[...box.querySelectorAll('button')];const i=buttons.indexOf(document.activeElement);e.preventDefault();buttons[(i+(e.shiftKey?-1:1)+buttons.length)%buttons.length].focus()}
      };
      box.querySelector('.lightbox-close').onclick=close;
      box.querySelector('.lightbox-prev').onclick=()=>move(-1);
      box.querySelector('.lightbox-next').onclick=()=>move(1);
      box.addEventListener('click',e=>{if(e.target===box)close()});
      show();document.body.append(box);document.body.classList.add('no-scroll');requestAnimationFrame(()=>box.classList.add('open'));box.querySelector('button').focus();document.addEventListener('keydown',keys);
    };
    img.addEventListener('click',open);img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});
  });
}
bindLightboxes();

// Keep portfolio totals tied to the actual available archive.
const homeArchiveCount=document.querySelector('.full-archive .section-title>p');
if(homeArchiveCount)homeArchiveCount.textContent=`${ARCHIVE_IMAGES.length} 张作品页面，来自两版作品集。点击画面放大浏览。`;
