/* ============================================================================
   Operator-surfaces shared kit (vanilla JS, plain <script> — global scope).
   Loaded BEFORE each screen's renderer. Provides the Clinical-Premium operator
   shell, labeled-frame showcase, phone chrome, status vocabulary, and small
   chart primitives so every operator surface (E.1–E.10) stays consistent.

   OPERATOR SURFACES ONLY — never patient-facing unless explicitly marked.
   Safety stance shared across all screens:
   • No raw PHI. Patient identifiers, if shown, are opaque tokens — never
     emails or names. Payloads/notes are redacted.
   • Status is always color + icon + text (never color alone).
   • Every surface carries a plain-language "current state" line and a
     "what to do now" runbook callout — never an empty alert.
   ============================================================================ */

const ic = (name) => `<span class="app-icon"><i data-lucide="${name}"></i></span>`;

/* ── Status vocabulary (color + icon + text) ─────────────────────────── */
const statline = (tone, icon, label) => `<span class="statline ${tone}">${ic(icon)}${label}</span>`;

/* ── Small inline trend sparkline (operator-safe, honest line) ───────── */
function sparkline(data, { w = 132, h = 34, tone = 'accent', band = null, area = true } = {}) {
  const max = Math.max(...data, band != null ? band : -Infinity) * 1.12;
  const min = Math.min(...data) * 0.92;
  const n = data.length;
  const X = (i) => (i / (n - 1)) * w;
  const Y = (v) => h - ((v - min) / (max - min || 1)) * h;
  const pts = data.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  const areaPath = `M0,${h} L ${data.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' L ')} L ${w},${h} Z`;
  const bandLine = band != null ? `<line class="spk-band" x1="0" y1="${Y(band).toFixed(1)}" x2="${w}" y2="${Y(band).toFixed(1)}" />` : '';
  return `<svg class="spark ${tone}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-hidden="true">
    ${area ? `<path class="spk-area" d="${areaPath}" />` : ''}
    ${bandLine}
    <polyline class="spk-line" points="${pts}" />
  </svg>`;
}

/* ── Horizontal micro-bar (e.g. budget remaining, agreement rate) ────── */
function microbar(pct, tone = 'accent') {
  return `<div class="microbar"><i class="mb-${tone}" style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;
}

/* ── Section heading inside a dashboard body ─────────────────────────── */
const rsec = (icon, title, { meta = '', opOnly = false, link = '' } = {}) =>
  `<div class="r-sec"><h3>${ic(icon)}${title}${opOnly ? `<span class="op-only">${ic('terminal')}Operator only</span>` : ''}</h3><span class="r-rule"></span>${meta ? `<span class="r-meta">${meta}</span>` : ''}${link ? `<span class="r-link">${link}${ic('chevron-right')}</span>` : ''}</div>`;

/* ── "Current state" hero summary (plain language, required up top) ──── */
function stateHero(tone, icon, title, desc, { meta = [], ts = '' } = {}) {
  return `<div class="state-hero ${tone}">
    <div class="sh-ic">${ic(icon)}</div>
    <div class="sh-main">
      <div class="sh-t">${title}</div>
      <div class="sh-d">${desc}</div>
      ${meta.length ? `<div class="sh-meta">${meta.map(m => `<span>${ic(m[0])}${m[1]}</span>`).join('')}</div>` : ''}
    </div>
    ${ts ? `<div class="sh-ts">${ic('clock')}${ts}</div>` : ''}
  </div>`;
}

/* ── "What to do now" runbook callout (never an empty alert) ─────────── */
function runbook(tone, title, body, link = 'Open runbook') {
  return `<div class="runbook ${tone}">
    <div class="rb-ic">${ic('book-open')}</div>
    <div class="rb-main"><div class="rb-t">${ic('compass')}What to do now</div><div class="rb-h">${title}</div><div class="rb-d">${body}</div></div>
    <button class="btn btn-secondary rb-btn">${ic('external-link')}${link}</button>
  </div>`;
}

/* ── Operator footer note ────────────────────────────────────────────── */
const opsNote = (text) => `<div class="ops-note">${ic('lock')}<span>${text}</span></div>`;

/* ════════════════════════════════════════════════════════════════════════
   DESKTOP APP SHELL
   ════════════════════════════════════════════════════════════════════════ */
function desktopApp(bodyHtml, opts = {}) {
  const {
    nav = [], navActive = '', navExtra = [],
    title = 'Operator', navLabel = 'Operator',
    overlay = '', notif = 0, env = 'eu-central-1', envState = 'green',
    search = 'Search resources, runbooks…',
    user = { initials: 'MH', name: 'M. Halvorsen', role: 'Platform operator' },
  } = opts;
  const navHtml = nav.map(n => `<button class="nav-item ${n.id === navActive ? 'active' : ''}">${ic(n.icon)}${n.label}${n.badge ? `<span class="nav-badge">${n.badge}</span>` : ''}</button>`).join('');
  const extraHtml = navExtra.map(n => `<button class="nav-item">${ic(n.icon)}${n.label}</button>`).join('');
  const led = envState === 'amber' ? 'var(--amber)' : envState === 'red' ? 'var(--red)' : 'var(--green)';
  return `
  <div class="app">
    <aside class="sidebar">
      <div class="brand"><div class="mark"><div class="reticle"></div></div><div class="wm">Skin Lesion <b>XAI</b></div></div>
      <div class="nav-label">${navLabel}</div>
      ${navHtml}
      ${extraHtml ? `<div class="nav-label">Operations</div>${extraHtml}` : ''}
      <div class="sidebar-foot"><div class="sidebar-user"><div class="avatar">${user.initials}</div><div><div class="nm">${user.name}</div><div class="rl">${user.role}</div></div></div></div>
    </aside>
    <div class="main">
      <header class="topbar">
        <h1>${title}</h1>
        <div class="topbar-right">
          <div class="tb-search">${ic('search')}<input placeholder="${search}" /><span class="kbd">⌘K</span></div>
          <div class="tb-meta"><span class="env-pill"><span class="led" style="background:${led}"></span>${env}</span></div>
          <button class="icon-btn" aria-label="Alerts">${ic('bell')}${notif > 0 ? '<span class="dot"></span>' : ''}</button>
          <button class="icon-btn" aria-label="Help">${ic('life-buoy')}</button>
        </div>
      </header>
      <main class="content"><div class="content-inner">${bodyHtml}</div></main>
      ${overlay}
    </div>
  </div>`;
}

/* ── Labeled desktop frame ───────────────────────────────────────────── */
function frame(no, title, desc, deviceHtml, { url = 'ops.skinlesionxai.health' } = {}) {
  return `
  <div class="frame">
    <div class="frame-label"><span class="fl-no">${no}</span><span class="fl-title">${title}</span><span class="fl-desc">${desc}</span></div>
    <div class="device-desktop"><div class="device-bar"><span class="tl"></span><span class="tl"></span><span class="tl"></span><span class="url">${ic('lock')}${url}</span></div><div class="device-viewport">${deviceHtml}</div></div>
  </div>`;
}

/* ── Masthead ────────────────────────────────────────────────────────── */
function masthead({ eyebrow, title, sub, legend = [] }) {
  return `
  <div class="sc-masthead">
    <div>
      <div class="mh-brand">
        <div class="mh-mark"><div class="mh-reticle"></div></div>
        <div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1></div>
      </div>
      <p class="mh-sub">${sub}</p>
    </div>
    ${legend.length ? `<div class="mh-legend">
      <span class="lg-title">${legend[0]}</span>
      ${legend.slice(1).map(r => `<span class="lg-row">${statline(r[0], r[1], r[2])}</span>`).join('')}
    </div>` : ''}
  </div>`;
}

/* ── Section band heads (desktop = A, mobile = B) ────────────────────── */
const sectionHead = (ix, title, meta) =>
  `<div class="sc-section-head"><span class="ix">${ix}</span><h2>${title}</h2><span class="rule"></span><span class="sh-meta">${meta}</span></div>`;

/* ════════════════════════════════════════════════════════════════════════
   MOBILE PHONE CHROME
   ════════════════════════════════════════════════════════════════════════ */
function mStatusBar() {
  return `<div class="m-status"><span>9:18</span><span class="ms-r">${ic('signal')}${ic('wifi')}${ic('battery-full')}</span></div>`;
}
function mAppbar(title, { eyebrow = 'Operator', back = false, notif = 0, env = 'eu-central-1', envState = 'green' } = {}) {
  const led = envState === 'amber' ? 'var(--amber)' : envState === 'red' ? 'var(--red)' : 'var(--green)';
  return `<div class="m-appbar">
    <button class="m-iconbtn" aria-label="${back ? 'Back' : 'Menu'}">${ic(back ? 'chevron-left' : 'menu')}</button>
    <div class="m-title"><div class="mt-eyebrow">${eyebrow}</div><div class="mt-h">${title}</div></div>
    <span class="env-pill"><span class="led" style="background:${led}"></span>${env}</span>
    <button class="m-iconbtn" aria-label="Alerts">${ic('bell')}${notif > 0 ? '<span class="dot"></span>' : ''}</button>
  </div>`;
}
function mTabbar(tabs, active) {
  return `<nav class="m-tabbar">${tabs.map(t => `<button class="m-tab ${t.id === active ? 'on' : ''}">${ic(t.icon)}<span class="tl">${t.label}</span>${t.badge && t.id !== active ? `<span class="badge">${t.badge}</span>` : ''}</button>`).join('')}</nav>`;
}
function mPhone(bodyHtml, opts = {}) {
  const { title = 'Overview', eyebrow = 'Operator', tabs = [], active = '', overlay = '', notif = 0, env = 'eu-central-1', envState = 'green', back = false } = opts;
  return `<div class="device-phone"><div class="m-notch"></div><div class="phone-viewport">
    ${mStatusBar()}
    ${mAppbar(title, { eyebrow, notif, env, envState, back })}
    <div class="m-body">${bodyHtml}</div>
    ${tabs.length ? mTabbar(tabs, active) : ''}
    ${overlay}
  </div></div>`;
}
function mframe(no, title, desc, phoneHtml) {
  return `<div class="frame">
    <div class="frame-label"><span class="fl-no">${no}</span><span class="fl-title">${title}</span><span class="fl-desc">${desc}</span></div>
    ${phoneHtml}
  </div>`;
}
const mSecHead = (icon, title, { opOnly = false, more = '' } = {}) =>
  `<div class="m-sec"><h3>${ic(icon)}${title}${opOnly ? `<span class="admin-only">${ic('terminal')}Operator</span>` : ''}</h3><span class="rule"></span>${more ? `<span class="more">${more}</span>` : ''}</div>`;

/* ── Overlaid histogram (training vs production distribution) ────────── */
function histogram(train, prod, { tone = 'amber', h = 64 } = {}) {
  const max = Math.max(...train, ...prod) || 1;
  const bins = train.map((t, i) => {
    const th = (t / max) * h, ph = (prod[i] / max) * h;
    return `<div class="hbin"><div class="hb train" style="height:${th.toFixed(1)}px"></div><div class="hb prod ${tone}" style="height:${ph.toFixed(1)}px"></div></div>`;
  }).join('');
  return `<div class="histo" style="height:${h}px">${bins}</div>`;
}

/* ── Simple labelled line chart (trend over time, optional band) ─────── */
function linechart(series, { w = 460, h = 150, band = null, bandLabel = '', tone = 'accent', xticks = [], dot = true } = {}) {
  const flat = series.flatMap(s => s.data);
  const max = Math.max(...flat, band != null ? band : -Infinity) * 1.12;
  const min = Math.min(...flat, band != null ? band : Infinity) * 0.9;
  const padB = xticks.length ? 20 : 6, padT = 8, padR = 8, padL = 6;
  const n = series[0].data.length;
  const X = (i) => padL + (i / (n - 1)) * (w - padL - padR);
  const Y = (v) => padT + (1 - (v - min) / (max - min || 1)) * (h - padT - padB);
  const grids = [0, 0.5, 1].map(f => { const yy = padT + f * (h - padT - padB); return `<line class="lc-grid" x1="${padL}" y1="${yy.toFixed(1)}" x2="${w - padR}" y2="${yy.toFixed(1)}" />`; }).join('');
  const lines = series.map(s => {
    const pts = s.data.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    const last = s.data.length - 1;
    return `<polyline class="lc-line ${s.tone || tone} ${s.dash ? 'dash' : ''}" points="${pts}" />${dot && !s.dash ? `<circle class="lc-dot ${s.tone || tone}" cx="${X(last).toFixed(1)}" cy="${Y(s.data[last]).toFixed(1)}" r="3" />` : ''}`;
  }).join('');
  const bandLine = band != null ? `<line class="lc-band" x1="${padL}" y1="${Y(band).toFixed(1)}" x2="${w - padR}" y2="${Y(band).toFixed(1)}" /><text class="lc-bandlab" x="${w - padR}" y="${(Y(band) - 4).toFixed(1)}" text-anchor="end">${bandLabel}</text>` : '';
  const ticks = xticks.map((t, k) => { const i = Math.round(k * (n - 1) / (xticks.length - 1)); return `<text class="lc-tick" x="${X(i).toFixed(1)}" y="${h - 5}" text-anchor="${k === 0 ? 'start' : k === xticks.length - 1 ? 'end' : 'middle'}">${t}</text>`; }).join('');
  return `<svg class="linechart" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-hidden="true">${grids}${bandLine}${lines}${ticks}</svg>`;
}

/* ── Reliability diagram (predicted prob vs empirical positive rate) ─── */
function reliability(curve, { w = 300, h = 300, kind = 'good' } = {}) {
  const pad = 28;
  const X = (v) => pad + v * (w - pad * 2);
  const Y = (v) => (h - pad) - v * (h - pad * 2);
  const diag = `<line class="rl-diag" x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" />`;
  const pts = curve.map((p) => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(' ');
  const dots = curve.map((p) => `<circle class="rl-dot ${kind}" cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3.2" />`).join('');
  const grid = [0, 0.25, 0.5, 0.75, 1].map(f => `<line class="rl-grid" x1="${X(f)}" y1="${pad}" x2="${X(f)}" y2="${h - pad}" /><line class="rl-grid" x1="${pad}" y1="${Y(f)}" x2="${w - pad}" y2="${Y(f)}" />`).join('');
  const xlab = [0, 0.5, 1].map(f => `<text class="rl-lab" x="${X(f)}" y="${h - pad + 15}" text-anchor="middle">${f}</text>`).join('');
  const ylab = [0, 0.5, 1].map(f => `<text class="rl-lab" x="${pad - 8}" y="${Y(f) + 3}" text-anchor="end">${f}</text>`).join('');
  return `<svg class="reldiag" viewBox="0 0 ${w} ${h}" role="img" aria-hidden="true">${grid}${diag}${xlab}${ylab}<polyline class="rl-curve ${kind}" points="${pts}" />${dots}<text class="rl-axis" x="${w / 2}" y="${h - 4}" text-anchor="middle">predicted probability</text></svg>`;
}

/* ── Mount helper: render masthead + desktop + mobile into #sc-wrap ───── */
function mountShowcase(parts) {
  document.getElementById('sc-wrap').innerHTML = parts.join('');
  lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
}
