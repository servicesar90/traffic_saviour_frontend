(function(){
  const KEY_ROLE = 'docs_role';
  const KEY_DONE = 'docs_done_map_v1';
  const KEY_VER = 'docs_meta_v1';

  function pageKey(){ return location.pathname.split('/').pop() || 'index.html'; }
  function readDone(){ try{return JSON.parse(localStorage.getItem(KEY_DONE)||'{}')}catch{return {}} }
  function writeDone(v){ localStorage.setItem(KEY_DONE, JSON.stringify(v)); }

  function injectTopControls(){
    const wrap = document.querySelector('.search-wrap');
    if(!wrap) return;
    if(!wrap.querySelector('.enhance-wrap')){
      const ewrap = document.createElement('div');
      ewrap.className = 'enhance-wrap';
      ewrap.innerHTML = '<button type="button" class="controls-toggle" id="docs-controls-toggle" aria-expanded="false">Controls</button>';
      wrap.appendChild(ewrap);
    }
    const ewrap = wrap.querySelector('.enhance-wrap');
    if(!wrap.querySelector('.enhance-bar')){
      const bar = document.createElement('div');
      bar.className='enhance-bar';
      bar.innerHTML = '<select class="role-select" aria-label="Role view"><option value="owner">Owner View</option><option value="ops">Ops View</option><option value="qa">QA View</option></select><select class="tag-filter" aria-label="Section filter"><option value="all">All Sections</option><option value="sop">SOP Only</option><option value="integration">Integration</option><option value="tool">Tools</option></select><button type="button" id="docs-export-json">Export JSON</button><button type="button" id="docs-export-csv">Export CSV</button><button type="button" id="docs-print">Print</button><button type="button" id="docs-reset-progress">Reset Progress</button><button type="button" id="docs-shortcuts">Shortcuts</button>';
      ewrap.appendChild(bar);
    }
    const toggle = document.getElementById('docs-controls-toggle');
    toggle?.addEventListener('click', ()=>{
      const open = ewrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    const role = document.querySelector('.role-select');
    role.value = localStorage.getItem(KEY_ROLE) || 'owner';
    role.addEventListener('change', ()=>{ localStorage.setItem(KEY_ROLE, role.value); applyRoleNotes(); });

    const tag = document.querySelector('.tag-filter');
    tag.addEventListener('change', ()=>filterSections(tag.value));
  }

  async function injectMetaAndProgress(){
    const content = document.querySelector('.content');
    if(!content) return;
    if(!content.querySelector('.meta-card')){
      let meta = null;
      try {
        const res = await fetch('doc-metadata.json', { cache: 'no-store' });
        if (res.ok) meta = await res.json();
      } catch {}
      if (!meta) {
        meta = JSON.parse(localStorage.getItem(KEY_VER)||'{"version":"v1.0","owner":"Zypnotic LLC","updated":"2026-05-05","validated_against":"Dashboard build"}');
      } else {
        localStorage.setItem(KEY_VER, JSON.stringify(meta));
      }
      const card = document.createElement('div');
      card.className='meta-card';
      card.innerHTML = `<strong>Doc Meta:</strong> Version ${meta.version} | Owner ${meta.owner} | Reviewer ${meta.reviewer || '-'} | Updated ${meta.updated} | Validated ${meta.validated_against || '-'}`;
      content.insertBefore(card, content.firstChild.nextSibling);
    }
    if(!content.querySelector('.progress-wrap')){
      const p = document.createElement('div');
      p.className='progress-wrap';
      p.innerHTML='<span id="progress-text">Progress 0%</span><div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>';
      content.insertBefore(p, content.querySelector('.section') || null);
    }
  }

  function enrichSections(){
    const doneMap = readDone();
    const pKey = pageKey();
    const sections = [...document.querySelectorAll('.section')];

    sections.forEach((sec, idx)=>{
      if(!sec.id) sec.id = `sec-${idx+1}`;
      if(!sec.querySelector('.section-actions')){
        const actions = document.createElement('div');
        actions.className='section-actions';
        actions.innerHTML = '<button type="button" class="done-toggle">Mark Done</button><button type="button" class="sop-copy">Copy SOP/Text</button>';
        sec.appendChild(actions);
      }

      const doneBtn = sec.querySelector('.done-toggle');
      const sopBtn = sec.querySelector('.sop-copy');
      const key = `${pKey}#${sec.id}`;
      const isDone = !!doneMap[key];
      doneBtn.textContent = isDone ? 'Completed' : 'Mark Done';
      doneBtn.style.background = isDone ? '#3c79ff' : '#fff';
      doneBtn.style.color = isDone ? '#fff' : '#475569';

      doneBtn.onclick = ()=>{
        const d = readDone();
        d[key] = !d[key];
        writeDone(d);
        enrichSections();
        updateProgress();
      };

      sopBtn.onclick = async ()=>{
        const text = sec.innerText.trim();
        await navigator.clipboard.writeText(text);
        sopBtn.textContent='Copied';
        setTimeout(()=>sopBtn.textContent='Copy SOP/Text',1000);
      };

      if(!sec.querySelector('.related-links')){
        const rel = document.createElement('p');
        rel.className='muted related-links';
        const next = sections[idx+1]?.id;
        rel.innerHTML = next ? `Related: <a href="#${next}">Next section</a>` : 'Related: End of page section reached.';
        sec.appendChild(rel);
      }
    });
  }

  function updateProgress(){
    const sections = [...document.querySelectorAll('.section')];
    const done = readDone();
    const pKey = pageKey();
    const doneCount = sections.filter(s=>done[`${pKey}#${s.id}`]).length;
    const pct = sections.length ? Math.round((doneCount/sections.length)*100) : 0;
    const t = document.getElementById('progress-text');
    const f = document.getElementById('progress-fill');
    if(t) t.textContent = `Progress ${pct}% (${doneCount}/${sections.length})`;
    if(f) f.style.width = `${pct}%`;
  }

  function buildSearchResults(){
    const input = document.querySelector('[data-search]');
    if(!input) return;
    const wrap = input.parentElement;
    if(!wrap.querySelector('.search-results')){
      const box = document.createElement('div');
      box.className='search-results';
      box.hidden = true;
      wrap.style.position='relative';
      wrap.appendChild(box);
    }
    const box = wrap.querySelector('.search-results');

    input.addEventListener('input', ()=>{
      const q = input.value.trim().toLowerCase();
      if(!q){ box.hidden = true; box.innerHTML=''; return; }
      const nodes = [...document.querySelectorAll('h1,h2,h3,p,li,td')];
      const found = nodes.filter(n=>n.textContent.toLowerCase().includes(q)).slice(0,12);
      box.innerHTML = found.map((n,i)=>`<a href="#" data-i="${i}" class="search-result-item">${n.textContent.slice(0,110)}</a>`).join('');
      box.hidden = !found.length;
      box.querySelectorAll('a').forEach((a,i)=>a.onclick=(e)=>{e.preventDefault(); found[i].scrollIntoView({behavior:'smooth',block:'center'}); box.hidden=true;});
    });
  }

  function exportData(type){
    const sections = [...document.querySelectorAll('.section')].map(s=>({id:s.id,title:s.querySelector('h2')?.textContent||'',text:s.innerText.trim()}));
    if(type==='json'){
      const blob = new Blob([JSON.stringify({page:pageKey(),sections},null,2)], {type:'application/json'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`docs-${pageKey()}.json`; a.click(); URL.revokeObjectURL(a.href);
    } else {
      const lines = ['id,title,text'];
      sections.forEach(s=>lines.push(`"${s.id}","${(s.title||'').replace(/"/g,'""')}","${s.text.replace(/"/g,'""').replace(/\n/g,' ')}"`));
      const blob = new Blob([lines.join('\n')], {type:'text/csv'});
      const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`docs-${pageKey()}.csv`; a.click(); URL.revokeObjectURL(a.href);
    }
  }

  function bindExportsAndShortcuts(){
    document.getElementById('docs-export-json')?.addEventListener('click', ()=>exportData('json'));
    document.getElementById('docs-export-csv')?.addEventListener('click', ()=>exportData('csv'));
    document.getElementById('docs-print')?.addEventListener('click', ()=>window.print());
    document.getElementById('docs-reset-progress')?.addEventListener('click', ()=>{
      localStorage.removeItem(KEY_DONE);
      enrichSections();
      updateProgress();
    });

    let modal = document.querySelector('.shortcuts-modal');
    if(!modal){
      modal = document.createElement('div');
      modal.className='shortcuts-modal';
      modal.innerHTML='<div class="shortcuts-card"><h3>Keyboard Shortcuts</h3><p><code>/</code> focus search, <code>?</code> open this, <code>Esc</code> close overlays, <code>j/k</code> next/prev section.</p><button type="button" id="close-shortcuts">Close</button></div>';
      document.body.appendChild(modal);
      modal.addEventListener('click',(e)=>{ if(e.target===modal) modal.classList.remove('open'); });
      modal.querySelector('#close-shortcuts').onclick=()=>modal.classList.remove('open');
    }

    document.getElementById('docs-shortcuts')?.addEventListener('click', ()=>modal.classList.add('open'));

    document.addEventListener('keydown',(e)=>{
      if(e.key==='/' && document.activeElement?.tagName!=='INPUT'){ e.preventDefault(); document.querySelector('[data-search]')?.focus(); }
      if(e.key==='?'){ e.preventDefault(); modal.classList.add('open'); }
      if(e.key==='j' || e.key==='k'){
        const secs=[...document.querySelectorAll('.section')];
        const mid=window.scrollY + window.innerHeight/2;
        let idx = secs.findIndex(s=>s.offsetTop<=mid && (s.offsetTop+s.offsetHeight)>=mid);
        if(idx<0) idx=0;
        idx = e.key==='j' ? Math.min(secs.length-1, idx+1) : Math.max(0, idx-1);
        secs[idx]?.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
  }

  function filterSections(tag){
    const sections = [...document.querySelectorAll('.section')];
    sections.forEach(s=>{
      const t=(s.innerText||'').toLowerCase();
      const show = tag==='all' || (tag==='sop'&&t.includes('sop')) || (tag==='integration'&&t.includes('integration')) || (tag==='tool'&&(t.includes('tool')||t.includes('scanner')||t.includes('inspector')));
      s.style.display = show ? '' : 'none';
    });
    updateProgress();
  }

  function applyRoleNotes(){
    const role = localStorage.getItem(KEY_ROLE) || 'owner';
    document.querySelectorAll('.role-note').forEach(n=>n.remove());
    const note = document.createElement('div');
    note.className='callout info role-note';
    const map = {
      owner:'Owner View: Focus on governance, sign-off, billing risk, and escalation readiness.',
      ops:'Ops View: Focus on step execution, validation order, routing outcomes, and incident logs.',
      qa:'QA View: Focus on reproducible tests, evidence capture, pass/fail criteria, and rollback checks.'
    };
    note.textContent = map[role];
    const target = document.querySelector('.content .section');
    if(target) target.parentElement.insertBefore(note, target);
  }

  function injectSimulation(){
    if(pageKey()!=='campaign-management.html') return;
    if(document.getElementById('live-sim')) return;
    const sec = document.createElement('section');
    sec.className='section';
    sec.id='live-sim';
    sec.innerHTML = '<h2>Live Simulation Demo</h2><p>Use this mini simulator to model step-completion readiness before launch.</p><div class="sim-box"><label class="label">Simulation Inputs</label><div class="sim-row"><button type="button" data-sim="step1">Step1 Done</button><button type="button" data-sim="step2">Step2 Done</button><button type="button" data-sim="step3">Step3 Done</button><button type="button" data-sim="reset">Reset</button></div><div class="sim-row" id="sim-out"><span class="sim-pill">Ready: No</span></div></div>';
    const main = document.querySelector('.content');
    const footer = main?.querySelector('[data-pager]');
    if(main && footer) main.insertBefore(sec, footer);

    const state={step1:false,step2:false,step3:false};
    function render(){
      const ready = state.step1 && state.step2 && state.step3;
      document.getElementById('sim-out').innerHTML = `<span class="sim-pill">Step1: ${state.step1?'Done':'Pending'}</span><span class="sim-pill">Step2: ${state.step2?'Done':'Pending'}</span><span class="sim-pill">Step3: ${state.step3?'Done':'Pending'}</span><span class="sim-pill">Ready: ${ready?'Yes':'No'}</span>`;
    }
    sec.querySelectorAll('[data-sim]').forEach(b=>b.onclick=()=>{ const k=b.dataset.sim; if(k==='reset'){state.step1=state.step2=state.step3=false;} else state[k]=!state[k]; render();});
    render();
  }

  async function init(){
    injectTopControls();
    await injectMetaAndProgress();
    enrichSections();
    updateProgress();
    buildSearchResults();
    bindExportsAndShortcuts();
    applyRoleNotes();
    injectSimulation();
  }

  window.DocsEnhance={init};
})();
