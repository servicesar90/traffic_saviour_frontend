function bindSearch() {
  const input = document.querySelector('[data-search]');
  if (!input) return;
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const q = input.value.trim().toLowerCase();
    if (!q) return;
    const all = [...document.querySelectorAll('h1, h2, h3, p, li, td')];
    const found = all.find((el) => el.textContent.toLowerCase().includes(q));
    if (found) found.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}
window.DocsSearch = { bindSearch };
