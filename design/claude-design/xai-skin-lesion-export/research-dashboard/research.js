/* ============================================================================
   Research & model-performance dashboard — template renderer (vanilla JS)
   Aggregate, de-identified metrics only. No individual patient data, no
   per-patient predictions, no model-architecture internals. Status is always
   communicated as color + icon + text.
   ============================================================================ */

const ic = (name) => `<span class="app-icon"><i data-lucide="${name}"></i></span>`;

/* ── SVG helpers ─────────────────────────────────────────────────────── */
// Map a normalized series (values within [min,max]) to a polyline points string
function mapSeries(values, x0, y0, w, h, min, max) {
  const n = values.length;
  return values.map((v, i) => {
    const x = x0 + (n === 1 ? 0 : (i / (n - 1)) * w);
    const y = y0 + h - ((v - min) / (max - min)) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}
// Tiny sparkline
function spark(values, { stroke = 'var(--accent)', w = 96, h = 30, min, max } = {}) {
  const lo = min ?? Math.min(...values), hi = max ?? Math.max(...values);
  const pts = mapSeries(values, 1, 1, w - 2, h - 2, lo, hi === lo ? lo + 1 : hi);
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="${pts}" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

/* ── ROC curve ───────────────────────────────────────────────────────── */
function rocPlot() {
  const W = 280, H = 232, L = 38, R = 14, T = 12, B = 30;
  const pw = W - L - R, ph = H - T - B, x0 = L, y0 = T;
  // (FPR, TPR) operating points
  const roc = [[0,0],[0.015,0.46],[0.04,0.66],[0.08,0.80],[0.15,0.89],[0.27,0.94],[0.45,0.968],[0.68,0.988],[1,1]];
  const pts = roc.map(([fp,tp]) => `${(x0+fp*pw).toFixed(1)},${(y0+ph-tp*ph).toFixed(1)}`).join(' ');
  const area = `${x0},${y0+ph} ${pts} ${x0+pw},${y0+ph}`;
  // operating threshold marker at (0.113, 0.911) → sens .911 / spec .887
  const opx = x0 + 0.113*pw, opy = y0 + ph - 0.911*ph;
  const ticks = [0,0.25,0.5,0.75,1];
  const grid = ticks.map(t => {
    const gx = x0 + t*pw, gy = y0 + ph - t*ph;
    return `<line class="grid" x1="${gx}" y1="${y0}" x2="${gx}" y2="${y0+ph}"/>
            <line class="grid" x1="${x0}" y1="${gy}" x2="${x0+pw}" y2="${gy}"/>`;
  }).join('');
  const xlbls = ticks.map(t => `<text class="lbl" x="${x0+t*pw}" y="${y0+ph+14}" text-anchor="middle">${t.toFixed(2)}</text>`).join('');
  const ylbls = ticks.map(t => `<text class="lbl" x="${x0-6}" y="${y0+ph-t*ph+3}" text-anchor="end">${t.toFixed(2)}</text>`).join('');
  return `<svg class="plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="ROC curve, area under curve 0.942">
    ${grid}
    <polygon class="roc-fill" points="${area}"/>
    <line class="diag" x1="${x0}" y1="${y0+ph}" x2="${x0+pw}" y2="${y0}"/>
    <polyline class="roc" points="${pts}"/>
    <circle class="pt" cx="${opx}" cy="${opy}" r="4.5"/>
    <circle cx="${opx}" cy="${opy}" r="8.5" fill="none" stroke="var(--accent)" stroke-width="1.25" opacity="0.5"/>
    <line class="axis" x1="${x0}" y1="${y0+ph}" x2="${x0+pw}" y2="${y0+ph}"/>
    <line class="axis" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0+ph}"/>
    ${xlbls}${ylbls}
    <text class="axlbl" x="${x0+pw/2}" y="${H-2}" text-anchor="middle">False positive rate</text>
  </svg>`;
}

/* ── Calibration / reliability curve ─────────────────────────────────── */
function calibPlot(over) {
  const W = 280, H = 232, L = 38, R = 14, T = 12, B = 30;
  const pw = W - L - R, ph = H - T - B, x0 = L, y0 = T;
  const binsX = [0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95];
  const obs = over
    ? [0.04,0.12,0.20,0.27,0.35,0.43,0.50,0.59,0.70,0.82]   // overconfident
    : [0.05,0.16,0.24,0.36,0.46,0.54,0.66,0.76,0.85,0.94];  // well-calibrated
  const pts = binsX.map((x,i)=>`${(x0+x*pw).toFixed(1)},${(y0+ph-obs[i]*ph).toFixed(1)}`).join(' ');
  const dots = binsX.map((x,i)=>`<circle class="calib-pt ${over?'over':''}" cx="${(x0+x*pw).toFixed(1)}" cy="${(y0+ph-obs[i]*ph).toFixed(1)}" r="3"/>`).join('');
  const ticks=[0,0.25,0.5,0.75,1];
  const grid = ticks.map(t=>{const gx=x0+t*pw,gy=y0+ph-t*ph;return `<line class="grid" x1="${gx}" y1="${y0}" x2="${gx}" y2="${y0+ph}"/><line class="grid" x1="${x0}" y1="${gy}" x2="${x0+pw}" y2="${gy}"/>`;}).join('');
  const xlbls=ticks.map(t=>`<text class="lbl" x="${x0+t*pw}" y="${y0+ph+14}" text-anchor="middle">${t.toFixed(2)}</text>`).join('');
  const ylbls=ticks.map(t=>`<text class="lbl" x="${x0-6}" y="${y0+ph-t*ph+3}" text-anchor="end">${t.toFixed(2)}</text>`).join('');
  return `<svg class="plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="Calibration reliability diagram">
    ${grid}
    <line class="diag" x1="${x0}" y1="${y0+ph}" x2="${x0+pw}" y2="${y0}"/>
    <polyline class="calib ${over?'over':''}" points="${pts}"/>
    ${dots}
    <line class="axis" x1="${x0}" y1="${y0+ph}" x2="${x0+pw}" y2="${y0+ph}"/>
    <line class="axis" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0+ph}"/>
    ${xlbls}${ylbls}
    <text class="axlbl" x="${x0+pw/2}" y="${H-2}" text-anchor="middle">Predicted confidence</text>
  </svg>`;
}

/* ── CAM quality area trend ──────────────────────────────────────────── */
function camPlot() {
  const W = 560, H = 200, L = 38, R = 14, T = 14, B = 28;
  const pw = W - L - R, ph = H - T - B, x0 = L, y0 = T;
  const series = [91.5,92.1,93.0,92.4,93.6,94.0,93.8,94.2];
  const wk = ['wk1','wk2','wk3','wk4','wk5','wk6','wk7','now'];
  const min = 86, max = 98;
  const pts = mapSeries(series, x0, y0, pw, ph, min, max);
  const area = `${x0},${y0+ph} ${pts} ${x0+pw},${y0+ph}`;
  const dots = series.map((v,i)=>{const x=x0+(i/(series.length-1))*pw,y=y0+ph-((v-min)/(max-min))*ph;return `<circle class="line-pt" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`;}).join('');
  const yt=[88,90,92,94,96,98];
  const grid=yt.map(v=>{const gy=y0+ph-((v-min)/(max-min))*ph;return `<line class="grid" x1="${x0}" y1="${gy}" x2="${x0+pw}" y2="${gy}"/><text class="lbl" x="${x0-6}" y="${gy+3}" text-anchor="end">${v}</text>`;}).join('');
  const thrY = y0+ph-((90-min)/(max-min))*ph;
  const xl = wk.map((w,i)=>`<text class="lbl" x="${x0+(i/(wk.length-1))*pw}" y="${y0+ph+14}" text-anchor="middle">${w}</text>`).join('');
  return `<svg class="plot" viewBox="0 0 ${W} ${H}" role="img" aria-label="Grad-CAM heatmap quality pass rate over eight weeks">
    ${grid}
    <polygon class="area" points="${area}"/>
    <line class="thr-line" x1="${x0}" y1="${thrY}" x2="${x0+pw}" y2="${thrY}"/>
    <text class="lbl" x="${x0+pw}" y="${thrY-5}" text-anchor="end" fill="var(--amber)">min target 90%</text>
    <polyline class="line" points="${pts}"/>
    ${dots}
    <line class="axis" x1="${x0}" y1="${y0+ph}" x2="${x0+pw}" y2="${y0+ph}"/>
    <line class="axis" x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0+ph}"/>
    ${xl}
  </svg>`;
}

/* ── Confusion matrix (row-normalized %, 7 educational classes) ──────── */
const CM_CLASSES = ['nv','mel','bkl','bcc','akiec','vasc','df'];
const CM = [
  [96, 1, 2, 0, 0, 1, 0],
  [ 9,84, 4, 1, 2, 0, 0],
  [ 5, 3,88, 2, 2, 0, 0],
  [ 1, 1, 3,90, 4, 1, 0],
  [ 1, 3, 5, 6,83, 1, 1],
  [ 1, 0, 1, 1, 0,96, 1],
  [ 3, 0, 4, 2, 2, 0,89],
];
function confusionMatrix() {
  const head = `<tr><th class="corner"></th>${CM_CLASSES.map(c=>`<th>${c}</th>`).join('')}</tr>`;
  const rows = CM.map((row,r)=>{
    const cells = row.map((v,c)=>{
      const a = v/100;
      const bg = `rgba(26,95,122,${(0.05+a*0.92).toFixed(3)})`;
      const light = `rgba(26,95,122,${(a*0.6).toFixed(3)})`;
      const isDiag = r===c;
      const fill = isDiag ? bg : light;
      const dark = (isDiag && a>0.45);
      return `<td class="${isDiag?'diag':''}" style="background:${fill}${dark?';color:#fff':''}" title="true ${CM_CLASSES[r]} → pred ${CM_CLASSES[c]}: ${v}%">${v}</td>`;
    }).join('');
    return `<tr><th class="rh">${CM_CLASSES[r]}</th>${cells}</tr>`;
  }).join('');
  return `
  <div class="cm">
    <div class="cm-axis-y">True class</div>
    <div>
      <table class="cm-grid"><tbody>${head}${rows}</tbody></table>
      <div class="cm-axis-x">Predicted class</div>
    </div>
    <div class="cm-scale">
      <span class="tick">100%</span>
      <div class="bar"></div>
      <span class="tick">0%</span>
    </div>
  </div>`;
}

/* ── Fairness — Fitzpatrick bars ─────────────────────────────────────── */
const FITZ = [
  { t:'Type I',   sw:'#F5D9C4', v:0.93 },
  { t:'Type II',  sw:'#E8B98F', v:0.92 },
  { t:'Type III', sw:'#D19E70', v:0.91 },
  { t:'Type IV',  sw:'#A8714B', v:0.88 },
  { t:'Type V',   sw:'#6B4429', v:0.84 },
  { t:'Type VI',  sw:'#3B2417', v:0.79 },
];
const FAIR_FLOOR = 0.85; // acceptable sensitivity floor
function fitzBars() {
  const lo=0.70, hi=1.00, range=hi-lo;
  const rows = FITZ.map(f=>{
    const pct = ((f.v-lo)/range)*100;
    const below = f.v < FAIR_FLOOR;
    return `
    <div class="bar-row">
      <span class="br-label"><span class="ft" style="background:${f.sw}"></span>${f.t}</span>
      <div class="bar-track">
        <div class="fill ${below?'amber':''}" style="width:${pct.toFixed(1)}%"></div>
        <div class="thresh" style="left:${(((FAIR_FLOOR-lo)/range)*100).toFixed(1)}%"></div>
      </div>
      <span class="br-val">${f.v.toFixed(2)}${below?`<span class="mini amber">${ic('alert-triangle')}below</span>`:`<span class="mini green">ok</span>`}</span>
    </div>`;
  }).join('');
  return `<div class="bars">${rows}</div>
  <div class="thresh-note"><span class="dash-key"></span>Acceptable sensitivity floor = 0.85 · darker types flagged for targeted data collection</div>`;
}

/* ── Fairness — age + body location tables ───────────────────────────── */
function ageTable() {
  const rows = [
    ['Under 30','0.91','2,140',false],
    ['30 – 49','0.92','5,820',false],
    ['50 – 69','0.90','7,210',false],
    ['70 and over','0.86','3,360',false],
  ];
  return `<table class="mtable">
    <thead><tr><th>Age bucket</th><th class="num">Sensitivity</th><th class="num">n (cases)</th></tr></thead>
    <tbody>${rows.map(([a,s,n])=>`<tr><td>${a}</td><td class="num">${s}</td><td class="num n">${n}</td></tr>`).join('')}</tbody>
  </table>`;
}
function locTable() {
  const rows = [
    ['Back','0.92','4,980'],
    ['Trunk','0.90','3,420'],
    ['Upper limb','0.91','3,110'],
    ['Lower limb','0.89','2,760'],
    ['Head / neck','0.85','1,540'],
    ['Acral','0.81','620'],
  ];
  return `<table class="mtable">
    <thead><tr><th>Body location</th><th class="num">Sensitivity</th><th class="num">n (cases)</th></tr></thead>
    <tbody>${rows.map(([a,s,n])=>{const low=parseFloat(s)<FAIR_FLOOR;return `<tr><td>${a}${low?` <span class="mini amber" style="font:600 10px var(--font-sans);padding:1px 5px;border-radius:4px">monitor</span>`:''}</td><td class="num">${s}</td><td class="num n">${n}</td></tr>`;}).join('')}</tbody>
  </table>`;
}

/* ── Calibration monitoring (confidence vs accuracy bars) ────────────── */
function calMonitor(over) {
  const bins = ['0.5–0.6','0.6–0.7','0.7–0.8','0.8–0.9','0.9–1.0'];
  const conf = [0.55,0.65,0.75,0.85,0.95];
  const acc = over ? [0.50,0.59,0.66,0.74,0.82] : [0.54,0.66,0.74,0.86,0.94];
  const bars = bins.map((b,i)=>{
    const under = over && (conf[i]-acc[i])>0.04;
    return `<div class="calbar">
      <div class="pair">
        <div class="seg-conf" style="height:${(conf[i]*100).toFixed(0)}%"></div>
        <div class="seg-acc ${under?'under':''}" style="height:${(acc[i]*100).toFixed(0)}%"></div>
      </div>
      <span class="cap">${b}</span>
    </div>`;
  }).join('');
  return `<div class="calbars">${bars}</div>
  <div class="chart-legend">
    <span class="lg"><span class="sw" style="background:var(--blue-border)"></span>Mean confidence</span>
    <span class="lg"><span class="sw" style="background:var(--accent)"></span>Observed accuracy</span>
    ${over?`<span class="lg"><span class="sw" style="background:var(--amber)"></span>Accuracy below confidence</span>`:''}
  </div>`;
}

/* ── Active-learning queue ───────────────────────────────────────────── */
function activeQueue() {
  return `
  <div class="alq">
    <div class="alq-stat">
      <div class="as-top">${ic('inbox')}<span class="as-name">Queue depth</span></div>
      <div class="as-val">218<span class="u">cases</span></div>
      <div class="as-foot">Pending doctor verification for the next training round. Aggregate count only.</div>
    </div>
    <div class="alq-stat">
      <div class="as-top">${ic('user-check')}<span class="as-name">Verified this week</span></div>
      <div class="as-val">96<span class="u">cases</span></div>
      <div class="as-foot">Doctor-confirmed labels added to the candidate set in the last 7 days.</div>
    </div>
    <div class="alq-stat">
      <div class="as-top">${ic('clock')}<span class="as-name">Oldest item age</span></div>
      <div class="as-val">19<span class="u">days</span></div>
      <div class="as-foot"><span class="statline amber">${ic('alert-triangle')}Over 14-day target</span></div>
    </div>
  </div>
  <div class="alq-bar">
    <div class="ab-track">
      <div class="ab-seg verified" style="width:38%"></div>
      <div class="ab-seg pending" style="width:50%"></div>
      <div class="ab-seg stale" style="width:12%"></div>
    </div>
    <div class="ab-legend">
      <span class="al"><span class="dot" style="background:var(--green)"></span>Verified &amp; ready (38%)</span>
      <span class="al"><span class="dot" style="background:var(--accent)"></span>Awaiting verification (50%)</span>
      <span class="al"><span class="dot" style="background:var(--amber)"></span>Stale &gt; 14 days (12%)</span>
    </div>
  </div>`;
}

/* ── Drift detection ─────────────────────────────────────────────────── */
function driftCard(opts) {
  const { name, desc, psi, thr, tone, series, statusIcon, statusLabel } = opts;
  return `
  <div class="drift-card ${tone==='red'?'alert':tone==='amber'?'warn':''}">
    <div class="dc-top">
      <div><p class="dc-name">${name}</p><p class="dc-desc">${desc}</p></div>
      <span class="statline ${tone}">${ic(statusIcon)}${statusLabel}</span>
    </div>
    <div class="dc-psi"><span class="v">${psi}</span><span class="lab">Population stability index (PSI)</span></div>
    ${spark(series, { stroke: tone==='red'?'var(--red)':tone==='amber'?'var(--amber)':'var(--accent)', w:240, h:38, min:0, max:Math.max(0.32, ...series) })}
    <div class="dc-thr">${ic('git-compare')}Thresholds: &lt; 0.10 stable · 0.10–0.25 monitor · &gt; 0.25 significant shift &nbsp;·&nbsp; current ${psi}</div>
  </div>`;
}
function driftSection(variant) {
  if (variant === 'drift') {
    return `<div class="drift-grid">
      ${driftCard({ name:'Input distribution shift', desc:'Image feature embeddings vs training reference', psi:'0.28', tone:'red', statusIcon:'alert-octagon', statusLabel:'Significant shift', series:[0.06,0.07,0.09,0.11,0.14,0.19,0.24,0.28] })}
      ${driftCard({ name:'Output distribution shift', desc:'Predicted band mix vs trailing 90-day baseline', psi:'0.13', tone:'amber', statusIcon:'alert-triangle', statusLabel:'Monitor', series:[0.04,0.05,0.05,0.07,0.08,0.10,0.11,0.13] })}
    </div>`;
  }
  return `<div class="drift-grid">
    ${driftCard({ name:'Input distribution shift', desc:'Image feature embeddings vs training reference', psi:'0.07', tone:'green', statusIcon:'check-circle', statusLabel:'Stable', series:[0.05,0.06,0.05,0.06,0.07,0.06,0.07,0.07] })}
    ${driftCard({ name:'Output distribution shift', desc:'Predicted band mix vs trailing 90-day baseline', psi:'0.05', tone:'green', statusIcon:'check-circle', statusLabel:'Stable', series:[0.04,0.05,0.04,0.05,0.05,0.04,0.05,0.05] })}
  </div>`;
}

/* ── KPI row ─────────────────────────────────────────────────────────── */
function kpiRow(variant) {
  const eceWarn = variant === 'calib';
  const ece = eceWarn
    ? { val:'0.074', delta:'+0.043', dir:'warn', dico:'arrow-up', foot:`<span class="statline amber">${ic('alert-triangle')}Above 0.05 target</span>`, spark:[0.030,0.031,0.034,0.041,0.052,0.063,0.074] }
    : { val:'0.031', delta:'−0.004', dir:'up', dico:'arrow-down', foot:`<span class="statline green">${ic('check-circle')}Within 0.05 target</span>`, spark:[0.040,0.038,0.036,0.034,0.033,0.032,0.031] };
  const kpis = [
    { name:'AUC-ROC', val:'0.942', pm:'± 0.006', delta:'+0.003', dir:'up', dico:'arrow-up', foot:`vs prior 30 days`, spark:[0.931,0.934,0.936,0.938,0.939,0.941,0.942] },
    { name:'Sensitivity', val:'0.911', pm:'± 0.011', delta:'+0.008', dir:'up', dico:'arrow-up', foot:`recall, concern classes`, spark:[0.898,0.901,0.903,0.906,0.908,0.910,0.911] },
    { name:'Specificity', val:'0.887', pm:'± 0.009', delta:'−0.002', dir:'flat', dico:'minus', foot:`at operating threshold`, spark:[0.890,0.889,0.888,0.889,0.887,0.888,0.887] },
    { name:'Calibration (ECE)', val:ece.val, pm:'', delta:ece.delta, dir:ece.dir, dico:ece.dico, foot:ece.foot, spark:ece.spark },
  ];
  return `<div class="kpi-row">${kpis.map(k=>`
    <div class="kpi">
      <div class="k-top"><span class="k-name">${k.name}</span><span class="delta ${k.dir}">${ic(k.dico)}${k.delta}</span></div>
      <div class="k-val">${k.val}${k.pm?`<span class="pm">${k.pm}</span>`:''}</div>
      ${spark(k.spark, { stroke: k.dir==='warn'?'var(--amber)':'var(--accent)' })}
      <div class="k-foot">${typeof k.foot==='string' && !k.foot.startsWith('<')?`<span class="muted">${k.foot}</span>`:k.foot}</div>
    </div>`).join('')}</div>`;
}

/* ── Controls bar ────────────────────────────────────────────────────── */
function controls(modelVer) {
  return `
  <div class="controls">
    <div class="control">
      <span class="c-label">Date range</span>
      <div class="seg-range" role="tablist" aria-label="Date range">
        <button>7d</button><button class="on">30d</button><button>90d</button><button>1y</button>
      </div>
    </div>
    <div class="control">
      <span class="c-label">Model version</span>
      <span class="select mono">${ic('git-branch')}${modelVer}${ic('chevron-down')}</span>
    </div>
    <div class="control">
      <span class="c-label">Evaluation set</span>
      <span class="select">${ic('database')}Held-out test${ic('chevron-down')}</span>
    </div>
    <div class="spacer"></div>
    <span class="updated">Last refreshed 6 Jun 2026 · 09:12 UTC</span>
    <button class="btn btn-secondary">${ic('download')}Export report</button>
  </div>`;
}

/* ── Banners ─────────────────────────────────────────────────────────── */
function driftBanner() {
  return `<div class="alert-banner red">
    <span class="ab-ic">${ic('alert-octagon')}</span>
    <div>
      <div class="ab-t">Input distribution shift detected</div>
      <div class="ab-d">Image-embedding drift has crossed the <b>significant</b> threshold (PSI 0.28 &gt; 0.25). Incoming captures differ materially from the training reference — performance metrics below may not hold. Review the drift panel and consider pausing auto-routing until a re-evaluation completes.</div>
    </div>
    <div class="ab-act"><span class="ab-time">Flagged 6 Jun · 08:40</span><button class="btn btn-secondary">${ic('search')}Investigate</button></div>
  </div>`;
}
function calibBanner() {
  return `<div class="alert-banner amber">
    <span class="ab-ic">${ic('alert-triangle')}</span>
    <div>
      <div class="ab-t">Calibration drift warning</div>
      <div class="ab-d">Expected calibration error has risen to <b>0.074</b> (target ≤ 0.05). The model is trending <b>overconfident</b> — predicted confidence now exceeds observed accuracy in the upper bins. A temperature rescale to <b>T = 1.34</b> is recommended before the next release. Ranking metrics (AUC) are unaffected.</div>
    </div>
    <div class="ab-act"><span class="ab-time">Flagged 5 Jun · 22:10</span><button class="btn btn-secondary">${ic('sliders-horizontal')}Recalibrate</button></div>
  </div>`;
}

/* ── Section heading helper ──────────────────────────────────────────── */
const rsec = (icon, title, meta='') => `<div class="r-sec"><h3>${ic(icon)}${title}</h3><span class="r-rule"></span>${meta?`<span class="r-meta">${meta}</span>`:''}</div>`;
const ccHead = (title, sub, fig, figLab) => `<div class="cc-head"><div><p class="cc-title">${title}</p>${sub?`<p class="cc-sub">${sub}</p>`:''}</div>${fig?`<div class="cc-fig">${fig}${figLab?`<small>${figLab}</small>`:''}</div>`:''}</div>`;

const dataNote = () => `<div class="data-note">${ic('shield-check')}<span><b>Aggregate, de-identified metrics only.</b> This dashboard shows no individual patient data or per-patient predictions. Educational AI-performance monitoring — not a diagnosis tool.</span></div>`;

/* ── Calibration card (curve + temperature) ──────────────────────────── */
function calibCard(over) {
  return `<div class="chart-card">
    ${ccHead('Calibration curve', 'Observed frequency vs predicted confidence, 10 bins', over?'ECE 0.074':'ECE 0.031', 'expected cal. error')}
    ${calibPlot(over)}
    <div class="chart-legend">
      <span class="lg"><span class="sw" style="background:var(--accent)${over?';background:var(--amber)':''}"></span>Model</span>
      <span class="lg"><span class="sw dash"></span>Perfect calibration</span>
    </div>
    <div class="temp-box">
      <div class="tb-ic">${ic('thermometer')}</div>
      <div class="tb-main">
        <div class="tb-label">Temperature setting</div>
        <div class="tb-val">T = 1.00${over?`<span class="rec">→ recommend 1.34</span>`:''}</div>
      </div>
      <span class="tb-state">${over?`<span class="statline amber">${ic('alert-triangle')}Rescale advised</span>`:`<span class="statline green">${ic('check-circle')}Calibrated</span>`}</span>
    </div>
  </div>`;
}

/* ════════════════════════════════════════════════════════════════════════
   DASHBOARD BODY — populated (variant: healthy | drift | calib)
   ════════════════════════════════════════════════════════════════════════ */
function dashboardBody(variant) {
  const banner = variant === 'drift' ? driftBanner() : variant === 'calib' ? calibBanner() : '';
  return `
  ${controls('v2.4.1 · resnet-xai')}
  ${banner}

  ${rsec('activity','Model performance','Held-out test · n = 18,530 cases')}
  ${kpiRow(variant)}
  <div class="grid-3" style="margin-top:var(--sp-md)">
    <div class="chart-card">
      ${ccHead('ROC curve', 'True vs false positive rate; marker = operating point', '0.942', 'AUC-ROC')}
      ${rocPlot()}
      <div class="chart-legend"><span class="lg"><span class="sw" style="background:var(--accent)"></span>Model</span><span class="lg"><span class="sw dash"></span>Chance (AUC 0.5)</span><span class="lg"><span class="sw" style="background:var(--accent);border-radius:50%;width:8px;height:8px"></span>Operating threshold</span></div>
    </div>
    ${calibCard(variant === 'calib')}
    <div class="chart-card">
      ${ccHead('Confusion matrix', 'Row-normalized %, held-out test', '', '')}
      ${confusionMatrix()}
      <p class="cm-note" style="margin-top:12px">Rows sum to 100%. Strongest off-diagonal confusion: <b>mel → nv</b> (9%) and <b>akiec → bcc</b> (6%) — both routed to professional review.</p>
    </div>
  </div>

  ${rsec('scale','Fairness — performance across groups','Sensitivity by Fitzpatrick skin type, age, body location')}
  <div class="grid-3-2">
    <div class="chart-card">
      ${ccHead('Sensitivity by Fitzpatrick skin type', 'Recall on concern classes, per skin-tone group', '0.14', 'max gap (I↔VI)')}
      ${fitzBars()}
      <div class="fair-gap amber">${ic('alert-triangle')}<div><div class="fg-t">Fairness gap exceeds 0.05 tolerance</div><div class="fg-d">Types V and VI fall below the 0.85 sensitivity floor. Action: prioritize darker-skin captures in the active-learning queue and re-audit after the next training round.</div></div></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:var(--sp-md)">
      <div class="chart-card">${ccHead('By age bucket','','','')}${ageTable()}</div>
      <div class="chart-card">${ccHead('By body location','','','')}${locTable()}</div>
    </div>
  </div>

  ${rsec('thermometer','Calibration monitoring','Confidence vs observed accuracy, by bin')}
  <div class="grid-2">
    <div class="chart-card">
      ${ccHead('Confidence vs accuracy', variant==='calib'?'Model is overconfident — accuracy trails confidence in upper bins':'Predicted confidence tracks observed accuracy closely', variant==='calib'?'1.34':'1.00', variant==='calib'?'recommended T':'current temperature')}
      ${calMonitor(variant === 'calib')}
      <div class="temp-box">
        <div class="tb-ic">${ic('gauge')}</div>
        <div class="tb-main"><div class="tb-label">Mean confidence vs accuracy</div><div class="tb-val">${variant==='calib'?'0.79 vs 0.66':'0.78 vs 0.77'}</div></div>
        <span class="tb-state">${variant==='calib'?`<span class="statline amber">${ic('alert-triangle')}13-pt gap</span>`:`<span class="statline green">${ic('check-circle')}1-pt gap</span>`}</span>
      </div>
    </div>
    <div class="chart-card">
      ${ccHead('Grad-CAM heatmap quality', 'Share of explanation heatmaps passing the automated quality check', '94.2%', 'this week')}
      ${camPlot()}
      <div class="chart-legend"><span class="lg"><span class="sw" style="background:var(--accent)"></span>Pass rate</span><span class="lg"><span class="sw dash" style="background:repeating-linear-gradient(90deg,var(--amber) 0 4px,transparent 4px 8px)"></span>Minimum target (90%)</span></div>
    </div>
  </div>

  ${rsec('inbox','Active-learning queue','Doctor-verified cases pending the next training round')}
  <div class="chart-card">${activeQueue()}</div>

  ${rsec('git-compare','Drift detection','Input &amp; output distribution shift vs reference')}
  ${driftSection(variant)}

  <div class="r-foot">${dataNote()}</div>`;
}

/* ════════════════════════════════════════════════════════════════════════
   DASHBOARD BODY — loading skeleton
   ════════════════════════════════════════════════════════════════════════ */
function skelCard(h) { return `<div class="skel-card"><div class="skel skel-line" style="width:40%;height:12px"></div><div class="skel" style="width:100%;height:${h}px;margin-top:14px"></div></div>`; }
function dashboardSkeleton() {
  const kpi = `<div class="kpi-row">${[0,1,2,3].map(()=>`<div class="kpi"><div class="skel skel-line" style="width:55%"></div><div class="skel" style="width:70%;height:26px;margin:12px 0 4px"></div><div class="skel" style="width:100%;height:30px"></div><div class="skel skel-line" style="width:45%;margin-top:10px"></div></div>`).join('')}</div>`;
  return `
  ${controls('v2.4.1 · resnet-xai')}
  <div class="r-sec" style="margin-top:0"><div class="skel skel-line" style="width:180px;height:13px"></div><span class="r-rule"></span></div>
  ${kpi}
  <div class="grid-3" style="margin-top:var(--sp-md)">${skelCard(200)}${skelCard(200)}${skelCard(200)}</div>
  <div class="r-sec"><div class="skel skel-line" style="width:220px;height:13px"></div><span class="r-rule"></span></div>
  <div class="grid-3-2">${skelCard(220)}<div style="display:flex;flex-direction:column;gap:var(--sp-md)">${skelCard(90)}${skelCard(120)}</div></div>
  <div class="r-sec"><div class="skel skel-line" style="width:190px;height:13px"></div><span class="r-rule"></span></div>
  <div class="grid-2">${skelCard(160)}${skelCard(160)}</div>
  <div style="display:flex;align-items:center;gap:10px;justify-content:center;color:var(--text-muted);font-size:12.5px;margin-top:var(--sp-xl)">
    <span class="spinner" style="width:18px;height:18px;border-width:2px"></span>Loading evaluation metrics for v2.4.1…
  </div>`;
}

/* ════════════════════════════════════════════════════════════════════════
   DASHBOARD BODY — no data yet (new model)
   ════════════════════════════════════════════════════════════════════════ */
function emptyCard(icon, title, body, req) {
  return `<div class="r-empty dashed"><div class="ei">${ic(icon)}</div><h4>${title}</h4><p>${body}</p>${req?`<div class="req">${req}</div>`:''}</div>`;
}
function dashboardEmpty() {
  return `
  ${controls('v2.5.0-rc1 · resnet-xai')}
  <div class="new-model">
    <div class="nm-ic">${ic('flask-conical')}</div>
    <div>
      <div class="nm-t">No evaluation data yet for v2.5.0-rc1</div>
      <div class="nm-d">This model version was promoted to staging 2 hours ago. Performance, fairness, calibration, and drift metrics populate once it has scored enough held-out cases and accumulated doctor-verified labels. Nothing here is fabricated while the candidate set fills.</div>
    </div>
    <div class="nm-prog"><div class="np-val">0 / 2,000</div><div class="np-lab">held-out cases scored</div></div>
  </div>

  ${rsec('activity','Model performance')}
  <div class="kpi-row">${['AUC-ROC','Sensitivity','Specificity','Calibration (ECE)'].map(n=>`<div class="kpi"><div class="k-top"><span class="k-name">${n}</span><span class="delta flat">${ic('minus')}—</span></div><div class="k-val" style="color:var(--text-muted)">—</div><div class="k-foot"><span class="statline neutral">${ic('clock')}Awaiting data</span></div></div>`).join('')}</div>
  <div class="grid-3" style="margin-top:var(--sp-md)">
    ${emptyCard('git-compare','ROC curve unavailable','Needs at least 2,000 scored held-out cases to plot a stable curve.','0 of 2,000 cases scored')}
    ${emptyCard('thermometer','Calibration pending','Reliability bins and ECE appear once enough predictions are collected.','min. 2,000 predictions')}
    ${emptyCard('grid-3x3','Confusion matrix empty','Per-class counts populate as the held-out set is scored.','7 classes · 0 scored')}
  </div>

  ${rsec('scale','Fairness — performance across groups')}
  ${emptyCard('users','Subgroup metrics not yet available','Fairness across Fitzpatrick type, age, and body location requires a minimum of 100 verified cases per subgroup to report without small-sample noise.','0 subgroups meet the 100-case minimum')}

  ${rsec('inbox','Active-learning queue')}
  <div class="alq">
    <div class="alq-stat"><div class="as-top">${ic('inbox')}<span class="as-name">Queue depth</span></div><div class="as-val">0<span class="u">cases</span></div><div class="as-foot">No cases routed for verification yet.</div></div>
    <div class="alq-stat"><div class="as-top">${ic('user-check')}<span class="as-name">Verified this week</span></div><div class="as-val">0<span class="u">cases</span></div><div class="as-foot">Verification begins after first scoring batch.</div></div>
    <div class="alq-stat"><div class="as-top">${ic('clock')}<span class="as-name">Oldest item age</span></div><div class="as-val">—</div><div class="as-foot"><span class="statline neutral">${ic('clock')}Empty queue</span></div></div>
  </div>

  ${rsec('git-compare','Drift detection')}
  ${emptyCard('radar','Drift baseline not established','Input and output distribution baselines are still being computed from the first scoring window. Drift alerts activate once a 7-day reference is in place.','reference window: 0 / 7 days')}

  <div class="r-foot">${dataNote()}</div>`;
}

/* ── Desktop app shell ───────────────────────────────────────────────── */
const RESEARCH_NAV = [
  { id:'overview', label:'Overview',        icon:'layout-dashboard', active:true },
  { id:'fairness', label:'Fairness',        icon:'scale' },
  { id:'calib',    label:'Calibration',     icon:'thermometer' },
  { id:'active',   label:'Active learning', icon:'inbox' },
  { id:'drift',    label:'Drift',           icon:'git-compare' },
  { id:'exports',  label:'Reports',         icon:'file-text' },
];
function desktopApp(bodyHtml, { notif=0, env='Production', envState='green', user={initials:'PV',name:'Dr. P. Varga',role:'ML Research · Read-only'} } = {}) {
  const nav = RESEARCH_NAV.map(n=>`<button class="nav-item ${n.active?'active':''}">${ic(n.icon)}${n.label}</button>`).join('');
  const ledColor = envState==='amber'?'var(--amber)':envState==='red'?'var(--red)':'var(--green)';
  return `
  <div class="app">
    <aside class="sidebar">
      <div class="brand"><div class="mark"><div class="reticle"></div></div><div class="wm">Skin Lesion <b>XAI</b></div></div>
      <div class="nav-label">Research · Model ops</div>
      ${nav}
      <div class="sidebar-foot"><div class="sidebar-user"><div class="avatar">${user.initials}</div><div><div class="nm">${user.name}</div><div class="rl">${user.role}</div></div></div></div>
    </aside>
    <div class="main">
      <header class="topbar">
        <h1>Model performance</h1>
        <div class="topbar-right">
          <div class="tb-meta"><span class="env-pill"><span class="led" style="background:${ledColor}"></span>${env}</span></div>
          <button class="icon-btn" aria-label="Notifications">${ic('bell')}${notif>0?'<span class="dot"></span>':''}</button>
          <button class="icon-btn" aria-label="Settings">${ic('settings')}</button>
        </div>
      </header>
      <main class="content"><div class="content-inner">${bodyHtml}</div></main>
    </div>
  </div>`;
}

/* ── Mobile shell (container-scoped, reuses the dashboard section fns) ── */
const M_TABS = [
  { id:'overview', label:'Overview',    icon:'layout-dashboard' },
  { id:'fairness', label:'Fairness',    icon:'scale' },
  { id:'calib',    label:'Calibration', icon:'thermometer' },
  { id:'drift',    label:'Drift',       icon:'git-compare' },
  { id:'reports',  label:'Reports',     icon:'file-text' },
];
function mobileShell(inner, { env='Production', notif=0 } = {}) {
  const tabs = M_TABS.map(t=>`<div class="m-tab ${t.id==='overview'?'on':''}">${ic(t.icon)}${t.label}</div>`).join('');
  return `
  <div class="device-phone">
    <div class="notch"></div>
    <div class="phone-screen">
      <div class="phone-statusbar"><span>9:41</span><span class="sb-r">${ic('signal')}${ic('wifi')}${ic('battery-full')}</span></div>
      <div class="m-app">
        <div class="m-topbar">
          <div class="m-brand"><div class="m-mark"><div class="m-reticle"></div></div><div><div class="m-title">Model ops</div><div class="m-env">${env}</div></div></div>
          <button class="icon-btn" aria-label="Notifications">${ic('bell')}${notif>0?'<span class="dot"></span>':''}</button>
        </div>
        <div class="m-scroll"><div class="m-dash">${inner}</div></div>
        <div class="m-tabbar">${tabs}</div>
      </div>
    </div>
  </div>`;
}
function mobileFrame(no, title, desc, phoneHtml) {
  return `<div class="mobile-frame"><div class="frame-label"><span class="fl-no">${no}</span><span class="fl-title">${title}</span><span class="fl-desc">${desc}</span></div>${phoneHtml}</div>`;
}

/* ── Frame helper ────────────────────────────────────────────────────── */
function frame(no, title, desc, deviceHtml) {
  return `
  <div class="frame">
    <div class="frame-label"><span class="fl-no">${no}</span><span class="fl-title">${title}</span><span class="fl-desc">${desc}</span></div>
    <div class="device-desktop"><div class="device-bar"><span class="tl"></span><span class="tl"></span><span class="tl"></span><span class="url">${ic('lock')}research.skinlesionxai.health/performance</span></div><div class="device-viewport">${deviceHtml}</div></div>
  </div>`;
}

/* ── Build ───────────────────────────────────────────────────────────── */
const bandChip = (tone, icon, label) => `<span class="statline ${tone}">${ic(icon)}${label}</span>`;
const masthead = `
<div class="sc-masthead">
  <div>
    <div class="mh-brand">
      <div class="mh-mark"><div class="mh-reticle"></div></div>
      <div><p class="eyebrow">Skin Lesion XAI · Clinical Premium</p><h1>Research &amp; model-performance dashboard</h1></div>
    </div>
    <p class="mh-sub">An internal monitoring surface for ML researchers and platform administrators: performance, fairness, calibration, active-learning, Grad-CAM quality, and drift. Aggregate and de-identified — no individual patient data, ever. Every required state is shown below as a labeled frame.</p>
  </div>
  <div class="mh-legend">
    <span class="lg-title">Metric status — color + icon + text</span>
    <span class="lg-row">${bandChip('green','check-circle','Within target')}</span>
    <span class="lg-row">${bandChip('amber','alert-triangle','Monitor / review')}</span>
    <span class="lg-row">${bandChip('red','alert-octagon','Alert / threshold breach')}</span>
    <span class="lg-row">${bandChip('neutral','clock','Pending / insufficient data')}</span>
  </div>
</div>`;

const section = `
<div class="sc-section-head"><span class="ix">A</span><h2>Desktop — research &amp; model-ops dashboard</h2><span class="rule"></span><span class="sh-meta">1440px · 12-col grid · data-dense</span></div>
${frame('01','Loading skeleton','Shell, controls, and section scaffold render immediately; metric cards pulse while evaluation data loads.', desktopApp(dashboardSkeleton(), { env:'Production', envState:'green' }))}
${frame('02','Data populated','Healthy model: AUC 0.942, calibration within target, drift stable. All sections live — performance, fairness, calibration, active-learning, CAM quality, drift.', desktopApp(dashboardBody('healthy'), { env:'Production', envState:'green' }))}
${frame('03','No data yet (new model)','v2.5.0-rc1 just promoted to staging — metrics withhold until enough held-out cases are scored and the drift baseline is established. Nothing fabricated.', desktopApp(dashboardEmpty(), { env:'Staging', envState:'neutral', user:{initials:'PV',name:'Dr. P. Varga',role:'ML Research · Read-only'} }))}
${frame('04','Drift alert active','Input distribution shift crosses the significant threshold (PSI 0.28). Red banner + drift cards in alert; metrics flagged as possibly unreliable.', desktopApp(dashboardBody('drift'), { notif:1, env:'Production', envState:'red' }))}
${frame('05','Calibration drift warning','ECE rises to 0.074 (target ≤ 0.05); the model trends overconfident. Amber banner, warning on the ECE KPI, calibration curve and confidence bars, plus a T = 1.34 rescale recommendation.', desktopApp(dashboardBody('calib'), { notif:1, env:'Production', envState:'amber' }))}
`;

const mobileSection = `
<div class="sc-section-head"><span class="ix">B</span><h2>Mobile — responsive reflow, single column</h2><span class="rule"></span><span class="sh-meta">390px · grids stack, charts scale</span></div>
<div class="mobile-row">
  ${mobileFrame('01','Loading skeleton','Controls + scaffold first, cards pulse.', mobileShell(dashboardSkeleton(), { env:'Production' }))}
  ${mobileFrame('02','Data populated','Full dashboard reflowed to one column.', mobileShell(dashboardBody('healthy'), { env:'Production' }))}
  ${mobileFrame('03','No data yet','New model — metrics withheld.', mobileShell(dashboardEmpty(), { env:'Staging' }))}
  ${mobileFrame('04','Drift alert active','Red banner stacks above the metrics.', mobileShell(dashboardBody('drift'), { env:'Production', notif:1 }))}
  ${mobileFrame('05','Calibration warning','Amber banner + ECE flag + rescale tip.', mobileShell(dashboardBody('calib'), { env:'Production', notif:1 }))}
</div>
`;

document.getElementById('sc-wrap').innerHTML = masthead + section + mobileSection;
lucide.createIcons({ attrs: { 'stroke-width': 1.75 } });
