const navItems = [
  ['index.html', 'Docs Home', 'home'],
  ['getting-started.html', 'Getting Started', 'rocket'],
  ['dashboard-overview.html', 'Dashboard Overview', 'layout'],
  ['campaign-management.html', 'Campaign Management', 'target'],
  ['analytics-reports.html', 'Analytics & Reports', 'chart'],
  ['tools-guide.html', 'Tools Guide', 'tool'],
  ['ip-management.html', 'IP Management', 'shield'],
  ['billing-subscription.html', 'Billing & Subscription', 'wallet'],
  ['campaign-integration.html', 'Campaign Integration', 'link'],
  ['terminology-glossary.html', 'Terminology Glossary', 'book'],
  ['troubleshooting-faq.html', 'Troubleshooting & FAQ', 'life'],
  ['changelog.html', 'Docs Changelog', 'book'],
  ['governance-policy.html', 'Governance Policy', 'shield']
];

const icons = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10.5V20h14v-9.5"/><path d="M10 20v-5h4v5"/></svg>',
  rocket: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19c1.5-2.5 4-4 7-4"/><path d="M14 10 9 15"/><path d="M15 3c4 .5 6 2.5 6 6-4 0-6-2-6-6Z"/><path d="M8 16 5 19"/></svg>',
  layout: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="M9 10h12"/></svg>',
  target: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3"/><path d="M22 12h-3"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16"/><rect x="6" y="11" width="3" height="6"/><rect x="11" y="8" width="3" height="9"/><rect x="16" y="5" width="3" height="12"/></svg>',
  tool: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 7 3-3 3 3-3 3Z"/><path d="m13 8-9 9 3 3 9-9"/><path d="m2 22 3-3"/></svg>',
  shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z"/><path d="m9.5 12 2 2 3-3"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M16 12h5"/><circle cx="16" cy="12" r="1"/></svg>',
  link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14 7 17a3 3 0 1 1-4-4l3-3"/><path d="m14 10 3-3a3 3 0 1 1 4 4l-3 3"/><path d="M8 16 16 8"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 0-2 2z"/><path d="M6 3v18"/><path d="M10 7h6"/></svg>',
  life: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/></svg>'
};

function renderSidebar() {
  const sb = document.querySelector('[data-sidebar]');
  if (!sb) return;
  const current = location.pathname.split('/').pop() || 'index.html';
  sb.innerHTML = navItems.map(([href, label, icon]) =>
    `<a href="${href}" class="${current === href ? 'active' : ''}"><span class="nav-icon">${icons[icon] || icons.home}</span><span class="nav-text">${label}</span></a>`
  ).join('');
}

function renderPager() {
  const slot = document.querySelector('[data-pager]');
  if (!slot) return;
  const current = location.pathname.split('/').pop() || 'index.html';
  const idx = navItems.findIndex((x) => x[0] === current);
  const prev = navItems[idx - 1];
  const next = navItems[idx + 1];
  slot.innerHTML = `${prev ? `<a href="${prev[0]}">Prev: ${prev[1]}</a>` : '<span></span>'}${next ? `<a href="${next[0]}">Next: ${next[1]}</a>` : ''}`;
}

window.DocsNav = { renderSidebar, renderPager };


