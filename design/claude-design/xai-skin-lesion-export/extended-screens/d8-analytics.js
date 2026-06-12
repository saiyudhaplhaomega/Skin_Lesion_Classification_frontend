/* ============================================================================
   D.8 — Embedded Power BI analytics shell (internal, admin/research/ops).
   A native app shell with role-aware tabs wrapping a clearly-framed embedded
   report, an audit banner, and visible RLS. NOT the patient dashboard. No PHI:
   analytics-safe labels only — pseudonymous IDs, counts, trends, status, body
   region, model/dataset version, consent status, quality score. After kit.js.
   ============================================================================ */

const NAV = [
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart-3' },
  { id: 'users', label: 'User management', icon: 'users' },
  { id: 'audit', label: 'Audit log', icon: 'scroll-text' },
  { id: 'flags', label: 'Feature flags', icon: 'toggle-right' },
  { id: 'health', label: 'System health', icon: 'activity' },
];
const NAV_EXTRA = [{ id: 'runbooks', label: 'Runbooks', icon: 'book-open' }, { id: 'access', label: 'Access & roles', icon: 'shield' }];
const USER = { initials: 'LA', name: 'L. Adesina', role: 'Administrator · analytics' };

const TABS = [
  ['overview', 'layout-dashboard', 'Overview', true],
  ['ai', 'scan-line', 'AI Analysis', true],
  ['perf', 'gauge', 'Model Performance', true],
  ['quality', 'image', 'Image Quality', true],
  ['reviews', 'stethoscope', 'Doctor Reviews', true],
  ['location', 'map-pin', 'Body Location', true],
  ['consent', 'shield-check', 'Consent & Privacy', true],
  ['labs', 'file-text', 'Lab Results', false],
  ['dataset', 'database', 'Research Dataset', true],
  ['ops', 'server', 'Operations', true],
];

function auditBanner() {
  return `<div class="audit-banner">${ic('shield-check')}<span>Access governed by <b>row-level security</b> — this view shows analytics-safe data only.</span><span class="ab-sep">·</span><span>No patient names, emails, image URLs, or notes are present.</span><span class="ab-right">${ic('eye')}viewed as <b style="color:#fff">Administrator</b> · logged 09:18 UTC</span></div>`;
}
function reportTabs(active) {
  return `<div class="report-tabs">${TABS.map(([id, icn, lab, allowed]) => `<button class="report-tab ${id === active ? 'on' : ''}">${ic(icn)}${lab}${!allowed ? `<span class="rt-lock">${ic('lock')}</span>` : ''}</button>`).join('')}</div>`;
}
function embedChrome(rls = true) {
  return `<div class="embed-chrome"><span class="ec-pbi"><span class="pbi-mark">BI</span>Power BI · embedded report</span>${rls ? `<span class="ec-rls">${ic('shield')}RLS active · role: Administrator</span>` : ''}<span class="ec-refresh" style="margin-left:${rls ? '12px' : 'auto'}">data refreshed 09:00 UTC</span></div>`;
}

/* ── Report content (analytics-safe visuals) ─────────────────────────── */
function overviewReport() {
  return `
  <div class="report-kpis">
    <div class="report-kpi"><div class="rk-l">Analyses · 30d</div><div class="rk-v">48,210</div><div class="rk-d">${statline('green', 'trending-up', '+6.4% vs prior 30d')}</div></div>
    <div class="report-kpi"><div class="rk-l">Cases to review</div><div class="rk-v">312</div><div class="rk-d">${statline('amber', 'clock', '41 over SLA')}</div></div>
    <div class="report-kpi"><div class="rk-l">Avg image quality</div><div class="rk-v">0.87</div><div class="rk-d">${statline('green', 'check-circle', 'good band')}</div></div>
    <div class="report-kpi"><div class="rk-l">Research opt-in</div><div class="rk-v">61<small style="font-size:13px;color:var(--text-muted)">%</small></div><div class="rk-d">${statline('blue', 'shield-check', 'de-identified')}</div></div>
  </div>
  <div class="report-grid">
    <div class="viz-card"><div class="vc-head"><span class="vc-t">Analyses by triage band · weekly</span><span class="vc-sub">pseudonymous counts</span></div>
      <div class="bars">${[['W1', 62, 'green'], ['W2', 70, 'green'], ['W3', 48, 'amber'], ['W4', 80, 'green'], ['W5', 58, 'amber'], ['W6', 90, 'green'], ['W7', 76, 'green']].map(([l, h, t]) => `<div class="bar-col"><div class="bc-bar ${t}" style="height:${h}%"></div><span class="bc-l">${l}</span></div>`).join('')}</div>
    </div>
    <div class="viz-card"><div class="vc-head"><span class="vc-t">Triage mix</span><span class="vc-sub">status only</span></div>
      <div class="donut-wrap">${donut([['var(--green)', 58], ['var(--amber)', 27], ['var(--accent)', 15]])}<div class="donut-legend">
        <div class="dl-row"><span class="sw" style="background:var(--green)"></span>Benign-band<span class="dl-v">58%</span></div>
        <div class="dl-row"><span class="sw" style="background:var(--amber)"></span>Monitor-band<span class="dl-v">27%</span></div>
        <div class="dl-row"><span class="sw" style="background:var(--accent)"></span>Review-band<span class="dl-v">15%</span></div>
      </div></div>
    </div>
  </div>`;
}
function donut(segs) {
  let acc = 0; const r = 52, c = 2 * Math.PI * r;
  const rings = segs.map(([col, pct]) => { const len = (pct / 100) * c; const dash = `${len} ${c - len}`; const off = -acc / 100 * c; acc += pct; return `<circle cx="64" cy="64" r="${r}" fill="none" stroke="${col}" stroke-width="22" stroke-dasharray="${dash}" stroke-dashoffset="${off}" transform="rotate(-90 64 64)" />`; }).join('');
  return `<svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">${rings}<circle cx="64" cy="64" r="30" fill="var(--surface-card)" /></svg>`;
}

function body(kind) {
  if (kind === 'loading') return `${auditBanner()}${reportTabs('overview')}<div class="embed-frame">${embedChrome(true)}<div class="embed-body"><div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:420px;gap:14px"><span class="spinner" style="width:26px;height:26px;border-width:3px"></span><div style="text-align:center"><div style="font:600 14px var(--font-sans);color:var(--text-primary)">Loading embed token…</div><div style="font:400 12.5px var(--font-sans);color:var(--text-muted);margin-top:5px">Requesting a scoped, time-limited report token for your role</div></div></div></div></div>`;
  if (kind === 'denied') return `${auditBanner()}${reportTabs('labs')}<div class="embed-frame"><div class="embed-body"><div class="state-box"><div class="sb-ic red">${ic('lock')}</div><h4>You don't have access to Lab Results analytics</h4><p>This report tab is restricted to clinical-operations roles. Your administrator role doesn't include lab-review analytics. The attempt has been recorded to the audit log.</p><div class="sb-act"><button class="btn btn-secondary">${ic('shield')}Request access</button><button class="btn btn-ghost">${ic('arrow-left')}Back to Overview</button></div></div></div></div>`;
  if (kind === 'expired') return `${auditBanner()}${reportTabs('overview')}<div class="embed-frame">${embedChrome(true)}<div class="embed-body"><div class="state-box"><div class="sb-ic accent">${ic('clock')}</div><h4>Embed token expired</h4><p>For security, the report token is short-lived and has timed out. Refresh to request a new scoped token — your filters are preserved.</p><div class="sb-act"><button class="btn btn-primary">${ic('refresh-cw')}Refresh token</button></div></div></div></div>`;
  if (kind === 'unavailable') return `${auditBanner()}${reportTabs('perf')}<div class="embed-frame">${embedChrome(true)}<div class="embed-body"><div class="state-box"><div class="sb-ic" style="background:var(--neutral-bg);color:var(--neutral)">${ic('cloud-off')}</div><h4>This report is temporarily unavailable</h4><p>The Model Performance report couldn't be reached. This doesn't affect the live model — only the analytics view. Try again shortly.</p><div class="sb-act"><button class="btn btn-secondary">${ic('refresh-cw')}Retry</button></div></div></div></div>`;
  return `${auditBanner()}${reportTabs('overview')}<div class="embed-frame">${embedChrome(true)}<div class="embed-body">${overviewReport()}</div></div>
  <div class="ops-note" style="margin-top:var(--sp-md)">${ic('lock')}<span><b>Internal analytics — not the patient dashboard.</b> Row-level security scopes every row to your role. No patient names, emails, raw image or lab-file URLs, or free-text notes are present — only pseudonymous IDs, counts, trends, status, body region, and model/dataset versions.</span></div>`;
}
function bodySkeleton() {
  return `${auditBanner()}${reportTabs('overview')}<div class="embed-frame">${embedChrome(true)}<div class="embed-body"><div class="report-kpis">${[0, 0, 0, 0].map(() => `<div class="report-kpi"><div class="skel skel-line" style="width:60%"></div><div class="skel" style="width:50%;height:24px;margin:9px 0 6px"></div><div class="skel skel-line" style="width:70%"></div></div>`).join('')}</div><div class="report-grid"><div class="viz-card"><div class="skel skel-line" style="width:40%"></div><div class="skel" style="width:100%;height:150px;margin-top:14px;border-radius:6px"></div></div><div class="viz-card"><div class="skel skel-line" style="width:40%"></div><div class="skel" style="width:100%;height:150px;margin-top:14px;border-radius:6px"></div></div></div></div></div>`;
}

/* ════════════════════════════ MOBILE ════════════════════════════ */
const M_TABS = [{ id: 'analytics', label: 'Analytics', icon: 'bar-chart-3' }, { id: 'audit', label: 'Audit', icon: 'scroll-text' }, { id: 'health', label: 'Health', icon: 'activity' }, { id: 'account', label: 'Account', icon: 'user' }];
function mAudit() { return `<div class="audit-banner" style="font-size:10.5px">${ic('shield-check')}<span>RLS active · analytics-safe data only · <b>no PHI</b></span></div>`; }
function mReportTabs(active) {
  return `<div class="m-chips">${TABS.slice(0, 6).map(([id, icn, lab, al]) => `<span class="m-fchip ${id === active ? 'on' : ''}">${lab}${!al ? ' 🔒'.replace('🔒', '') : ''}</span>`).join('')}</div>`;
}
function mBody(kind) {
  if (kind === 'loading') return `${mAudit()}${mReportTabs('overview')}<div class="m-card"><div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:280px;gap:12px"><span class="spinner" style="width:22px;height:22px;border-width:3px"></span><div style="font:600 13px var(--font-sans)">Loading embed token…</div></div></div>`;
  if (kind === 'denied') return `${mAudit()}${mReportTabs('labs')}<div class="m-card"><div class="state-box"><div class="sb-ic red">${ic('lock')}</div><h4>No access to Lab Results</h4><p>Restricted to clinical-ops roles. Attempt logged.</p></div></div>`;
  return `${mAudit()}${mReportTabs('overview')}
  <div class="m-kpis"><div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('scan-line')}</span><span class="mk-name">Analyses 30d</span></div><div class="mk-val sm">48.2k</div><div class="mk-foot">+6.4%</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('clock')}</span><span class="mk-name">To review</span></div><div class="mk-val">312</div><div class="mk-foot">41 over SLA</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('image')}</span><span class="mk-name">Img quality</span></div><div class="mk-val sm">0.87</div><div class="mk-foot">good</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('shield-check')}</span><span class="mk-name">Opt-in</span></div><div class="mk-val sm">61%</div><div class="mk-foot">de-id</div></div></div>
  <div class="m-card" style="padding:14px"><div style="font:600 12.5px var(--font-sans);margin-bottom:12px">Analyses by triage band</div><div class="bars" style="height:120px">${[['W4', 80, 'green'], ['W5', 58, 'amber'], ['W6', 90, 'green'], ['W7', 76, 'green']].map(([l, h, t]) => `<div class="bar-col"><div class="bc-bar ${t}" style="height:${h}%"></div><span class="bc-l">${l}</span></div>`).join('')}</div></div>
  <div class="ops-note" style="margin-top:12px">${ic('lock')}<span>Internal analytics · RLS active · no PHI.</span></div>`;
}
function mBodySkeleton() {
  return `${mAudit()}<div class="m-kpis">${[0, 0, 0, 0].map(() => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:40%;height:18px;margin:9px 0 5px"></div></div>`).join('')}</div><div class="m-card" style="padding:14px"><div class="skel" style="width:100%;height:120px;border-radius:6px"></div></div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'analytics', navLabel: 'Administration', title: 'Analytics', user: USER, search: 'Search reports, dimensions…', env: 'prod · RLS', envState: 'green', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'analytics', eyebrow: 'Admin · analytics', title: 'Analytics', env: 'RLS', envState: 'green', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · internal analytics',
  title: 'Embedded Power BI analytics shell',
  sub: 'An internal analytics surface — not the patient dashboard — wrapping an embedded Power BI report in the platform\u2019s own app shell with role-aware tabs, a standing audit banner, and visible row-level security. The embed feels integrated but is clearly framed by native navigation and access controls. Every visual uses analytics-safe labels only: pseudonymous IDs, counts, trends, status, triage category, body region, model and dataset version, consent status, and quality score. No patient names, emails, raw image or lab-file URLs, or free-text notes ever appear.',
  legend: ['Embed state — color + icon + text', ['green', 'shield', 'RLS active'], ['amber', 'clock', 'Token expired'], ['neutral', 'cloud-off', 'Report unavailable'], ['red', 'lock', 'Permission denied']],
});

const desktop = sectionHead('A', 'Desktop — embedded analytics shell', '1440px · admin console')
  + frame('01', 'Loading embed token', 'The native shell, audit banner and tabs paint immediately; the embed area shows a calm token-loading state while a scoped, time-limited report token is requested.', app(body('loading')), { url: 'admin.skinlesionxai.health/analytics' })
  + frame('02', 'Overview report — RLS active', 'The embedded report sits inside the app shell with a Power BI chrome strip, an "RLS active" badge, and analytics-safe KPIs and charts — counts, trends and status only.', app(body('overview')), { url: 'admin.skinlesionxai.health/analytics' })
  + frame('03', 'Permission denied — Lab Results tab', 'A restricted tab the admin role can\u2019t open; the lock is shown on the tab and the body explains the restriction and logs the attempt.', app(body('denied'), { envState: 'amber' }), { url: 'admin.skinlesionxai.health/analytics' })
  + frame('04', 'Embed token expired', 'The short-lived token times out; a security-framed message offers a refresh that preserves filters.', app(body('expired'), { envState: 'amber', notif: 1 }), { url: 'admin.skinlesionxai.health/analytics' })
  + frame('05', 'Report unavailable', 'The analytics report can\u2019t be reached; the message reassures the live model is unaffected and offers a retry.', app(body('unavailable'), { envState: 'amber', notif: 1 }), { url: 'admin.skinlesionxai.health/analytics' })
  + frame('06', 'Loading skeleton', 'The KPI and chart scaffold pulses while the report renders inside the embed frame.', app(bodySkeleton()), { url: 'admin.skinlesionxai.health/analytics' });

const mobile = sectionHead('B', 'Mobile — analytics shell', '375px · bottom tabs · scrollable report')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading embed token', 'The audit banner and tab chips paint instantly; the embed shows a token-loading state.', phone(mBody('loading'), { active: 'analytics' }))
  + mframe('M02', 'Overview report', 'KPIs and a triage-band chart in analytics-safe form, with an RLS audit banner pinned on top.', phone(mBody('overview'), { active: 'analytics' }))
  + mframe('M03', 'Permission denied', 'A restricted tab shows a clear, logged access message.', phone(mBody('denied'), { active: 'analytics', envState: 'amber' }))
  + mframe('M04', 'Loading skeleton', 'KPI tiles and the chart pulse while the report renders.', phone(mBodySkeleton(), { active: 'analytics' }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
