# Copy-Paste HTML/CSS/JS UI Snippets (Static)

## Shared CSS Tokens
```css
:root {
  --font-sans: "Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --bg-app: #F5F7FA;
  --bg-surface: #FFFFFF;
  --text-primary: #141824;
  --text-secondary: #52607a;
  --text-muted: #64748b;
  --border-app: #CBD0DD;
  --border-default: #d5d9e4;
  --primary: #3c79ff;
  --primary-hover: #356ee6;
  --success-bg: #ecfdf3;
  --success-text: #027a48;
  --success-border: #abefc6;
  --warning-bg: #fff8eb;
  --warning-text: #b54708;
  --warning-border: #fedf89;
  --danger-bg: #fef3f2;
  --danger-text: #b42318;
  --danger-border: #fecdca;
}
* { box-sizing: border-box; }
body { margin: 0; font-family: var(--font-sans); background: var(--bg-app); color: var(--text-primary); }
.btn-primary { height: 42px; padding: 0 16px; border-radius: 6px; border: 1px solid var(--primary); background: var(--primary); color: #fff; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-primary:hover { background: var(--primary-hover); }
.btn-secondary { height: 42px; padding: 0 16px; border-radius: 6px; border: 1px solid var(--border-default); background: #fff; color: #344054; font-size: 13px; font-weight: 600; cursor: pointer; }
.btn-secondary:hover { background: #f9fafb; }
.input { height: 42px; width: 100%; border: 1px solid var(--border-default); border-radius: 6px; padding: 0 14px; color: var(--text-primary); background: #fff; }
.input:focus { outline: none; border-color: var(--primary); box-shadow: inset 0 0 0 1px var(--primary); }
```

## 1) Header Snippet
```html
<header class="ui-header">
  <button class="menu-btn" aria-label="Toggle sidebar">☰</button>
  <div class="brand">TrafficSaviour</div>
  <div class="header-right">
    <span class="plan-pill"><span class="dot"></span> Starter | Active</span>
    <button class="avatar">TS</button>
  </div>
</header>
```

```css
.ui-header { height: 72px; display:flex; align-items:center; justify-content:space-between; padding:0 24px; background:rgba(255,255,255,.9); border-bottom:1px solid #e2e8f0; box-shadow:0 6px 20px rgba(15,23,42,.06); }
.menu-btn { width:36px; height:36px; border:none; border-radius:8px; background:transparent; cursor:pointer; }
.menu-btn:hover { background:#f1f5f9; }
.brand { font-size:20px; font-weight:700; color:#0f172a; }
.header-right { display:flex; gap:12px; align-items:center; }
.plan-pill { font-size:12px; border:1px solid #e2e8f0; border-radius:999px; padding:6px 10px; color:#64748b; background:#fff; }
.dot { width:8px; height:8px; border-radius:999px; background:#22c55e; display:inline-block; margin-right:6px; }
.avatar { width:40px; height:40px; border-radius:999px; border:2px solid #94a3b8; background:#fff; font-weight:700; cursor:pointer; }
```

## 2) Sidebar Snippet
```html
<aside class="ui-sidebar" id="sidebar">
  <button class="side-item active">Dashboard</button>
  <button class="side-item">Campaigns</button>
  <button class="side-item">Traffic Logs</button>
  <button class="side-item">Statistics</button>
</aside>
```

```css
.ui-sidebar { width:256px; background:#fff; border-right:1px solid #e2e8f0; padding:12px; transition:width .5s ease; overflow:hidden; }
.ui-sidebar.collapsed { width:64px; }
.side-item { width:100%; margin:0 0 4px; padding:5.6px 16px; text-align:left; border:none; border-radius:999px; background:transparent; color:#525b75; font-size:12.8px; cursor:pointer; }
.side-item:hover { background:#f2f4f7; }
.side-item.active { color:#3874ff; }
```

## 3) Card Snippet
```html
<section class="ui-card">
  <p class="card-label">Total Clicks</p>
  <p class="card-value">12,450</p>
  <span class="chip success">Live</span>
</section>
```

```css
.ui-card { background:#fff; border:1px solid var(--border-default); border-radius:8px; padding:20px; }
.card-label { margin:0; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:.08em; color:#64748b; }
.card-value { margin:8px 0 0; font-size:32px; line-height:1; font-weight:800; color:#0f172a; }
.chip { display:inline-flex; margin-top:10px; padding:4px 10px; border-radius:999px; font-size:11px; font-weight:700; border:1px solid transparent; }
.chip.success { background:var(--success-bg); color:var(--success-text); border-color:var(--success-border); }
```

## 4) Table Snippet
```html
<div class="table-wrap custom-scrollbar">
  <table class="ui-table">
    <thead>
      <tr><th>#</th><th>Campaign</th><th>Status</th><th>Clicks</th></tr>
    </thead>
    <tbody>
      <tr><td>1</td><td>Summer Boost</td><td><span class="chip success">Active</span></td><td>842</td></tr>
      <tr><td>2</td><td>EU Traffic</td><td><span class="chip" style="background:var(--warning-bg);color:var(--warning-text);border-color:var(--warning-border)">Pending</span></td><td>390</td></tr>
    </tbody>
  </table>
</div>
```

```css
.table-wrap { overflow:auto; max-height:360px; border:1px solid var(--border-default); border-radius:8px; background:#fff; }
.ui-table { width:100%; min-width:680px; border-collapse:collapse; }
.ui-table thead th { position:sticky; top:0; background:#f8fafc; padding:12px 16px; text-align:left; font-size:12px; font-weight:800; text-transform:uppercase; color:#334155; border-bottom:1px solid var(--border-default); }
.ui-table tbody td { padding:12px 16px; font-size:13px; color:#334155; border-top:1px solid #eef2f6; }
.ui-table tbody tr:hover td { background:#f8fbff; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color:#cbd5e1 #f1f5f9; }
.custom-scrollbar::-webkit-scrollbar { width:8px; height:8px; }
.custom-scrollbar::-webkit-scrollbar-track { background:#f1f5f9; border-radius:999px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:999px; border:2px solid #f1f5f9; }
```

## 5) Form Snippet
```html
<form class="ui-form">
  <label class="label">Campaign Name</label>
  <input class="input" placeholder="Enter campaign name" />

  <label class="label">Destination URL</label>
  <input class="input" placeholder="https://example.com" />

  <div class="actions">
    <button type="button" class="btn-secondary">Reset</button>
    <button type="submit" class="btn-primary">Save</button>
  </div>
</form>
```

```css
.ui-form { background:#fff; border:1px solid var(--border-default); border-radius:8px; padding:20px; display:grid; gap:10px; }
.label { font-size:11px; text-transform:uppercase; letter-spacing:.08em; font-weight:800; color:#52607a; }
.actions { display:flex; gap:10px; margin-top:8px; }
```

## 6) Tooltip Snippet
```html
<div class="tooltip-wrap">
  <button class="btn-secondary">Hover me</button>
  <span class="tooltip">Enter full URL including https://</span>
</div>
```

```css
.tooltip-wrap { position:relative; display:inline-flex; }
.tooltip { position:absolute; left:50%; top:110%; transform:translateX(-50%); background:#111827; color:#fff; font-size:11px; font-weight:500; padding:6px 10px; border-radius:6px; white-space:nowrap; opacity:0; pointer-events:none; transition:opacity .15s ease; z-index:100; }
.tooltip-wrap:hover .tooltip { opacity:1; }
```

## 7) Modal Snippet
```html
<div class="modal-overlay" id="modal" hidden>
  <div class="modal-card">
    <h2 class="modal-title">Active Plan Needed</h2>
    <p class="modal-sub">Upgrade your subscription to unlock full dashboard access.</p>
    <div class="modal-actions">
      <button class="btn-secondary" data-close>Cancel</button>
      <button class="btn-primary">View Plans</button>
    </div>
  </div>
</div>
```

```css
.modal-overlay { position:fixed; inset:0; background:rgba(15,23,42,.45); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:50; }
.modal-card { width:min(640px,92vw); border:1px solid var(--border-default); border-radius:12px; background:#fff; padding:24px; box-shadow:0 24px 60px rgba(15,23,42,.25); }
.modal-title { margin:0; font-size:24px; font-weight:800; color:#141824; }
.modal-sub { margin:8px 0 0; font-size:14px; color:#64748b; }
.modal-actions { margin-top:16px; display:flex; gap:10px; justify-content:flex-end; }
```

## 8) Loader Snippet
```html
<div class="loader-wrap">
  <div class="loader-orb"></div>
  <img src="/logo-1.png" alt="TrafficSaviour" class="loader-logo" />
  <h2 class="loader-title">TrafficSaviour</h2>
  <p class="loader-text">Loading your dashboard...</p>
</div>
```

```css
.loader-wrap { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#f5f7fb; }
.loader-orb { position:absolute; width:96px; height:96px; border-radius:16px; background:#e9f0ff; filter:blur(8px); animation:pulse 1.2s ease-in-out infinite; }
.loader-logo { width:80px; height:80px; position:relative; border-radius:12px; object-fit:contain; filter:drop-shadow(0 8px 18px rgba(60,121,255,.35)); animation:floatY 2.2s ease-in-out infinite; }
.loader-title { margin:12px 0 0; font-size:22px; font-weight:800; color:#0f172a; }
.loader-text { margin:10px 0 0; font-size:14px; font-weight:600; color:#334155; }
@keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-6px);} }
@keyframes pulse { 0%,100% { opacity:.8; } 50% { opacity:.4; } }
```

## 9) Minimal JS for Sidebar + Modal
```js
const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('modal');

function toggleSidebar() {
  sidebar?.classList.toggle('collapsed');
}

function openModal() {
  if (modal) modal.hidden = false;
}

function closeModal() {
  if (modal) modal.hidden = true;
}

document.querySelectorAll('[data-close]').forEach((el) => {
  el.addEventListener('click', closeModal);
});
```

## Guardrails
- UI-only changes.
- No API, logic, routing, data, or variable-name changes.

## React to HTML/CSS/JS Migration Checklist (Behavior Parity)
- [ ] Lock baseline: capture current React UI screenshots/videos for desktop + mobile + key states (loading, empty, success, error, modal open).
- [ ] Freeze behavior scope: no feature add/remove, no route changes, no API contract changes, no analytics/event-name changes.
- [ ] Inventory pages/components to migrate in order (shared layout, then page-level components, then edge states).
- [ ] Map React components to HTML partials/sections with same visible hierarchy and text content.
- [ ] Preserve all user flows exactly: clicks, form submit/reset, dropdown open/close, modal open/close, sidebar collapse/expand.
- [ ] Keep CSS tokens identical (`colors`, `spacing`, `radius`, `font sizes`, `z-index`, `shadows`, `transitions`) using the same variables where possible.
- [ ] Maintain responsive breakpoints and mobile drawer behavior exactly as current implementation.
- [ ] Recreate JS state transitions with explicit DOM state (`classList`, `hidden`, `aria-*`, `data-*`) matching React behavior.
- [ ] Keep validation behavior same: required fields, error timing, error messages, disabled states, loading states.
- [ ] Preserve keyboard and accessibility behavior: tab order, focus ring visibility, escape-to-close modal, ARIA labels.
- [ ] Keep table behavior same: sticky headers, scroll area, row hover, status chips, and pagination/sorting UX if present.
- [ ] Match feedback UX: toast/alerts, inline messages, spinner/loader timing and placement.
- [ ] Do not rename IDs/classes/events relied upon by existing scripts, tests, or tracking.
- [ ] Verify browser parity (Chrome/Edge/Firefox) and mobile widths used by current users.
- [ ] Run visual diff pass against baseline screenshots and fix spacing/typography/interaction drift.
- [ ] Run interaction QA script for every critical page before sign-off.
- [ ] Confirm no console errors and no uncaught promise/runtime JS errors in migrated pages.
- [ ] Update documentation with mapping notes (`React component -> HTML/CSS/JS file`) for maintainability.
