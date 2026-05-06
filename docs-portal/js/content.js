(function(){
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const pageIntro = {
    'index.html': 'TrafficSaviour is a cloaking and traffic control platform designed for performance marketers, affiliate operators, and agencies that need controlled routing between money pages and safe pages with measurable quality signals.',
    'getting-started.html': 'This platform is primarily for teams running paid traffic where policy-safe review paths and revenue-optimized user paths must be separated through rule-based routing.',
    'campaign-management.html': 'Campaign management in TrafficSaviour is the operational center of a cloaker workflow: define who should see revenue pages, who should see safe pages, and how those decisions are automated at scale.',
    'campaign-integration.html': 'Integration in TrafficSaviour ensures a cloaker campaign keeps identity continuity (click_id/sub_id) from ad click to conversion so optimization decisions remain reliable.',
    'tools-guide.html': 'The tools in TrafficSaviour exist to validate cloaker behavior before budget scale by checking redirects, bot treatment, IP risk, and URL integrity.',
    'analytics-reports.html': 'Analytics in a cloaker stack must be interpreted with segmentation in mind so bot, reviewer, and user paths are not mixed into one misleading number.',
    'ip-management.html': 'IP management is critical in cloaker operations where trust scoring and allow/block policy directly affect route quality and compliance safety.',
    'billing-subscription.html': 'Billing defines feature and guard access; cloaker workflows should always verify active plan gates before launch windows.',
    'dashboard-overview.html': 'Dashboard overview helps each role understand where cloaker routing, campaign control, and quality tools live in day-to-day operations.',
    'troubleshooting-faq.html': 'Troubleshooting focuses on practical cloaker incidents: lost click_id, rule conflicts, route mismatch, and conversion attribution drift.',
    'terminology-glossary.html': 'Glossary terms are written for mixed teams so marketers, ops, and QA use one shared language while working on cloaker campaigns.'
  };

  function addSectionDepth(section) {
    const box = document.createElement('div');
    box.className = 'callout info';
    box.innerHTML = '<strong>Operational Context:</strong> In production, document owner, last review date, and expected output for this section. This reduces misconfiguration risk during handoffs and keeps campaign QA reproducible across team members.';
    section.appendChild(box);

    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'Recommended practice: map each setting here to one measurable outcome in reports (quality, conversion rate, routing accuracy, or compliance safety). If a setting has no measurable outcome, avoid enabling it by default.';
    section.appendChild(p);
  }

  function expand() {
    const intro = document.querySelector('.page-intro');
    if (intro && pageIntro[page]) {
      const p = document.createElement('p');
      p.className = 'page-intro';
      p.textContent = pageIntro[page];
      intro.insertAdjacentElement('afterend', p);
    }

    document.querySelectorAll('.section').forEach((sec) => addSectionDepth(sec));

    if (page === 'index.html') {
      const main = document.querySelector('.content');
      if (main && !document.getElementById('cloaker-purpose')) {
        const s = document.createElement('section');
        s.className = 'section';
        s.id = 'cloaker-purpose';
        s.innerHTML = '<h2>TrafficSaviour as a Cloaker Tool</h2><p>TrafficSaviour helps separate traffic flows by intent and risk. Legitimate, qualified users can be routed toward money pages while policy-review or suspicious patterns can be routed toward safe pages according to configured rules.</p><h3>Who Uses It</h3><ul><li>Affiliate marketers optimizing paid traffic quality</li><li>Media buying teams managing multi-geo offers</li><li>Agencies handling high-volume campaign operations</li><li>QA and compliance teams validating route behavior</li></ul><h3>What It Actually Does</h3><ul><li>Creates rule-based decision paths for incoming clicks</li><li>Applies conditions and filters before destination routing</li><li>Provides operational tools to verify redirect and bot behavior</li><li>Keeps tracking continuity for optimization and reporting</li></ul>';
        const target = main.querySelector('.section');
        if (target) main.insertBefore(s, target.nextSibling);
      }
    }
  }

  window.DocsContent = { expand };
})();
