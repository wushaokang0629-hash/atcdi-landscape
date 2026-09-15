'use strict';
const $=s=>document.querySelector(s);
const SLIDE_INTERVAL=2000;
let searchQuery='';
const categories=[['全部','ALL PROJECTS'],['城市更新','URBAN RENEWAL'],['乡村振兴','RURAL REVITALIZATION'],['交旅融合','TRANSPORT & TOURISM'],['生态环境','ECOLOGICAL ENVIRONMENT'],['公园绿地','PARKS & OPEN SPACE'],['交通景观','TRANSPORT LANDSCAPE'],['建筑环境','BUILT ENVIRONMENT']];
const categoryOf=p=>p.category.split(' / ')[0];
const matching=category=>projects.map((p,i)=>({...p,index:i})).filter(p=>(category==='全部'||categoryOf(p)===category)&&(!searchQuery||(p.title+p.category+p.description).includes(searchQuery)));
const escapeHtml=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let activeCategory='全部',panelCategory='全部',currentSlide=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,timer,copyTimer,returnFocus;
const statements=['城湖共生，路景相随。','唤醒蓝脉生态活力，构筑河岸绿色生活。','森生不息，与自然共同生长。','慧谷创新地，七星理想家。'];
const heroTitles=['合肥<br>环巢湖风景道','阜阳<br>颍河生态休闲带','合肥<br>庐州公园','合肥<br>交通慧谷'];
function renderProjects(category='全部'){
 activeCategory=category;const list=matching(category);$('#filter-state').classList.toggle('default',category==='全部'&&!searchQuery);
 $('#project-grid').innerHTML=list.map(p=>`<button class="project-card" data-project="${p.index}" aria-label="查看${escapeHtml(p.title)}"><div class="card-intro"><p>${statements[p.index]}</p><h3>${escapeHtml(p.title)}</h3><span>#${categoryOf(p)}</span></div><div class="card-image"><img src="assets/${p.image}.jpg" loading="lazy" alt="${escapeHtml(p.title+' · '+p.caption.split(' · ')[0])}"><span class="card-statement">${statements[p.index]}</span><span class="card-arrow" aria-hidden="true">↗</span></div></button>`).join('');
 document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b.dataset.filter===category;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});
 $('#project-empty').hidden=list.length>0;$('#filter-name').textContent=searchQuery?'搜索：'+searchQuery:(category==='全部'?'全部项目':category);$('#project-count').textContent=String(list.length).padStart(2,'0')+' 个精选项目';$('#clear-filter').hidden=category==='全部'&&!searchQuery;
}
function stopTimer(){clearInterval(timer);timer=undefined;$('#slide-progress').classList.add('paused')}
function startTimer(){stopTimer();if(paused||document.hidden||document.querySelector('dialog[open]'))return;const progress=$('#slide-progress');progress.classList.remove('running','paused');void progress.offsetWidth;progress.classList.add('running');timer=setInterval(()=>changeSlide(currentSlide+1),SLIDE_INTERVAL)}
function changeSlide(index){currentSlide=(index+projects.length)%projects.length;const p=projects[currentSlide];document.querySelectorAll('.slide').forEach((s,i)=>{s.classList.toggle('active',i===currentSlide);s.setAttribute('aria-hidden',String(i!==currentSlide))});const copy=$('.hero-copy');copy.classList.add('changing');clearTimeout(copyTimer);copyTimer=setTimeout(()=>{$('#hero-title').innerHTML=heroTitles[currentSlide];$('#hero-project').innerHTML=statements[currentSlide];$('#hero-category').textContent=p.category;copy.classList.remove('changing')},matchMedia('(prefers-reduced-motion: reduce)').matches?0:200);$('#slide-number').textContent=String(currentSlide+1).padStart(2,'0')+' / 04';startTimer()}
function closePanels(restore=true){document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.body.classList.remove('panel-open');if(restore&&returnFocus?.isConnected)returnFocus.focus({preventScroll:true});startTimer()}
function dismissPanel(){const menu=$('#menu-panel');if(menu.open&&!matchMedia('(prefers-reduced-motion: reduce)').matches){menu.classList.add('closing');setTimeout(()=>{menu.classList.remove('closing');closePanels()},450)}else closePanels()}
function showPanel(id,trigger){const alreadyOpen=!!document.querySelector('dialog[open]');if(!alreadyOpen)returnFocus=trigger||document.activeElement;closePanels(false);stopTimer();document.body.classList.add('panel-open');$(id).showModal()}
function chooseCategory(category){panelCategory=category;document.querySelectorAll('#category-list button').forEach(b=>{const chosen=b.dataset.chooseCategory===category;b.classList.toggle('active',chosen);b.setAttribute('aria-pressed',String(chosen))});$('#category-name').textContent=category==='全部'?'全部项目':category;$('#category-en').textContent=categories.find(c=>c[0]===category)[1];const list=matching(category);$('#category-preview').innerHTML=list.length?list.map(p=>`<button class="preview-project" data-project="${p.index}"><img src="assets/${p.image}.jpg" alt=""><span>${escapeHtml(p.title)}<small>${categoryOf(p)} · ${p.caption.split(' · ')[0]}</small></span></button>`).join(''):'<div class="category-empty"><p>项目内容待填充</p><small>此分类已预留，项目资料将陆续收录。</small></div>';$('#apply-category').textContent=category==='全部'?'浏览全部项目 ↗':'查看该类型项目 ↗'}
function openCategories(category,trigger){$('#category-title').textContent='项目类型';chooseCategory(category);showPanel('#category-panel',trigger)}
function showProject(index,trigger){const p=projects[index];$('#detail-label').textContent=p.category;$('#detail-title').textContent=p.title;$('#detail-caption').textContent=p.caption;$('#detail-visual').innerHTML=`<img src="assets/${p.image}.jpg" alt="${escapeHtml(p.title+' · '+p.caption.split(' · ')[0])}">`;$('#detail-text').innerHTML='<p>'+escapeHtml(p.description)+'</p><div class="placeholder"><h3>项目图集与设计详解</h3><p>内容待填充</p></div><p class="source">项目简介与图片来源：城市空间与园林分院宣传画册。</p>';showPanel('#detail-panel',trigger);$('#detail-panel').scrollTop=0}
const info={
 '分院简介':['ABOUT THE STUDIO','安徽省交通规划设计研究总院股份有限公司 · 城市空间与园林分院','依托综合专业平台，为工程建设提供多领域、集成式的景观营建。业务涵盖城市更新、乡村振兴、交旅融合、生态环境、公园绿地、交通景观和建筑环境，提供从策划、规划、设计到项目落地的一体化专业服务。'],
 '设计理念':['OUR PHILOSOPHY','美好景观践行者','怀揣对生态环境、人居环境持续改善与提高的责任感，以设计回应场地与使用者的需求，让景观走进生活。']
};
function showInfo(name,trigger){const data=info[name];$('#detail-label').textContent=data?.[0]||'STUDIO / '+name;$('#detail-title').textContent=name;$('#detail-caption').textContent=data?.[1]||'';$('#detail-visual').innerHTML='';$('#detail-text').innerHTML=data?'<p>'+data[2]+'</p>':'<div class="placeholder"><h3>内容待填充</h3><p>'+escapeHtml(name)+'资料将在此展示。</p></div>';showPanel('#detail-panel',trigger);$('#detail-panel').scrollTop=0}
$('#slides').innerHTML=projects.map((p,i)=>`<div class="slide ${i===0?'active':''}" aria-hidden="${i!==0}"><img src="assets/${p.image}.jpg" alt="${escapeHtml(p.title)}" ${i===0?'fetchpriority="high"':''}></div>`).join('');
$('#menu-categories').innerHTML=categories.slice(1).map(c=>`<button data-category="${c[0]}">${c[0]}</button>`).join('');
$('#category-list').innerHTML=categories.map(c=>`<button data-choose-category="${c[0]}" aria-pressed="false">${c[0]==='全部'?'全部项目':c[0]}<span>${String(matching(c[0]).length).padStart(2,'0')}</span></button>`).join('');
$('#category-strip').innerHTML=categories.slice(1).map(c=>`<button data-category="${c[0]}"># ${c[0]}</button>`).join('');
$('#project-sidebar').innerHTML=categories.map(c=>`<button data-filter="${c[0]}" aria-pressed="false">${c[0]==='全部'?'全部项目':c[0]}</button>`).join('');
renderProjects();
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-close'))dismissPanel();else if(b.dataset.open==='menu')showPanel('#menu-panel',b);else if(b.dataset.open==='categories')openCategories(activeCategory,b);else if(b.dataset.filter){searchQuery='';renderProjects(b.dataset.filter)}else if(b.dataset.category){searchQuery='';openCategories(b.dataset.category,b);}else if(b.dataset.chooseCategory)chooseCategory(b.dataset.chooseCategory);else if(b.dataset.project!==undefined)showProject(Number(b.dataset.project),b);else if(b.dataset.info)showInfo(b.dataset.info,b)});
$('#apply-category').addEventListener('click',()=>{closePanels(false);renderProjects(panelCategory);document.querySelector('#works').scrollIntoView({behavior:'smooth'});$('#filter-name').setAttribute('tabindex','-1');$('#filter-name').focus({preventScroll:true})});
[$('#clear-filter'),$('#empty-reset')].forEach(b=>b.addEventListener('click',()=>{searchQuery='';renderProjects();$('#filter-name').focus({preventScroll:true})}));
document.querySelectorAll('dialog').forEach(d=>{d.addEventListener('cancel',e=>{e.preventDefault();dismissPanel()});d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePanels()})});
$('#prev').addEventListener('click',()=>changeSlide(currentSlide-1));$('#next').addEventListener('click',()=>changeSlide(currentSlide+1));$('#hero-project').addEventListener('click',e=>showProject(currentSlide,e.currentTarget));
function updatePause(){$('#pause').textContent=paused?'播放':'暂停';$('#pause').setAttribute('aria-label',paused?'播放轮播':'暂停轮播');$('#pause').setAttribute('aria-pressed',String(paused));paused?stopTimer():startTimer()}
$('#pause').addEventListener('click',()=>{paused=!paused;updatePause()});
$('.hero').addEventListener('focusin',e=>{if(e.target.id!=='pause'&&!paused){paused=true;updatePause()}});
let touchStart;$('.hero').addEventListener('touchstart',e=>{if(e.target.closest('button,a'))return;touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});$('.hero').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)changeSlide(currentSlide+(dx<0?1:-1));touchStart=null},{passive:true});
document.addEventListener('visibilitychange',()=>document.hidden?stopTimer():startTimer());
function scrollState(){$('.header').classList.toggle('shrink',scrollY>50)}addEventListener('scroll',scrollState,{passive:true});scrollState();
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>observer.observe(e))}
updatePause();


document.querySelectorAll('.site-search').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();searchQuery=form.elements.q.value.trim();chooseCategory('全部');$('#category-title').textContent=searchQuery?'搜索项目':'项目类型';$('#category-name').textContent=searchQuery?'搜索：'+searchQuery:'全部项目';showPanel('#category-panel',form.querySelector('input'))}));


document.querySelector('#menu-panel .brand').addEventListener('click',()=>closePanels(false));
