/* ============================================================================
   Cloud operations & cost-control dashboard — desktop renderer (vanilla JS)

   OPERATOR SURFACE ONLY — never patient-facing. Safety stance enforced:
   • No PHI, no patient data of any kind on this surface.
   • No database connection strings, credentials, API keys, or secrets — the
     Terraform diff shows resource ADDRESSES only, never attribute values.
   • Status is always color + icon + text (never color alone).
   • Production-affecting destructive actions (Shutdown) route through a typed
     confirmation modal that states "this affects live patients" explicitly.
   ============================================================================ */

const ic = (name) => `<span class="app-icon"><i data-lucide="${name}"></i></span>`;

/* ── Status vocabulary (color + icon + text) ─────────────────────────── */
const ENV_STATUS = {
  running:  ['green',   'circle-play',  'Running'],
  paused:   ['amber',   'circle-pause', 'Paused'],
  shutdown: ['neutral', 'power',        'Shut down'],
};
const statusLine = (s) => { const [t, i, l] = ENV_STATUS[s]; return `<span class="statline ${t}">${ic(i)}${l}</span>`; };

/* ════════════════════════════════════════════════════════════════════════
   DATA (operator fixtures — no secrets, no PHI)
   ════════════════════════════════════════════════════════════════════════ */
const ENVS = {
  dev: {
    id:'dev', tier:'DEV', name:'Development', region:'eu-central-1',
    status:'running', cost:'418', costNote:'run-rate · $1,290 month-to-date',
    last:'4 minutes ago', lastWho:'CI pipeline · deploy #1842', stale:false,
    res:[
      ['cpu','6 vCPU','2 ECS tasks'],
      ['zap','0 GPU','inference off'],
      ['hard-drive','120 GB','object + EBS'],
      ['database','1 node','db.t3.medium'],
    ],
  },
  staging: {
    id:'staging', tier:'STAGING', name:'Staging', region:'eu-central-1',
    status:'paused', cost:'0', costNote:'paused · saving ~$1,940 / month',
    last:'2 days ago', lastWho:'Paused by M. Halvorsen', stale:false,
    res:[
      ['cpu','0 vCPU','tasks drained'],
      ['zap','0 GPU','workers stopped'],
      ['hard-drive','340 GB','retained'],
      ['database','1 node','stopped'],
    ],
  },
  prod: {
    id:'prod', tier:'PRODUCTION', name:'Production', region:'eu-central-1',
    status:'running', live:true, cost:'6,180', costNote:'run-rate · $19,140 month-to-date',
    last:'just now', lastWho:'Auto-scaling · healthy', stale:false,
    res:[
      ['cpu','24 vCPU','8 ECS tasks'],
      ['zap','2 GPU','model inference'],
      ['hard-drive','2.4 TB','encrypted at rest'],
      ['database','3 nodes','multi-AZ'],
    ],
  },
};

/* Cost breakdown (platform-wide monthly run-rate) */
const COST_TOTAL = '6,598';
const COST_ROWS = [
  { name:'Compute', icon:'cpu',         amt:'3,940', pct:60, color:'var(--accent)',        note:'ECS Fargate + GPU inference' },
  { name:'Storage', icon:'hard-drive',  amt:'1,520', pct:23, color:'var(--accent-mid)',    note:'S3 object store + EBS volumes' },
  { name:'Data transfer', icon:'arrow-up-down', amt:'790', pct:12, color:'var(--blue-border)', note:'egress + inter-AZ' },
  { name:'Networking & other', icon:'network', amt:'348', pct:5,  color:'var(--neutral-border)', note:'NAT, load balancer, logs' },
];

/* 30-day daily spend ($) for the trend chart */
const TREND_DAYS = [196,202,205,199,210,214,208,212,206,215,220,209,213,218,224,219,226,222,228,231,225,233,238,229,236,240,234,241,237,244];
const TREND_ANOM = [196,202,205,199,210,214,208,212,206,215,220,209,213,218,224,219,226,222,228,231,225,248,279,318,352,389,372,401,388,412];
const TREND_BUDGET = 300;

/* Terraform plan (resource ADDRESSES only — never attribute values/secrets) */
const TF_PLAN = {
  target:'staging', cmd:'terraform plan -target=module.staging -out=staging.tfplan',
  add:2, change:2, destroy:1,
  groups:[
    { label:'Create', sign:'+', cls:'add', items:[
      { addr:'module.staging.aws_cloudwatch_metric_alarm.cost_anomaly', note:'new resource' },
      { addr:'module.staging.aws_appautoscaling_policy.gpu_scale_in',    note:'new resource' },
    ]},
    { label:'Update in place', sign:'~', cls:'change', items:[
      { addr:'module.staging.aws_ecs_service.model_inference', note:'desired_count 0 → 1' },
      { addr:'module.staging.aws_db_instance.primary',         note:'instance_state stopped → available' },
    ]},
    { label:'Destroy', sign:'-', cls:'destroy', items:[
      { addr:'module.staging.aws_instance.gpu_worker[1]', note:'idle 47h' },
    ]},
  ],
};

/* ════════════════════════════════════════════════════════════════════════
   SHARED PIECES
   ════════════════════════════════════════════════════════════════════════ */
const rsec = (icon, title, { meta='', opOnly=false, link='' } = {}) =>
  `<div class="r-sec"><h3>${ic(icon)}${title}${opOnly?`<span class="op-only">${ic('terminal')}Operator only</span>`:''}</h3><span class="r-rule"></span>${meta?`<span class="r-meta">${meta}</span>`:''}${link?`<span class="r-link">${link}${ic('chevron-right')}</span>`:''}</div>`;

function controls(env = 'All environments') {
  return `
  <div class="controls">
    <div class="control">
      <span class="c-label">Scope</span>
      <span class="ops-env-tabs">
        <button class="on">All</button>
        <button><span class="led" style="background:var(--green)"></span>Dev</button>
        <button><span class="led" style="background:var(--amber)"></span>Staging</button>
        <button><span class="led" style="background:var(--green)"></span>Prod</button>
      </span>
    </div>
    <div class="control">
      <span class="c-label">Region</span>
      <span class="select mono">${ic('globe')}eu-central-1${ic('chevron-down')}<span class="chev"></span></span>
    </div>
    <div class="spacer"></div>
    <span class="updated">Cost data synced 6 Jun 2026 · 09:18 UTC</span>
    <button class="btn btn-secondary">${ic('refresh-cw')}Refresh</button>
  </div>`;
}

/* ── Alert banner ────────────────────────────────────────────────────── */
function banner(kind) {
  if (kind === 'anomaly') {
    return `
    <div class="ops-banner amber">
      <div class="ob-ic">${ic('trending-up')}</div>
      <div class="ob-main">
        <div class="ob-t">${ic('alert-triangle')}Cost anomaly — spend is tracking above the 7-day average<span class="statline amber">${ic('alert-triangle')}Action recommended</span></div>
        <div class="ob-d">Estimated run-rate is <b>38% above</b> the 7-day baseline. Two staging GPU workers have been <b>running 47h with no test activity</b> since the last suite completed — the most likely cause of the overage.</div>
        <div class="ob-meta">
          <span>${ic('server')}staging · 2× gpu_worker</span>
          <span>${ic('clock')}idle 47h</span>
          <span>${ic('circle-dollar-sign')}+$1,210 projected this cycle</span>
        </div>
      </div>
      <div class="ob-act">
        <button class="btn btn-warn">${ic('pause')}Pause staging</button>
        <button class="btn btn-secondary">${ic('eye')}Investigate</button>
      </div>
    </div>`;
  }
  return `
  <div class="ops-banner green">
    <div class="ob-ic">${ic('shield-check')}</div>
    <div class="ob-main">
      <div class="ob-t">${ic('check-circle')}No cost anomalies — all environments within budget</div>
      <div class="ob-d">Run-rate is within <b>4%</b> of the 7-day average. No resources flagged as idle or unexpectedly running. Last checked 09:14 UTC.</div>
    </div>
    <div class="ob-act"><button class="btn btn-secondary">${ic('bell')}Alert settings</button></div>
  </div>`;
}

/* ── Cost summary strip ──────────────────────────────────────────────── */
function summary(kind) {
  const projHigh = kind === 'anomaly';
  return `
  <div class="ops-summary">
    <div class="ops-sum lead">
      <span class="os-l">${ic('gauge')}Platform run-rate</span>
      <span class="os-v"><span class="cur">$</span>${COST_TOTAL}<small> / mo</small></span>
      <span class="os-foot">${ic('refresh-cw')}live estimate · 3 environments</span>
    </div>
    <div class="ops-sum">
      <span class="os-l">${ic('calendar')}Month to date</span>
      <span class="os-v"><span class="cur">$</span>20,430</span>
      <span class="os-foot"><span class="delta flat">${ic('minus')}62%</span><span class="muted">of cycle elapsed</span></span>
    </div>
    <div class="ops-sum">
      <span class="os-l">${ic('trending-up')}Projected cycle</span>
      <span class="os-v"><span class="cur">$</span>${projHigh ? '34,800' : '32,640'}</span>
      <span class="os-foot"><span class="delta ${projHigh?'down':'up'}">${ic(projHigh?'arrow-up':'arrow-down')}${projHigh?'+6.8%':'-2.1%'}</span><span class="muted">vs $32,500 budget</span></span>
    </div>
    <div class="ops-sum">
      <span class="os-l">${ic('piggy-bank')}Idle savings</span>
      <span class="os-v"><span class="cur">$</span>1,940<small> / mo</small></span>
      <span class="os-foot">${ic('circle-pause')}staging paused</span>
    </div>
  </div>`;
}

/* ── Environment cards ───────────────────────────────────────────────── */
function envActions(env, { prodGate = false } = {}) {
  if (env.status === 'running') {
    const shutdown = env.live
      ? `<button class="btn btn-danger btn-shutdown" aria-label="Shut down ${env.name}">${ic('power')}Shutdown…</button>`
      : `<button class="btn btn-danger btn-shutdown" aria-label="Shut down ${env.name}">${ic('power')}Shutdown</button>`;
    return `<button class="btn btn-warn">${ic('pause')}Pause</button>${shutdown}`;
  }
  if (env.status === 'paused') {
    return `<button class="btn btn-primary">${ic('play')}Resume</button><button class="btn btn-danger btn-shutdown">${ic('power')}Shutdown</button>`;
  }
  return `<button class="btn btn-primary">${ic('play')}Start</button>`;
}
function envCard(env) {
  const cls = `env-card ${env.id} ${env.status}`;
  const led = env.status === 'running' ? 'live' : env.status;
  return `<div class="${cls}">
    <div class="ec-accent"></div>
    <div class="ec-head">
      <span class="ec-tier">${env.tier}</span>
      <div class="ec-id">
        <div class="ec-name">${env.name}${env.live?`<span class="ec-live">${ic('activity')}Live patients</span>`:''}</div>
        <div class="ec-region">${ic('globe')}${env.region}</div>
      </div>
    </div>
    <div class="ec-statusrow"><span class="ec-led ${led}"></span>${statusLine(env.status)}</div>
    <div class="ec-cost">
      <div class="ecc-l">Estimated cost</div>
      <div class="ecc-v"><span class="cur">$</span>${env.cost}<small> / mo run-rate</small></div>
      <div class="ecc-sub">${env.status==='paused'?ic('piggy-bank'):ic('circle-dollar-sign')}${env.costNote}</div>
    </div>
    <div class="ec-resources">
      ${env.res.map(([i,v,l])=>`<div class="ec-res"><div class="erc-ic">${ic(i)}</div><div class="erc-main"><div class="erc-v ${env.status!=='running'&&(v.startsWith('0')||v==='1 node')?'dim':''}">${v}</div><div class="erc-l">${l}</div></div></div>`).join('')}
    </div>
    <div class="ec-activity">${ic('history')}Last activity <b>${env.last}</b> · ${env.lastWho}${env.stale?` <span class="stale">· idle</span>`:''}</div>
    <div class="ec-foot">${envActions(env)}</div>
  </div>`;
}
function envGrid(kind) {
  const dev = ENVS.dev;
  const staging = { ...ENVS.staging };
  const prod = ENVS.prod;
  if (kind === 'anomaly') {
    // staging still running unexpectedly (the anomaly source)
    staging.status = 'running';
    staging.cost = '2,180';
    staging.costNote = 'run-rate · 38% over baseline';
    staging.last = '47 hours ago';
    staging.lastWho = 'Test suite #318 completed';
    staging.stale = true;
    staging.res = [['cpu','12 vCPU','4 ECS tasks'],['zap','2 GPU','idle · no jobs'],['hard-drive','340 GB','object + EBS'],['database','1 node','db.t3.medium']];
  }
  return `<div class="env-grid">${envCard(dev)}${envCard(staging)}${envCard(prod)}</div>`;
}

/* ── Trend chart ─────────────────────────────────────────────────────── */
function trendChart(data, { anomalyFrom = -1 } = {}) {
  const W = 520, H = 178, padL = 6, padR = 10, padT = 12, padB = 24;
  const max = Math.max(...data, TREND_BUDGET) * 1.14;
  const n = data.length;
  const X = i => padL + (i / (n - 1)) * (W - padL - padR);
  const Y = v => padT + (1 - v / max) * (H - padT - padB);
  const baseN = anomalyFrom < 0 ? n : anomalyFrom + 1;
  const linePts = data.slice(0, baseN).map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  const areaPath = `M ${X(0).toFixed(1)},${Y(data[0]).toFixed(1)} L ${data.slice(0, baseN).map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' L ')} L ${X(baseN - 1).toFixed(1)},${(H - padB).toFixed(1)} L ${padL},${(H - padB).toFixed(1)} Z`;
  let anomLine = '';
  if (anomalyFrom >= 0) {
    const pts = data.slice(anomalyFrom).map((v, i) => `${X(anomalyFrom + i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    anomLine = `<polyline class="oc-anom" points="${pts}" />`;
  }
  const budgetY = Y(TREND_BUDGET);
  // gridlines
  const grids = [0.25, 0.5, 0.75, 1].map(f => { const yy = padT + (1 - f) * (H - padT - padB); return `<line class="oc-grid" x1="${padL}" y1="${yy.toFixed(1)}" x2="${W - padR}" y2="${yy.toFixed(1)}" />`; }).join('');
  // x ticks (~every 7 days)
  const labels = ['8 May', '15', '22', '29', '6 Jun'];
  const ticks = labels.map((lab, k) => { const i = Math.round(k * (n - 1) / (labels.length - 1)); const xx = X(i); return `<text class="oc-tick" x="${xx.toFixed(1)}" y="${H - 8}" text-anchor="${k === 0 ? 'start' : k === labels.length - 1 ? 'end' : 'middle'}">${lab}</text>`; }).join('');
  const lastI = n - 1, lastV = data[lastI];
  const warn = anomalyFrom >= 0;
  return `<svg class="ops-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Daily spend trend over 30 days">
    ${grids}
    <path class="oc-area" d="${areaPath}" />
    <polyline class="oc-line" points="${linePts}" />
    ${anomLine}
    <line class="oc-budget" x1="${padL}" y1="${budgetY.toFixed(1)}" x2="${W - padR}" y2="${budgetY.toFixed(1)}" />
    <text class="oc-budget-lab" x="${W - padR}" y="${(budgetY - 5).toFixed(1)}" text-anchor="end">budget $${TREND_BUDGET}/day</text>
    <circle class="oc-dot ${warn ? 'warn' : ''}" cx="${X(lastI).toFixed(1)}" cy="${Y(lastV).toFixed(1)}" r="3.5" />
    ${ticks}
  </svg>`;
}

function costSection(kind) {
  const anom = kind === 'anomaly';
  const data = anom ? TREND_ANOM : TREND_DAYS;
  return `<div class="cost-layout">
    <div class="ops-card">
      <div class="ops-card-head"><h4>${ic('pie-chart')}Cost breakdown</h4><span class="sub">monthly run-rate · all environments</span></div>
      <div class="cost-total"><div class="ct-v"><span class="cur">$</span>${COST_TOTAL}</div><div class="ct-meta">estimated this month<br>across compute, storage &amp; transfer</div></div>
      <div class="cost-stack">${COST_ROWS.map(r => `<i style="width:${r.pct}%;background:${r.color}"></i>`).join('')}</div>
      <div class="cost-rows">
        ${COST_ROWS.map(r => `<div class="cost-row">
          <span class="cr-sw" style="background:${r.color}"></span>
          <div class="cr-main"><div class="cr-name">${ic(r.icon)}${r.name}</div><div class="cr-bar"><i style="width:${r.pct}%;background:${r.color}"></i></div><div class="cr-pct" style="margin-top:5px;color:var(--text-muted)">${r.note}</div></div>
          <div class="cr-val"><div class="cr-amt">$${r.amt}</div><div class="cr-pct">${r.pct}%</div></div>
        </div>`).join('')}
      </div>
      <div class="cost-foot">${ic('info')}Figures are billing estimates, refreshed hourly. No customer or patient data influences cost attribution.</div>
    </div>
    <div class="ops-card">
      <div class="ops-card-head"><h4>${ic('line-chart')}Daily spend trend</h4><span class="sub">last 30 days</span></div>
      ${trendChart(data, { anomalyFrom: anom ? 20 : -1 })}
      <div class="ops-legend">
        <span><span class="sw" style="background:var(--accent)"></span>Daily spend</span>
        ${anom ? `<span><span class="sw" style="background:var(--amber)"></span>Anomaly window</span>` : ''}
        <span><span class="sw budget"></span>Daily budget</span>
      </div>
      ${anom
        ? `<div class="cost-foot" style="color:var(--amber)">${ic('alert-triangle')}<span style="color:#7a5800">Daily spend crossed the budget line 4 days ago and is still climbing.</span></div>`
        : `<div class="cost-foot">${ic('trending-up')}Tracking +1.4% week-over-week, within budget.</div>`}
    </div>
  </div>`;
}

/* ── Infrastructure / Terraform strip ────────────────────────────────── */
function tfStrip() {
  return `<div class="tf-strip">
    <div class="tfs-main">
      <div class="tfs-ic">${ic('box')}</div>
      <div><div class="tfs-t">Pending plan · staging</div><div class="tfs-s">${TF_PLAN.cmd}</div></div>
    </div>
    <div class="tf-spacer"></div>
    <div class="tf-counts">
      <span class="tf-count add">${ic('plus')}${TF_PLAN.add} add</span>
      <span class="tf-count change">${ic('pencil')}${TF_PLAN.change} change</span>
      <span class="tf-count destroy">${ic('minus')}${TF_PLAN.destroy} destroy</span>
    </div>
    <button class="btn btn-secondary">${ic('file-diff')}Review plan</button>
  </div>`;
}

const opsNote = () => `<div class="ops-note">${ic('lock')}<span><b>Operator surface — not patient-facing.</b> No protected health information is present here. Terraform diffs show resource addresses only; connection strings, credentials, and secrets are never displayed. Every Start / Pause / Resume / Shutdown is recorded to the change log.</span></div>`;

/* ════════════════════════════════════════════════════════════════════════
   BODY ASSEMBLY
   ════════════════════════════════════════════════════════════════════════ */
function opsBody(kind) {
  return `
  ${banner(kind === 'anomaly' ? 'anomaly' : 'clear')}
  ${controls()}
  ${summary(kind)}
  ${rsec('server', 'Environments', { meta:'status · cost · last activity · resources' })}
  ${envGrid(kind)}
  ${rsec('circle-dollar-sign', 'Cost breakdown', { meta:'compute · storage · data transfer · trend' })}
  ${costSection(kind)}
  ${rsec('box', 'Infrastructure changes', { opOnly:true, meta:'Terraform · plan before apply' })}
  ${tfStrip()}
  ${opsNote()}`;
}

/* ── Error state body (cost/metrics service unavailable) ─────────────── */
function errorBody() {
  return `
  ${banner('clear')}
  ${controls()}
  <div class="ops-card" style="padding:0;margin-bottom:var(--sp-md)">
    <div class="state-box"><div class="sb-ic red">${ic('plug-zap')}</div>
      <h4>Cost &amp; metrics service is unavailable</h4>
      <p>The billing and metrics provider didn't respond within the timeout. Environment controls below still work — only cost figures and the spend trend failed to load.</p>
      <div class="sb-act"><button class="btn btn-primary">${ic('refresh-cw')}Retry now</button><button class="btn btn-secondary">${ic('external-link')}Provider status</button></div>
      <span class="t-time" style="margin-top:8px">Last successful sync 08:46 UTC · 32 min ago</span>
    </div>
  </div>
  ${rsec('server', 'Environments', { meta:'control plane · operational' })}
  ${envGrid('healthy')}
  ${opsNote()}`;
}

/* ── Loading skeleton body ───────────────────────────────────────────── */
function skeletonBody() {
  const sumCard = () => `<div class="ops-sum"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:60%;height:26px;margin:10px 0 6px"></div><div class="skel skel-line" style="width:70%"></div></div>`;
  const envSkel = () => `<div class="env-card"><div class="ec-accent" style="background:var(--surface-sunken)"></div>
    <div style="padding:14px 16px"><div class="skel skel-line" style="width:40%;height:14px"></div><div class="skel skel-line" style="width:55%;margin-top:9px"></div>
    <div class="skel" style="width:50%;height:24px;margin:16px 0 6px"></div><div class="skel skel-line" style="width:70%"></div>
    <div class="skel" style="width:100%;height:54px;margin-top:16px;border-radius:8px"></div>
    <div class="skel" style="width:100%;height:36px;margin-top:14px;border-radius:6px"></div></div></div>`;
  return `
  ${controls()}
  <div class="ops-summary">${sumCard()}${sumCard()}${sumCard()}${sumCard()}</div>
  <div class="r-sec" style="margin-top:var(--sp-xl)"><div class="skel skel-line" style="width:150px;height:13px"></div><span class="r-rule"></span></div>
  <div class="env-grid">${envSkel()}${envSkel()}${envSkel()}</div>
  <div class="r-sec"><div class="skel skel-line" style="width:150px;height:13px"></div><span class="r-rule"></span></div>
  <div class="cost-layout"><div class="ops-card"><div class="skel skel-line" style="width:40%;height:13px"></div><div class="skel" style="width:100%;height:200px;margin-top:16px;border-radius:8px"></div></div><div class="ops-card"><div class="skel skel-line" style="width:40%;height:13px"></div><div class="skel" style="width:100%;height:200px;margin-top:16px;border-radius:8px"></div></div></div>
  <div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)"><span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading environment status &amp; cost data…</div>`;
}

/* ── Terraform plan modal ────────────────────────────────────────────── */
function tfModal() {
  const group = (g) => `<div class="tf-diff-group"><div class="tdg-h">${ic(g.cls==='add'?'plus-circle':g.cls==='change'?'edit-3':'minus-circle')}${g.label} · ${g.items.length}</div>
    ${g.items.map(it => `<div class="tf-line ${g.cls}"><span class="tl-sign">${g.sign}</span><span class="tl-addr">${it.addr}</span><span class="tl-note">${it.note}</span></div>`).join('')}</div>`;
  return `
  <div class="modal-scrim">
    <div class="modal wide">
      <div class="modal-head">
        <div class="mh-ic" style="background:var(--ink-900);color:#fff">${ic('box')}</div>
        <div><div class="mh-t">Terraform plan — staging</div><div class="mh-s">Review the full set of changes before applying. This is a dry run; nothing has been modified yet.</div></div>
      </div>
      <div class="tf-plan-head">
        <span class="tph-cmd">${ic('terminal')}${TF_PLAN.cmd}</span>
        <span class="tph-spacer"></span>
        <span class="tf-count add">${ic('plus')}${TF_PLAN.add} to add</span>
        <span class="tf-count change">${ic('pencil')}${TF_PLAN.change} to change</span>
        <span class="tf-count destroy">${ic('minus')}${TF_PLAN.destroy} to destroy</span>
      </div>
      <div class="tf-diff">${TF_PLAN.groups.map(group).join('')}</div>
      <div class="tf-safe">${ic('shield-check')}<span><b>Resource addresses only.</b> Variable values, connection strings, and secrets are redacted from plan output and never shown on this surface.</span></div>
      <div class="modal-foot">
        <button class="btn btn-secondary">${ic('x')}Cancel</button>
        <button class="btn btn-primary">${ic('check')}Apply plan</button>
      </div>
    </div>
  </div>`;
}

/* ── Production shutdown confirmation modal ──────────────────────────── */
function shutdownModal() {
  return `
  <div class="modal-scrim">
    <div class="modal">
      <div class="modal-head">
        <div class="mh-ic">${ic('power')}</div>
        <div><div class="mh-t">Shut down Production?</div><div class="mh-s">You're about to shut down the <b style="color:var(--text-primary)">Production</b> environment in <b style="font-family:var(--font-mono);color:var(--text-primary);font-weight:500">eu-central-1</b>. Read the impact before confirming.</div></div>
      </div>
      <div class="modal-body">
        <div class="live-warning">
          ${ic('alert-octagon')}
          <div><div class="lw-t">This affects live patients</div><div class="lw-d">Production serves <b>real patient traffic right now</b>. Shutting down stops image analysis, the doctor review queue, and notifications for <b>everyone</b> until the environment is started again.</div></div>
        </div>
        <div class="consequences">
          <div class="cq-h">What this does</div>
          <ul>
            <li class="neg">${ic('power-off')}<span>All Production compute is <b>stopped</b> — the patient app and doctor dashboard go offline.</span></li>
            <li class="neg">${ic('inbox')}<span>In-flight analyses and <b>queued reviews are paused</b>; no new cases can be submitted.</span></li>
            <li class="keep">${ic('database')}<span>Encrypted storage and databases are <b>retained, not deleted</b>. No data is lost.</span></li>
            <li class="keep">${ic('rotate-ccw')}<span>This is <b>reversible</b> — starting the environment restores service in ~6–8 minutes.</span></li>
          </ul>
        </div>
        <div class="notice amber" style="margin-top:var(--sp-md)">${ic('users')}<div><div class="n-d" style="margin:0">Estimated <b>active sessions affected: 41</b>. A status-page incident will be opened automatically and the action recorded to the change log with your operator ID.</div></div></div>
        <div class="confirm-input">
          <label>Type <b>SHUTDOWN PRODUCTION</b> to confirm</label>
          <input placeholder="SHUTDOWN PRODUCTION" aria-label="Type to confirm shutdown" />
        </div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-secondary">${ic('x')}Cancel</button>
        <button class="btn btn-danger-solid">${ic('power')}Shut down Production</button>
      </div>
    </div>
  </div>`;
}

/* ── Desktop app shell ───────────────────────────────────────────────── */
const NAV = [
  { id:'overview', label:'Overview',        icon:'layout-dashboard' },
  { id:'envs',     label:'Environments',    icon:'server' },
  { id:'cost',     label:'Cost control',    icon:'circle-dollar-sign' },
  { id:'infra',    label:'Infrastructure',  icon:'box' },
  { id:'alerts',   label:'Alerts',          icon:'bell-ring' },
];
function desktopApp(bodyHtml, { title='Cloud operations', navActive='overview', overlay='', notif=0, env='eu-central-1', envState='green', user={ initials:'MH', name:'M. Halvorsen', role:'Cloud operations · operator' } } = {}) {
  const nav = NAV.map(n => `<button class="nav-item ${n.id===navActive?'active':''}">${ic(n.icon)}${n.label}</button>`).join('');
  const led = envState==='amber'?'var(--amber)':envState==='red'?'var(--red)':'var(--green)';
  return `
  <div class="app">
    <aside class="sidebar">
      <div class="brand"><div class="mark"><div class="reticle"></div></div><div class="wm">Skin Lesion <b>XAI</b></div></div>
      <div class="nav-label">Cloud ops</div>
      ${nav}
      <div class="nav-label">Operations</div>
      <button class="nav-item">${ic('book-open')}Runbooks</button>
      <button class="nav-item">${ic('shield')}Access &amp; roles</button>
      <div class="sidebar-foot"><div class="sidebar-user"><div class="avatar">${user.initials}</div><div><div class="nm">${user.name}</div><div class="rl">${user.role}</div></div></div></div>
    </aside>
    <div class="main">
      <header class="topbar">
        <h1>${title}</h1>
        <div class="topbar-right">
          <div class="tb-search">${ic('search')}<input placeholder="Search environments, resources, runbooks…" /><span class="kbd">⌘K</span></div>
          <div class="tb-meta"><span class="env-pill"><span class="led" style="background:${led}"></span>${env}</span></div>
          <button class="icon-btn" aria-label="Alerts">${ic('bell')}${notif>0?'<span class="dot"></span>':''}</button>
          <button class="icon-btn" aria-label="Help">${ic('life-buoy')}</button>
        </div>
      </header>
      <main class="content"><div class="content-inner">${bodyHtml}</div></main>
      ${overlay}
    </div>
  </div>`;
}

/* ── Frame helper ────────────────────────────────────────────────────── */
function frame(no, title, desc, deviceHtml) {
  return `
  <div class="frame">
    <div class="frame-label"><span class="fl-no">${no}</span><span class="fl-title">${title}</span><span class="fl-desc">${desc}</span></div>
    <div class="device-desktop"><div class="device-bar"><span class="tl"></span><span class="tl"></span><span class="tl"></span><span class="url">${ic('lock')}ops.skinlesionxai.health/overview</span></div><div class="device-viewport">${deviceHtml}</div></div>
  </div>`;
}

/* ── Masthead + assembly ─────────────────────────────────────────────── */
const legendChip = (tone, icon, label) => `<span class="statline ${tone}">${ic(icon)}${label}</span>`;
const masthead = `
<div class="sc-masthead">
  <div>
    <div class="mh-brand">
      <div class="mh-mark"><div class="mh-reticle"></div></div>
      <div><p class="eyebrow">Skin Lesion XAI · Clinical Premium · operator only</p><h1>Cloud operations &amp; cost control</h1></div>
    </div>
    <p class="mh-sub">An internal operator surface for the platform's cloud environments: per-environment status and cost, a platform-wide cost breakdown with a spend trend, safe Start / Pause / Resume / Shutdown actions, a Terraform plan preview before any infrastructure change, and cost-anomaly alerting. Not patient-facing. No PHI, no connection strings, no secrets. Production shutdowns are gated behind a typed confirmation.</p>
  </div>
  <div class="mh-legend">
    <span class="lg-title">Environment status — color + icon + text</span>
    <span class="lg-row">${legendChip('green','circle-play','Running')}</span>
    <span class="lg-row">${legendChip('amber','circle-pause','Paused')}</span>
    <span class="lg-row">${legendChip('neutral','power','Shut down')}</span>
    <span class="lg-row">${legendChip('red','alert-octagon','Production action — gated')}</span>
  </div>
</div>`;

const section = `
<div class="sc-section-head"><span class="ix">A</span><h2>Desktop — cloud operations &amp; cost control</h2><span class="rule"></span><span class="sh-meta">1440px · operator console</span></div>
${frame('01','Loading skeleton','Shell, controls and section scaffold render immediately; summary, environment cards and the trend chart pulse while status and billing data load.', desktopApp(skeletonBody(), { envState:'green' }))}
${frame('02','Operations overview — Dev running, Staging paused','The healthy console: a green all-clear banner, three environment cards (Dev running in green, Staging paused in amber with a prominent Resume CTA, Production running with a live-patients marker), the cost breakdown and spend trend, and the pending Terraform plan.', desktopApp(opsBody('healthy'), { envState:'green', notif:0 }))}
${frame('03','Cost anomaly','An amber alert banner explains the overage in plain language — staging GPU workers left running 47h with no activity — and names the projected cost. The staging card now shows running/idle, and the trend chart breaks above the budget line.', desktopApp(opsBody('anomaly'), { envState:'amber', notif:1 }))}
${frame('04','Terraform plan preview','Before applying any infrastructure change, the full plan opens as a diff: resources to add, change, and destroy — addresses only, with secrets redacted. Apply is the explicit next step.', desktopApp(opsBody('healthy'), { title:'Infrastructure', navActive:'infra', envState:'green', overlay: tfModal() }))}
${frame('05','Production shutdown — confirmation','Shutting down Production is gated by a confirmation modal that leads with an explicit "this affects live patients" warning, separates what stops from what is retained, shows the active-session impact, and requires typing the confirmation phrase.', desktopApp(opsBody('healthy'), { title:'Environments', navActive:'envs', envState:'green', overlay: shutdownModal() }))}
${frame('06','Error with retry','The cost &amp; metrics provider is unreachable. A plain-language message offers a retry and a provider status link; the environment control plane keeps working so operators can still act.', desktopApp(errorBody(), { envState:'amber', notif:1 }))}
`;

document.getElementById('sc-wrap').innerHTML = masthead + section;
lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
