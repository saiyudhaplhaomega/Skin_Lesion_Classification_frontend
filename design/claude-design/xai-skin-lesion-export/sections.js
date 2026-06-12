/* ============================================================================
   Research dashboard — section renderers. Pure functions of a view-model (vm).
   Exposes window.RDS with every section + the app shell.
   ============================================================================ */
(function () {
  'use strict';
  const ic = (name) => `<span class="app-icon"><i data-lucide="${name}"></i></span>`;

  /* ── Shell ────────────────────────────────────────────────────────────── */
  function sidebar(vm) {
    const groups = vm.nav.map((g) => `
      <div class="nav-label">${g.group}</div>
      ${g.items.map((it) => `<button class="nav-item${it.active ? ' active' : ''}">${ic(it.icon)}<span>${it.label}</span></button>`).join('')}
    `).join('');
    return `<aside class="sidebar">
      <div class="brand">
        <div class="mark"><div class="reticle"></div></div>
        <div class="wm">Skin Lesion <b>XAI</b><br><span style="font-weight:500;font-size:11px;color:#6E7E93">Research console</span></div>
      </div>
      ${groups}
      <div class="sidebar-foot">
        <div class="sidebar-user">
          <div class="avatar">${vm.user.init}</div>
          <div><div class="nm">${vm.user.name}</div><div class="rl">${vm.user.role}</div></div>
        </div>
      </div>
    </aside>`;
  }

  function topbar(vm) {
    const dot = vm.alertDot ? '<span class="dot"></span>' : '';
    return `<header class="topbar">
      <button class="rd-menu icon-btn" aria-label="Open menu">${ic('menu')}</button>
      <h1>Research &amp; model performance</h1>
      <div class="topbar-right">
        <span class="chip green rd-env" style="font-weight:600">${ic('circle-dot')}Production</span>
        <button class="icon-btn" aria-label="Notifications">${ic('bell')}${dot}</button>
        <button class="icon-btn rd-hide-sm" aria-label="Help">${ic('help-circle')}</button>
      </div>
    </header>`;
  }

  function shell(vm, content) {
    return `<div class="app">
      ${sidebar(vm)}
      <div class="main">
        ${topbar(vm)}
        <div class="content"><div class="rd-inner">${content}</div></div>
      </div>
    </div>`;
  }

  /* ── Controls ─────────────────────────────────────────────────────────── */
  function controls(vm, opts = {}) {
    const live = opts.live;
    const ranges = ['7d', '30d', '90d', 'YTD'];
    const rlabel = (r) => (r === 'YTD' ? 'YTD' : 'Last ' + r);
    const rangeBtns = ranges.map((r) =>
      `<button role="tab" class="${r === vm.range ? 'on' : ''}" aria-selected="${r === vm.range}" ${live ? `data-range="${r}"` : ''}>${rlabel(r)}</button>`).join('');
    // version selector — real dropdown when live
    const verOptions = vm.versions.map((v) =>
      `<button class="rd-opt${v.id === vm.model.version ? ' on' : ''}" data-version="${v.id}" role="option" aria-selected="${v.id === vm.model.version}">
        <span class="ver">${v.id}</span><span class="vstatus">${v.status}</span>${v.id === vm.model.version ? ic('check') : ''}</button>`).join('');
    const versionCtl = live
      ? `<div class="rd-dd">
          <button class="rd-select" aria-haspopup="listbox" aria-expanded="false" data-dd="version">${ic('git-branch')}<span class="ver">${vm.model.version}</span>${ic('chevron-down')}</button>
          <div class="rd-menu-pop" role="listbox" hidden>${verOptions}</div>
        </div>`
      : `<button class="rd-select" aria-haspopup="listbox">${ic('git-branch')}<span class="ver">${vm.model.version}</span>${ic('chevron-down')}</button>`;
    // role toggle — only on live console
    const roleToggle = live
      ? `<div class="rd-ctl">
          <label>Role</label>
          <div class="rd-seg" role="tablist" aria-label="Role">
            <button role="tab" class="${vm.role === 'researcher' ? 'on' : ''}" aria-selected="${vm.role === 'researcher'}" data-role="researcher">Researcher</button>
            <button role="tab" class="${vm.role === 'admin' ? 'on' : ''}" aria-selected="${vm.role === 'admin'}" data-role="admin">Administrator</button>
          </div>
        </div>`
      : '';
    return `<div class="rd-controls">
      <div class="rd-ctl">
        <label>Date range</label>
        <div class="rd-seg" role="tablist" aria-label="Date range">${rangeBtns}</div>
      </div>
      <div class="rd-ctl">
        <label>Model version</label>${versionCtl}
      </div>
      ${roleToggle}
      <div class="grow"></div>
      <div class="rd-ctl rd-hide-sm">
        <label>&nbsp;</label>
        <span class="rd-updated">${ic('refresh-cw')}Updated <b>${vm.model.updated}</b></span>
      </div>
      <div class="rd-ctl">
        <label>&nbsp;</label>
        <button class="btn btn-secondary">${ic('download')}Export report</button>
      </div>
    </div>`;
  }

  function privacyStrip() {
    return `<div class="disclaimer" style="margin-bottom:var(--sp-lg)">
      ${ic('shield-check')}
      <p><strong>Aggregate, de-identified cohort metrics only.</strong> No individual patient images, predictions, or records are accessible from this view. Cohorts smaller than 50 are suppressed.</p>
    </div>`;
  }

  function banner(b) {
    if (!b) return '';
    return `<div class="rd-banner ${b.tone}">
      ${ic(b.icon)}
      <div><div class="bt">${b.title}</div><div class="bd">${b.desc}</div></div>
      ${b.action ? `<div class="bact"><button class="btn btn-secondary">${b.action}</button></div>` : ''}
    </div>`;
  }

  function secHead(icon, title, hint) {
    return `<div class="rd-sec-head">${ic(icon)}<h3>${title}</h3>${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
  }

  /* ── System health (admin only) ──────────────────────────────────────── */
  function systemHealth(vm) {
    const cards = vm.system.map((s) => {
      const toneCls = s.tone === 'green' ? ' ok' : '';
      return `<div class="rd-sys card${toneCls}">
        <div class="sl">${ic(s.icon)}${s.label}</div>
        <div class="sv">${s.value}${s.unit ? `<small> ${s.unit}</small>` : ''}</div>
        <div class="ss">${s.sub}</div>
      </div>`;
    }).join('');
    return `<section class="rd-section">
      ${secHead('server', 'System &amp; serving health', 'Live infrastructure · ' + vm.model.window)}
      <div class="rd-sysgrid">${cards}</div>
    </section>`;
  }

  /* ── KPIs ─────────────────────────────────────────────────────────────── */
  function kpis(vm) {
    return `<div class="rd-kpis">${vm.kpis.map((k) => {
      const arrow = k.dir === 'up' ? 'arrow-up-right' : k.dir === 'down' ? 'arrow-down-right' : 'minus';
      return `<div class="rd-kpi card${k.cls || ''}">
        <div class="kl">${ic(k.icon)}${k.label}</div>
        <div class="kv">${k.value}</div>
        <div class="kfoot"><span class="rd-delta ${k.deltaDir || 'flat'}">${ic(arrow)}${k.delta}</span><span>${k.foot}</span></div>
      </div>`;
    }).join('')}</div>`;
  }

  /* ── Model performance ───────────────────────────────────────────────── */
  function modelPerf(vm) {
    const roc = window.RDCharts.rocCurve(vm.rocPts, { w: 300, h: 240 });
    return `<section class="rd-section">
      ${secHead('activity', 'Model performance', 'Held-out evaluation · ' + vm.model.evalSet)}
      <div class="rd-grid-2">
        <div class="rd-card card">
          <div class="rd-card-head"><h4>ROC curve</h4><span class="val">AUC ${vm.rocAuc}</span></div>
          ${roc}
          <div class="rd-legend">
            <span><span class="sw" style="background:var(--accent)"></span>Model (one-vs-rest macro)</span>
            <span><span class="sw dash"></span>Chance line</span>
          </div>
        </div>
        <div class="rd-card card">
          <div class="rd-card-head"><h4>Confusion matrix</h4><span class="sub">row-normalized %</span></div>
          ${confusionMatrix(vm)}
        </div>
      </div>
    </section>`;
  }

  function confusionMatrix(vm) {
    const { classes } = window.RD_DATA.cm;
    const rows = vm.cmRows;
    const head = classes.map((c) => `<th class="col">${c.id}</th>`).join('');
    const body = rows.map((row, i) => {
      const cells = row.map((v, j) => {
        const a = Math.min(v / 100, 1);
        const bg = `rgba(26,95,122,${(a * 0.92).toFixed(3)})`;
        const txt = a > 0.5 ? '#fff' : (v === 0 ? 'var(--text-muted)' : 'var(--text-primary)');
        return `<td class="${i === j ? 'diag' : ''}" style="background:${bg};color:${txt}" title="${classes[i].name} predicted ${classes[j].name}: ${v}%">${v === 0 ? '·' : v}</td>`;
      }).join('');
      return `<tr><th class="row">${classes[i].id}</th>${cells}</tr>`;
    }).join('');
    return `<div class="rd-cm-wrap">
      <table class="rd-cm">
        <tr><th class="corner"></th><th class="col" colspan="${classes.length}"><span class="rd-cm-axis">Predicted →</span></th></tr>
        <tr><th class="corner"></th>${head}</tr>
        ${body}
      </table>
    </div>
    <div class="rd-cm-foot">
      <span>True ↓ vs predicted →. Diagonal = correct.</span>
      <span style="flex:1"></span><span>0%</span>
      <span class="rd-cm-scale" style="background:linear-gradient(90deg,rgba(26,95,122,0.06),rgba(26,95,122,0.92))"></span><span>100%</span>
    </div>`;
  }

  /* ── Calibration ─────────────────────────────────────────────────────── */
  function calibration(vm) {
    const cal = vm.cal;
    const rel = window.RDCharts.reliability(cal.reliability, { w: 300, h: 240 });
    const dist = window.RDCharts.confidenceDist(cal.dist, { w: 560, h: 220 });
    return `<section class="rd-section">
      ${secHead('gauge', 'Calibration monitoring', vm.calHint)}
      <div class="rd-meta-row">
        <div class="rd-meta"><div class="ml">Expected calib. error</div><div class="mv">${cal.ece.toFixed(3)}</div></div>
        <div class="rd-meta"><div class="ml">Max calib. error</div><div class="mv">${cal.mce.toFixed(3)}</div></div>
        <div class="rd-meta"><div class="ml">Brier score</div><div class="mv">${cal.brier.toFixed(3)}</div></div>
        <div class="rd-meta"><div class="ml">Temperature (T)</div><div class="mv">${cal.temperature.toFixed(2)}${vm.flags.calib ? ' <small>↑ recalibrate</small>' : ''}</div></div>
      </div>
      <div class="rd-grid-2">
        <div class="rd-card card">
          <div class="rd-card-head"><h4>Reliability diagram</h4><span class="sub">predicted vs observed</span></div>
          ${rel}
          <div class="rd-legend">
            <span><span class="sw" style="background:var(--accent)"></span>Observed accuracy</span>
            <span><span class="sw dash"></span>Perfect calibration</span>
            <span><span class="sw" style="background:var(--amber)"></span>Overconfidence gap</span>
          </div>
        </div>
        <div class="rd-card card">
          <div class="rd-card-head"><h4>Confidence distribution vs accuracy</h4><span class="sub">share of predictions · accuracy</span></div>
          ${dist}
          <div class="rd-legend">
            <span><span class="sw" style="background:var(--accent-light);border:1px solid var(--blue-border)"></span>Share of predictions</span>
            <span><span class="sw" style="background:var(--accent)"></span>Actual accuracy</span>
            <span><span class="sw dot" style="border:1.4px solid var(--text-muted);background:transparent"></span>Mean confidence</span>
          </div>
        </div>
      </div>
    </section>`;
  }

  /* ── Fairness ────────────────────────────────────────────────────────── */
  function fairBars(data, target) {
    const min = 0.80, max = 0.96;
    const pct = (v) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
    return `<div class="rd-bars">${data.map((d) => {
      const chip = d.flag ? `<span class="chip amber" style="padding:1px 7px;font-size:10px">${ic('alert-triangle')}Below target</span>` : '';
      return `<div class="rd-barrow">
        <div class="bl">${d.label}<small>n=${d.n.toLocaleString()}</small></div>
        <div class="rd-bartrack">
          <div class="rd-barfill ${d.flag ? 'amber' : ''}" style="width:${pct(d.auc).toFixed(1)}%"></div>
          <div class="tgt" style="left:${pct(target).toFixed(1)}%"></div>
        </div>
        <div class="bv">${d.auc.toFixed(2)}${chip}</div>
      </div>`;
    }).join('')}</div>`;
  }

  function fairness(vm) {
    const f = vm.fair;
    return `<section class="rd-section">
      ${secHead('scale', 'Fairness metrics', 'AUC-ROC by subgroup · target ≥ ' + f.target.toFixed(2) + ' (marker)')}
      <div class="rd-grid-3">
        <div class="rd-card card">
          <div class="rd-card-head"><h4>Fitzpatrick skin type</h4></div>
          ${fairBars(f.fitzpatrick, f.target)}
          <div class="rd-fair-note">Types V–VI sit below the target band and are under-represented in the evaluation set. Active-learning sampling prioritizes these cohorts.</div>
        </div>
        <div class="rd-card card">
          <div class="rd-card-head"><h4>Age bucket</h4></div>
          ${fairBars(f.age, f.target)}
          <div class="rd-fair-note">Performance is consistent across age bands; the 70+ cohort sits near the target threshold.</div>
        </div>
        <div class="rd-card card">
          <div class="rd-card-head"><h4>Body location</h4></div>
          ${fairBars(f.location, f.target)}
          <div class="rd-fair-note">Palmar / plantar (acral) sites lag; few acral examples exist in training data.</div>
        </div>
      </div>
    </section>`;
  }

  /* ── Active learning + CAM quality ───────────────────────────────────── */
  function pipeline(vm) {
    const q = vm.queue;
    const cam = window.RDCharts.trendLine(vm.cam.series, { w: 600, h: 200, min: 0.88, max: 0.98, xevery: 1, band: { lo: vm.cam.target, hi: 0.98 }, aria: 'CAM quality pass rate' });
    const reasons = q.reasons.map((r) => `
      <div class="rd-qgroup">
        <span style="font-size:12.5px;color:var(--text-secondary)">${r.label}</span>
        <span class="qbn">${r.n}</span>
        <div class="qbbar"><i style="width:${(r.share * 100).toFixed(0)}%"></i></div>
      </div>`).join('');
    return `<section class="rd-section">
      ${secHead('inbox', 'Active learning &amp; explanation quality')}
      <div class="rd-grid-wide">
        <div class="rd-card card">
          <div class="rd-card-head"><h4>CAM quality pass rate</h4><span class="val">${(vm.cam.current * 100).toFixed(1)}%</span></div>
          ${cam}
          <div class="rd-legend">
            <span><span class="sw" style="background:var(--accent)"></span>Heatmaps passing quality check</span>
            <span><span class="sw" style="background:var(--green-bg);border:1px solid var(--green-border)"></span>Target ≥ ${(vm.cam.target * 100).toFixed(0)}%</span>
          </div>
        </div>
        <div class="rd-card card">
          <div class="rd-card-head"><h4>Active learning queue</h4><span class="sub">doctor-verified labels</span></div>
          <div class="rd-queue-stats">
            <div class="rd-qstat"><div class="ql">Pending review</div><div class="qv">${q.pending}</div></div>
            <div class="rd-qstat"><div class="ql">Queue depth</div><div class="qv">${q.depth}</div></div>
            <div class="rd-qstat warn"><div class="ql">Oldest item</div><div class="qv">${q.oldest}<small> d</small></div></div>
          </div>
          <div style="font:700 10px/1 var(--font-sans);letter-spacing:.5px;text-transform:uppercase;color:var(--text-muted);margin:4px 0 10px">Sampling reason</div>
          <div class="rd-qbreak">${reasons}</div>
        </div>
      </div>
    </section>`;
  }

  /* ── Drift detection ─────────────────────────────────────────────────── */
  function driftPanel(label, d) {
    const toneChip = d.tone === 'red' ? 'red' : d.tone === 'amber' ? 'amber' : 'green';
    const chipIcon = d.tone === 'red' ? 'alert-octagon' : d.tone === 'amber' ? 'alert-triangle' : 'check-circle';
    const valColor = d.tone === 'red' ? 'var(--red)' : d.tone === 'amber' ? 'var(--amber)' : 'var(--green)';
    const bar = window.RDCharts.driftBar(d.value, { warn: d.warn, alert: d.alert, max: d.max });
    return `<div class="rd-card card">
      <div class="rd-drift">
        <div class="rd-drift-top">
          <span class="dl">${label}</span>
          <span class="chip ${toneChip}">${ic(chipIcon)}${d.status}</span>
        </div>
        <div class="rd-drift-metric">
          <span class="dm" style="color:${valColor}">${d.value.toFixed(2)}</span>
          <span class="dn">vs warn ${d.warn} · limit ${d.alert}</span>
        </div>
        ${bar}
        <div class="rd-drift-note">${d.note}</div>
      </div>
    </div>`;
  }

  function drift(vm) {
    return `<section class="rd-section">
      ${secHead('git-compare', 'Drift detection', vm.driftHint)}
      <div class="rd-grid-2">
        ${driftPanel('Input distribution shift', vm.drift.input)}
        ${driftPanel('Output distribution shift', vm.drift.output)}
      </div>
    </section>`;
  }

  /* ── Empty + skeleton ────────────────────────────────────────────────── */
  function emptyCard(icon, title, desc) {
    return `<div class="rd-card card"><div class="rd-empty sm"><div class="ei">${ic(icon)}</div><h4>${title}</h4><p>${desc}</p></div></div>`;
  }
  function emptyKpis(vm) {
    return `<div class="rd-kpis">${vm.kpis.map((k) => `<div class="rd-kpi card">
      <div class="kl">${ic(k.icon)}${k.label}</div>
      <div class="kv" style="color:var(--text-muted)">—</div>
      <div class="kfoot"><span style="color:var(--text-muted)">Awaiting first run</span></div>
    </div>`).join('')}</div>`;
  }
  function emptyBody(vm) {
    return emptyKpis(vm) +
      `<section class="rd-section">${secHead('activity', 'Model performance')}<div class="rd-grid-2">${emptyCard('activity', 'ROC not available', 'The benchmark has not produced predictions for this model version yet.')}${emptyCard('grid-3x3', 'Confusion matrix pending', 'A class-by-class breakdown appears after the first evaluation pass completes.')}</div></section>` +
      `<section class="rd-section">${secHead('gauge', 'Calibration monitoring')}<div class="rd-grid-2">${emptyCard('gauge', 'No calibration data', 'Reliability and ECE require a scored validation set.')}${emptyCard('bar-chart-3', 'No confidence distribution', 'Confidence bins populate once predictions exist.')}</div></section>` +
      `<section class="rd-section">${secHead('scale', 'Fairness metrics')}<div class="rd-grid-3">${emptyCard('scale', 'Subgroup metrics pending', 'Fitzpatrick, age and location breakdowns need a scored cohort.')}${emptyCard('users', 'Awaiting cohorts', 'De-identified subgroup counts will appear here.')}${emptyCard('map-pin', 'No location data', 'Body-location performance is computed post-evaluation.')}</div></section>` +
      `<section class="rd-section">${secHead('git-compare', 'Drift detection')}<div class="rd-grid-2">${emptyCard('git-compare', 'No reference distribution', 'Drift monitoring activates after this version ships to production and accumulates baseline traffic.')}${emptyCard('inbox', 'Active learning idle', 'The sampling queue starts once the model serves live inferences.')}</div></section>`;
  }
  function skelCard(h) {
    return `<div class="rd-card card"><div class="rd-skel line" style="width:40%;margin-bottom:14px"></div><div class="rd-skel chart" style="height:${h}px"></div></div>`;
  }
  function skeletonBody() {
    const skKpis = `<div class="rd-kpis">${Array(5).fill(0).map(() => `<div class="card rd-skel-kpi"><div class="rd-skel line" style="width:60%"></div><div class="rd-skel" style="height:24px;width:50%"></div><div class="rd-skel line" style="width:75%"></div></div>`).join('')}</div>`;
    const skSec = (icon, title) => `<section class="rd-section">${secHead(icon, title)}<div class="rd-grid-2">${skelCard(220)}${skelCard(220)}</div></section>`;
    return skKpis +
      skSec('activity', 'Model performance') +
      skSec('gauge', 'Calibration monitoring') +
      `<section class="rd-section">${secHead('scale', 'Fairness metrics')}<div class="rd-grid-3">${skelCard(170)}${skelCard(170)}${skelCard(170)}</div></section>` +
      skSec('git-compare', 'Drift detection');
  }

  window.RDS = {
    ic, shell, controls, privacyStrip, banner, secHead, systemHealth,
    kpis, modelPerf, calibration, fairness, pipeline, drift,
    emptyBody, skeletonBody,
  };
})();
