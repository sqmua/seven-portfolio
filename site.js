const projectRoot=document.querySelector('#projects');
if(projectRoot){
  const render=filter=>{
    const items=PROJECTS.filter(p=>filter==='all'||p.tags.includes(filter));
    projectRoot.innerHTML=items.map((p,i)=>`<article class="project-card"><a href="project.html?id=${PROJECTS.indexOf(p)}"><div class="project-visual"><img src="${p.cover}" alt="${p.title}" ${i<3?'fetchpriority="high"':'loading="lazy"'}><span>查看完整案例</span></div><div class="project-info"><div class="project-no">${String(PROJECTS.indexOf(p)+1).padStart(2,'0')}</div><div><p>${p.date} · ${p.type}</p><h3>${p.title}</h3><h4>${p.client}</h4><p class="summary">${p.summary}</p><ul>${p.role.split('、').map(x=>`<li>${x}</li>`).join('')}</ul></div><i>↗</i></div></a></article>`).join('');
  };
  render('all');
  document.querySelectorAll('.filters button').forEach(button=>button.addEventListener('click',()=>{document.querySelector('.filters .active').classList.remove('active');button.classList.add('active');render(button.dataset.filter)}));
}
