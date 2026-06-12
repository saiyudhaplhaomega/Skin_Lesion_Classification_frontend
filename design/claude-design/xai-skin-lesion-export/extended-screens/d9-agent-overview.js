/* ============================================================================
   D.9 — Role-based agent overview (administrator governance view).
   Five SEPARATED agent domains, each with its own RAG index and permission
   scope — not one shared memory. Each card shows allowed/blocked sources,
   approval rules, trace status, last run, safety status, and owning role.
   No patient data in the market-research agent; no cross-domain source access.
   No PHI anywhere. Loaded after kit.js.
   ============================================================================ */

const NAV = [
  { id: 'agents', label: 'AI agents', icon: 'bot' },
  { id: 'analytics', label: 'Analytics', icon: 'bar-chart-3' },
  { id: 'users', label: 'User management', icon: 'users' },
  { id: 'audit', label: 'Audit log', icon: 'scroll-text' },
  { id: 'health', label: 'System health', icon: 'activity' },
];
const NAV_EXTRA = [{ id: 'runbooks', label: 'Runbooks', icon: 'book-open' }, { id: 'access', label: 'Access & roles', icon: 'shield' }];
const USER = { initials: 'LA', name: 'L. Adesina', role: 'Administrator · governance' };

/* five domains */
const DOMAINS = [
  {
    cls: 'clinical', icon: 'layers', name: 'Clinical / XAI Explanation Agent', owner: 'Clinical engineering',
    purpose: 'Safe structured explanation of model output only.',
    allow: ['Structured model output', 'Grad-CAM region metadata', 'Approved explanation templates'],
    block: ['Patient images', 'Free-text notes', 'Other cases'],
    approval: 'Template-gated · no free generation', trace: ['on', 'Every response traced to facts'], last: '3m ago', safety: ['green', 'shield-check', 'Healthy'], idx: 'rag-clinical-v8',
  },
  {
    cls: 'doctor', icon: 'stethoscope', name: 'Doctor Workflow Agent', owner: 'Clinical operations',
    purpose: 'Assigned-case summary drafting and report support.',
    allow: ['Assigned case (structured facts)', 'Report templates', 'Specialty guidelines (approved)'],
    block: ['Unassigned cases', 'Raw images', 'Patient identity'],
    approval: 'Case-scoped · doctor confirms before submit', trace: ['on', 'Fact trace on every draft'], last: 'just now', safety: ['green', 'shield-check', 'Healthy'], idx: 'rag-doctor-v6',
  },
  {
    cls: 'customer', icon: 'graduation-cap', name: 'Customer Education Agent', owner: 'Product · patient experience',
    purpose: 'User-scoped education, image-quality guidance, privacy explanation, doctor-prep checklist.',
    allow: ['Education library', 'Image-quality tips', 'Privacy & consent FAQ'],
    block: ['Specific results', 'Images', 'Any PHI'],
    approval: 'Education library only · refuses results', trace: ['on', 'Source shown on every reply'], last: '1m ago', safety: ['green', 'shield-check', 'Healthy'], idx: 'rag-education-v11',
  },
  {
    cls: 'research', icon: 'bar-chart-3', name: 'Research / Fairness Agent', owner: 'ML research',
    purpose: 'De-identified aggregate model governance summaries.',
    allow: ['Aggregate metrics warehouse', 'Fairness cohorts (de-id)', 'Drift & calibration stats'],
    block: ['Individual records', 'Images', 'Patient identity'],
    approval: 'Aggregate-only · min cohort size enforced', trace: ['on', 'Cohort size on every stat'], last: '22m ago', safety: ['amber', 'alert-triangle', 'Stale index (8d)'], idx: 'rag-research-v4',
  },
  {
    cls: 'admin', icon: 'briefcase', name: 'Admin Market Research Agent', owner: 'Strategy · admin',
    purpose: 'Golden Docs, market-intelligence RAG, strategic decision briefs.',
    allow: ['Approved Golden Docs', 'Market-intelligence corpus', 'Competitive briefs (approved)'],
    block: ['Patient data', 'Clinical questions', 'Any other RAG index'],
    approval: 'Golden Docs only · cite on every fact', trace: ['on', 'Citation required per claim'], last: '5m ago', safety: ['green', 'shield-check', 'Healthy'], idx: 'rag-market-v12',
  },
];

function domainCard(d) {
  const [tone, icn, lab] = d.safety;
  return `<div class="domain-card ${d.cls}">
    <div class="dc-head"><div class="dch-ic">${ic(d.icon)}</div><div class="dch-main"><div class="dch-name">${d.name}</div><div class="dch-owner">${ic('user-cog')}Owned by ${d.owner}</div></div></div>
    <div class="dc-body">
      <div class="dc-sec"><div style="font:400 12px/1.5 var(--font-sans);color:var(--text-secondary)">${d.purpose}</div></div>
      <div class="dc-sec"><div class="dcs-l">${ic('check-circle')}Allowed sources</div><div class="src-list">${d.allow.map(s => `<span class="src-tag allow">${ic('check')}${s}</span>`).join('')}</div></div>
      <div class="dc-sec"><div class="dcs-l">${ic('shield-off')}Blocked sources</div><div class="src-list">${d.block.map(s => `<span class="src-tag block">${ic('x')}${s}</span>`).join('')}</div></div>
      <div class="dc-meta">
        <div class="dm-row"><span class="dm-l">Approval rule</span><span class="dm-v">${d.approval}</span></div>
        <div class="dm-row"><span class="dm-l">RAG index</span><span class="dm-v" style="font-family:var(--font-mono);font-size:11.5px">${d.idx}</span></div>
        <div class="dm-row"><span class="dm-l">Trace status</span><span class="dm-v">${statline('green', 'list-tree', d.trace[1])}</span></div>
        <div class="dm-row"><span class="dm-l">Last run</span><span class="dm-v">${ic('clock')}${d.last}</span></div>
      </div>
    </div>
    <div class="dc-foot"><span class="dcf-status">${statline(tone, icn, lab)}</span><button class="mini-btn">${ic('sliders-horizontal')}Manage</button><button class="mini-btn ghost">${ic('list-tree')}Traces</button></div>
  </div>`;
}

function isolationBar() {
  return `<div class="isolation-bar"><div class="ib-ic">${ic('split')}</div><div><div class="ib-t">Five separate systems — not one shared memory</div><div class="ib-d">Each agent has its own RAG index, permission scope, approval rules, and audit trail. No agent can read another\u2019s sources or conversation, and none can reach patient PHI. Cross-domain source access is blocked by policy, not convention.</div></div></div>`;
}

function kpis() {
  return `<div class="kpi-strip c4">
    <div class="kpi-tile lead"><span class="kt-l">${ic('bot')}Active agents</span><span class="kt-v">5</span><span class="kt-foot">isolated RAG indexes</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('list-tree')}Tracing</span><span class="kt-v">5<small>/ 5</small></span><span class="kt-foot">${statline('green', 'check-circle', 'all enforced')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('shield-check')}Safety status</span><span class="kt-v">4<small>/ 5</small></span><span class="kt-foot">${statline('amber', 'alert-triangle', '1 stale index')}</span></div>
    <div class="kpi-tile"><span class="kt-l">${ic('git-fork')}Cross-domain access</span><span class="kt-v">0</span><span class="kt-foot">${statline('green', 'lock', 'blocked by policy')}</span></div>
  </div>`;
}

function body(kind) {
  if (kind === 'detail') return detailView();
  return `
  ${stateHero('amber', 'shield-check', 'Five agent domains — isolated, traced, one needs attention', 'Every agent is tracing and no cross-domain access is possible. The Research / Fairness agent\u2019s index is 8 days stale and should be refreshed; everything else is healthy.', { meta: [['bot', '5 agents'], ['alert-triangle', '1 stale index']], ts: '09:18 UTC' })}
  ${kpis()}
  ${isolationBar()}
  ${rsec('bot', 'Agent domains', { meta: 'sources · approval · trace · safety', opOnly: true })}
  <div class="domain-grid">${DOMAINS.map(domainCard).join('')}</div>
  ${runbook('amber', 'Refresh the Research / Fairness RAG index', 'Its aggregate-metrics index was last rebuilt 8 days ago. Trigger a rebuild so governance summaries reflect the latest labelled data. No patient data is touched — the index holds aggregates only.', 'Open index-refresh runbook')}
  ${opsNote('<b>Governance surface — administrator only.</b> These are five separate systems with separate RAG indexes and permission scopes. The market-research agent never sees patient data; no agent can access another\u2019s sources. No PHI anywhere.')}`;
}
function detailView() {
  const d = DOMAINS[4];
  return `
  ${stateHero('blue', 'briefcase', 'Admin Market Research Agent — domain detail', 'A single agent\u2019s full governance record: allowed and blocked sources, approval rules, trace policy, recent runs, and ownership. Strictly Golden Docs; never patient data or clinical questions.', { meta: [['database', 'rag-market-v12'], ['user-cog', 'Strategy · admin']], ts: '09:18 UTC' })}
  <div class="grid-2c">
    ${domainCard(DOMAINS[4])}
    <div class="opc"><div class="opc-head"><span class="oh-t">${ic('list-tree')}Recent traces</span><span class="oh-spacer"></span><span class="oh-sub">citation per claim</span></div>
      ${[['09:13 UTC', 'ICP summary · EU dermatology', 'Golden Docs › Positioning §3.2', 'green'], ['08:51 UTC', 'Objection handling brief', 'Golden Docs › Objections §5.1', 'green'], ['08:20 UTC', 'Competitive gap vs DermEngine', 'Golden Docs › Competitive §2 · 94d old', 'amber']].map(([t, q, src, tone]) => `<div class="m-audit" style="padding:12px var(--sp-md)"><div class="ma-rail"><div class="ma-ic ${tone}">${ic(tone === 'amber' ? 'alert-triangle' : 'quote')}</div></div><div class="ma-body"><div class="ma-l1"><span class="ma-action">${q}</span><span class="ma-time">${t}</span></div><div class="ma-target">${ic('quote')} ${src}</div></div></div>`).join('')}
      <div class="flags-foot">${ic('shield-off')}Blocked attempts in 24h: <b style="color:var(--text-primary);margin-left:4px">2</b> — both clinical/patient questions, correctly refused.</div>
    </div>
  </div>
  ${opsNote('<b>Governance surface — administrator only.</b> The market-research agent answers strictly from approved Golden Docs and refuses any clinical or patient-specific question. No PHI, no cross-domain access.')}`;
}
function bodySkeleton() {
  const dc = () => `<div class="domain-card" style="border-top-color:var(--border)"><div class="dc-head"><div class="skel" style="width:38px;height:38px;border-radius:8px"></div><div style="flex:1"><div class="skel skel-line" style="width:60%"></div><div class="skel skel-line" style="width:40%;margin-top:7px"></div></div></div><div class="dc-body"><div class="skel skel-line" style="width:90%"></div><div class="skel" style="width:100%;height:30px;margin-top:11px;border-radius:6px"></div><div class="skel" style="width:100%;height:30px;margin-top:9px;border-radius:6px"></div></div></div>`;
  return `<div class="kpi-strip c4">${[0, 0, 0, 0].map(() => `<div class="kpi-tile"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:30%;height:24px;margin:9px 0 6px"></div></div>`).join('')}</div><div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:130px;height:13px"></div><span class="r-rule"></span></div><div class="domain-grid">${dc()}${dc()}</div><div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading agent governance…</div>`;
}

/* ════════════════════════════ MOBILE ════════════════════════════ */
const M_TABS = [{ id: 'agents', label: 'Agents', icon: 'bot' }, { id: 'analytics', label: 'Analytics', icon: 'bar-chart-3' }, { id: 'audit', label: 'Audit', icon: 'scroll-text' }, { id: 'account', label: 'Account', icon: 'user' }];
function mDomainCard(d) {
  const [tone, icn, lab] = d.safety;
  return `<div class="domain-card ${d.cls}" style="margin-bottom:12px">
    <div class="dc-head" style="padding:13px"><div class="dch-ic" style="width:32px;height:32px">${ic(d.icon)}</div><div class="dch-main"><div class="dch-name" style="font-size:13px">${d.name}</div><div class="dch-owner">${ic('user-cog')}${d.owner}</div></div></div>
    <div class="dc-body" style="padding:13px;gap:11px">
      <div style="font:400 11.5px/1.5 var(--font-sans);color:var(--text-secondary)">${d.purpose}</div>
      <div class="dc-sec"><div class="dcs-l">${ic('check-circle')}Allowed</div><div class="src-list">${d.allow.slice(0, 2).map(s => `<span class="src-tag allow">${ic('check')}${s}</span>`).join('')}</div></div>
      <div class="dc-sec"><div class="dcs-l">${ic('shield-off')}Blocked</div><div class="src-list">${d.block.map(s => `<span class="src-tag block">${ic('x')}${s}</span>`).join('')}</div></div>
    </div>
    <div class="dc-foot" style="padding:11px 13px">${statline(tone, icn, lab)}<span style="margin-left:auto;font:400 10.5px var(--font-mono);color:var(--text-muted)">${d.idx}</span></div>
  </div>`;
}
function mKpis() {
  return `<div class="m-kpis"><div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('bot')}</span><span class="mk-name">Agents</span></div><div class="mk-val">5</div><div class="mk-foot">isolated</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('list-tree')}</span><span class="mk-name">Tracing</span></div><div class="mk-val">5<span class="u">/5</span></div><div class="mk-foot">enforced</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('shield-check')}</span><span class="mk-name">Safety</span></div><div class="mk-val">4<span class="u">/5</span></div><div class="mk-foot">1 stale</div></div>
  <div class="m-kpi"><div class="mk-top"><span class="mk-ic">${ic('git-fork')}</span><span class="mk-name">Cross-domain</span></div><div class="mk-val">0</div><div class="mk-foot">blocked</div></div></div>`;
}
function mBody() {
  return `<div class="m-hero amber"><div class="mh-ic">${ic('shield-check')}</div><div class="mh-main"><div class="mh-t">5 domains — isolated, traced</div><div class="mh-d">No cross-domain access. 1 index is stale.</div></div></div>
  ${mKpis()}
  <div class="isolation-bar" style="padding:13px"><div class="ib-ic" style="width:32px;height:32px">${ic('split')}</div><div><div class="ib-t" style="font-size:12.5px">Separate systems</div><div class="ib-d" style="font-size:11px">Each agent has its own RAG index & scope. No shared memory, no PHI.</div></div></div>
  ${mSecHead('bot', 'Agent domains', { opOnly: true, more: '5' })}
  ${DOMAINS.map(mDomainCard).join('')}`;
}
function mBodySkeleton() {
  return `<div class="m-kpis">${[0, 0, 0, 0].map(() => `<div class="m-kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:30%;height:18px;margin:9px 0 5px"></div></div>`).join('')}</div><div class="domain-card" style="border-top-color:var(--border)"><div class="dc-head" style="padding:13px"><div class="skel" style="width:32px;height:32px;border-radius:8px"></div><div style="flex:1"><div class="skel skel-line" style="width:60%"></div></div></div></div>`;
}

const app = (b, o = {}) => desktopApp(b, { nav: NAV, navExtra: NAV_EXTRA, navActive: 'agents', navLabel: 'Administration', title: 'AI agent overview', user: USER, search: 'Search agents, sources, traces…', env: 'prod', envState: 'green', ...o });
const phone = (b, o = {}) => mPhone(b, { tabs: M_TABS, active: 'agents', eyebrow: 'Admin · governance', title: 'AI agents', env: 'prod', envState: 'green', ...o });

const mast = masthead({
  eyebrow: 'Skin Lesion XAI · Clinical Premium · administrator',
  title: 'Role-based agent overview',
  sub: 'A governance view of the platform\u2019s five AI agent domains, presented as what they are: five separate systems with separate RAG indexes and permission scopes — not one shared memory. Each domain card states its allowed and blocked sources, approval rules, trace status, last run, safety status, and owning role. The market-research agent never sees patient data, and no agent can access another\u2019s sources; cross-domain access is blocked by policy. No PHI anywhere.',
  legend: ['Domain & safety — color + icon + text', ['green', 'shield-check', 'Healthy'], ['amber', 'alert-triangle', 'Needs attention'], ['green', 'list-tree', 'Tracing enforced'], ['green', 'lock', 'Cross-domain blocked']],
});

const desktop = sectionHead('A', 'Desktop — role-based agent overview', '1440px · admin governance')
  + frame('01', 'Loading skeleton', 'KPI and domain-card scaffolds paint immediately; sources and safety states pulse while governance data loads.', app(bodySkeleton()), { url: 'admin.skinlesionxai.health/agents' })
  + frame('02', 'Five domains — overview', 'The isolation bar leads, then five domain cards each showing allowed/blocked sources, approval rules, trace status, last run, and safety — with one stale-index warning surfaced.', app(body('overview'), { envState: 'amber', notif: 1 }), { url: 'admin.skinlesionxai.health/agents' })
  + frame('03', 'Domain detail — market research', 'A single agent\u2019s full record with recent traces, citation-per-claim, and a count of correctly-refused clinical questions.', app(body('detail'), { envState: 'green' }), { url: 'admin.skinlesionxai.health/agents/market' });

const mobile = sectionHead('B', 'Mobile — agent governance', '375px · bottom tabs · domain cards')
  + '<div class="frame-grid">'
  + mframe('M01', 'Loading skeleton', 'KPI tiles and a domain card pulse while governance loads.', phone(mBodySkeleton(), { active: 'agents' }))
  + mframe('M02', 'Five domains', 'The isolation message and domain cards stack vertically, each with allowed/blocked source tags and a safety status.', phone(mBody(), { active: 'agents', envState: 'amber', notif: 1 }))
  + '</div>';

mountShowcase([mast, desktop, mobile]);
