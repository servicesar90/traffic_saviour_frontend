function bindBackTop() {
  const btn = document.querySelector('[data-back-top]');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function bindMobileNav() {
  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  if (!topbar.querySelector('.menu-toggle')) {
    const btn = document.createElement('button');
    btn.className = 'menu-toggle';
    btn.type = 'button';
    btn.textContent = 'Menu';
    btn.setAttribute('aria-label', 'Toggle navigation');
    btn.addEventListener('click', () => document.body.classList.toggle('nav-open'));
    topbar.insertBefore(btn, topbar.firstChild);
  }

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && window.innerWidth <= 900) document.body.classList.remove('nav-open');
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) document.body.classList.remove('nav-open');
  });
}

function applyBranding() {
  document.querySelectorAll('.brand').forEach((el) => {
    el.innerHTML = '<a class="brand-link" href="https://trafficsaviour.com" target="_blank" rel="noopener noreferrer"><img src="logo-1.png" alt="TrafficSaviour" class="logo-img" /><span>TrafficSaviour Docs</span></a>';
  });
}

function bindImageZoom() {
  const images = [...document.querySelectorAll('[data-zoomable]')];
  if (!images.length) return;

  let overlay = document.querySelector('.zoom-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'zoom-overlay';
    overlay.innerHTML = '<div class="zoom-content"><button class="zoom-close" type="button">Close</button><img class="zoom-image" alt="Zoomed screenshot" /></div>';
    document.body.appendChild(overlay);
  }

  const zoomImg = overlay.querySelector('.zoom-image');
  const closeBtn = overlay.querySelector('.zoom-close');

  function close() { overlay.classList.remove('open'); }
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

  images.forEach((img) => {
    img.addEventListener('click', () => {
      zoomImg.src = img.currentSrc || img.src;
      overlay.classList.add('open');
    });
  });
}

function bindVideoTools() {
  document.querySelectorAll('[data-video-box]').forEach((box) => {
    const video = box.querySelector('video');
    if (!video) return;

    const playBtn = box.querySelector('[data-v-play]');
    const muteBtn = box.querySelector('[data-v-mute]');
    const fsBtn = box.querySelector('[data-v-full]');
    const zinBtn = box.querySelector('[data-v-zoom-in]');
    const zoutBtn = box.querySelector('[data-v-zoom-out]');
    let zoom = 1;

    playBtn?.addEventListener('click', () => {
      if (video.paused) { video.play(); playBtn.textContent = 'Pause'; }
      else { video.pause(); playBtn.textContent = 'Play'; }
    });

    muteBtn?.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? 'Unmute' : 'Mute';
    });

    fsBtn?.addEventListener('click', async () => {
      if (video.requestFullscreen) await video.requestFullscreen();
    });

    zinBtn?.addEventListener('click', () => {
      zoom = Math.min(2, zoom + 0.1);
      video.style.transform = `scale(${zoom})`;
      video.style.transformOrigin = 'center center';
    });

    zoutBtn?.addEventListener('click', () => {
      zoom = Math.max(1, zoom - 0.1);
      video.style.transform = `scale(${zoom})`;
      video.style.transformOrigin = 'center center';
    });
  });
}

function bootDocs() {
  applyBranding();
  window.DocsNav?.renderSidebar();
  window.DocsNav?.renderPager();
  window.DocsToc?.renderTOC();
  window.DocsToc?.bindCopyLinks();
  window.DocsSearch?.bindSearch();
  bindBackTop();
  bindMobileNav();
  bindImageZoom();
  bindVideoTools();
  window.DocsEnhance?.init();
}
document.addEventListener('DOMContentLoaded', bootDocs);
