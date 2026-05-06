function renderTOC() {
  const toc = document.querySelector('[data-toc]');
  if (!toc) return;
  const heads = [...document.querySelectorAll('h2, h3')];
  toc.innerHTML = '<h3>On This Page</h3>' + heads.map((h) => {
    if (!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `<a href="#${h.id}">${h.tagName === 'H3' ? ' - ' : ''}${h.textContent}</a>`;
  }).join('');
}

function bindCopyLinks() {
  document.querySelectorAll('h2, h3').forEach((h) => {
    if (!h.id) return;
    const btn = document.createElement('button');
    btn.className = 'copy-link';
    btn.textContent = 'Copy link';
    btn.addEventListener('click', async () => {
      const url = `${location.origin}${location.pathname}#${h.id}`;
      await navigator.clipboard.writeText(url);
      btn.textContent = 'Copied';
      setTimeout(() => (btn.textContent = 'Copy link'), 1200);
    });
    h.appendChild(btn);
  });
}

window.DocsToc = { renderTOC, bindCopyLinks };
