/* ============================================================================
   Research dashboard — view-model builder + state composition.
   buildVM() assembles a fully-resolved vm from {version, range, role, mode};
   renderState() turns a vm into the full app shell. Exposes window.RDVM.
   ============================================================================ */
(function () {
  'use strict';
  const D = window.RD_DATA;
  const RDS = window.RDS;

  /* ── Transforms (version-dependent chart data) ───────────────────────── */
  function transformROC(pts, auc) {
    const shrink = Math.max(0.4, Math.min(1, (auc - 0.5) / (0.927 - 0.5)));
    return pts.map(([f, t]) => [f, +(f + (t - f) * shrink).toFixed(4)]);
  }

  function transformCM(rows, s) {
    if (s >= 0.999) return rows.map((r) => r.slice());
    return rows.map((row, i) => {
      const total = row.reduce((a, b) => a + b, 0);
      const newDiag = row[i] * s;
      const lost = row[i] - newDiag;
      const w = row.map((v, j) => (j === i ? 0 : v + 0.6));
      const wSum = w.reduce((a, b) => a + b, 0) || 1;
      const out = row.map((v, j) => (j === i ? newDiag : v + (lost * w[j]) / wSum));
      const r = out.map((v) => Math.round(v));
      let diff = total - r.reduce((a, b) => a + b, 0);
      let idx = i, best = -1;
      for (let j = 0; j < r.length; j++) if (j !== i && r[j] > best) { best = r[j]; idx = j; }
      r[idx] = Math.max(0, r[idx] + diff);
      return r;
    });
  }

  function scaleFair(f, factor) {
    const grp = (arr) => arr.map((d) => {
      const auc = Math.round(d.auc * factor * 1000) / 1000;
      return { label: d.label, n: d.n, auc, flag: auc < f.target };
    });
    return { target: f.target, fitzpatrick: grp(f.fitzpatrick), age: grp(f.age), location: grp(f.location) };
  }

  function buildKpis(version, mode) {
    const m = D.versionMetrics[version];
    const prev = D.prevVersion[version];
    const pm = prev ? D.versionMetrics[prev] : null;
    return D.kpiDefs.map((def) => {
      const val = m[def.key];
      let value = val.toFixed(def.dp), delta = 'baseline release', deltaDir = 'flat', cls = '';
      if (pm) {
        const dv = val - pm[def.key];
        delta = (dv > 0 ? '+' : '−') + Math.abs(dv).toFixed(def.dp) + ' vs ' + prev;
        const improved = def.lowerBetter ? dv < 0 : dv > 0;
        deltaDir = Math.abs(dv) < 0.0005 ? 'flat' : improved ? 'up' : 'down';
      }
      if (def.key === 'ece' && mode === 'calib') {
        cls = ' amber'; value = D.calibrationSets.drift.ece.toFixed(3);
        delta = '+0.027 vs baseline'; deltaDir = 'down';
      }
      return { key: def.key, label: def.label, icon: def.icon, value, delta, deltaDir, foot: def.foot, cls };
    });
  }

  function mkDrift(v, th, kind) {
    const tone = v >= th.alert ? 'red' : v >= th.warn ? 'amber' : 'green';
    const status = tone === 'red' ? 'Shift exceeds limit' : tone === 'amber' ? 'Shift detected' : 'Stable';
    const note = kind === 'input'
      ? (tone === 'green' ? 'Feature-embedding PSI vs the production reference cohort.' : 'Embedding PSI rose past the warning threshold over the last 72 hours.')
      : (tone === 'green' ? 'Class-mix KL divergence vs the reference prediction distribution.' : 'Predicted class mix has moved sharply toward high-confidence nevi.');
    return { value: v, warn: th.warn, alert: th.alert, max: th.max, tone, status, note };
  }

  function buildDrift(range, mode) {
    const th = D.driftThresholds;
    let inV, outV;
    if (mode === 'drift') { inV = D.driftAlert.input; outV = D.driftAlert.output; }
    else { inV = D.ranges[range].drift.input; outV = D.ranges[range].drift.output; }
    return { input: mkDrift(inV, th.input, 'input'), output: mkDrift(outV, th.output, 'output') };
  }

  function buildQueue(rangeData) {
    const depthNum = parseInt(String(rangeData.queue.depth).replace(/,/g, ''), 10) || 0;
    const reasons = D.queueReasons.map((r) => ({ label: r.label, share: r.share, n: Math.round(r.share * depthNum) }));
    return { pending: rangeData.queue.pending, depth: rangeData.queue.depth, oldest: rangeData.queue.oldest, reasons };
  }

  /* ── buildVM ──────────────────────────────────────────────────────────── */
  function buildVM(opts) {
    const mode = opts.mode || 'full';
    const version = opts.version || 'v3.4.1';
    const range = opts.range || '30d';
    const role = opts.role || 'researcher';
    const vinfo = D.versions.find((v) => v.id === version) || D.versions[1];
    const empty = mode === 'empty' || vinfo.empty;
    const roleCfg = D.roles[role];
    const rangeData = D.ranges[range];
    const m = D.versionMetrics[version] || D.versionMetrics['v3.4.1'];

    const vm = {
      range, role,
      versions: D.versions,
      nav: roleCfg.nav,
      user: roleCfg.user,
      system: D.system,
      flags: { drift: mode === 'drift', calib: mode === 'calib', empty, loading: mode === 'loading' },
      model: {
        version, status: vinfo.status, trained: vinfo.trained,
        evalSet: empty ? '—' : 'held-out · ' + m.evalN + ' images',
        updated: empty ? '— no runs yet' : rangeData.updated,
        window: rangeData.window,
      },
    };
    vm.alertDot = vm.flags.drift || vm.flags.calib;

    if (vm.flags.drift) vm.banner = { tone: 'red', icon: 'alert-octagon', title: 'Output distribution drift detected', desc: 'Predicted class mix has shifted beyond the alert threshold over the last 72 hours. Performance metrics below may be unreliable until reviewed.', action: 'Open drift report' };
    else if (vm.flags.calib) vm.banner = { tone: 'amber', icon: 'alert-triangle', title: 'Calibration drift warning', desc: 'Expected calibration error has risen to 0.061 (from 0.034). The model is becoming overconfident at high probabilities — recalibration is recommended.', action: 'Review calibration' };
    else if (vm.flags.empty) vm.banner = { tone: 'amber', icon: 'info', title: 'No evaluation data yet', desc: 'Model ' + version + ' has been registered but has not completed an evaluation run. Metrics will populate once the held-out benchmark finishes — typically within a few hours of training.', action: 'View run status' };
    else vm.banner = null;

    if (empty) {
      vm.kpis = D.kpiDefs.map((def) => ({ key: def.key, label: def.label, icon: def.icon }));
      return vm;
    }
    if (mode === 'loading') return vm;

    vm.kpis = buildKpis(version, mode);
    vm.rocPts = transformROC(D.roc, m.auc);
    vm.rocAuc = m.auc.toFixed(3);
    vm.cmRows = transformCM(D.cm.rows, m.cmSharp);
    const calKey = mode === 'calib' ? 'drift' : m.cal;
    vm.cal = D.calibrationSets[calKey];
    vm.calHint = mode === 'calib' ? 'Calibration drift — confidence is running ahead of accuracy'
      : (m.cal === 'good' ? 'Confidence is well-aligned with observed accuracy' : 'Mild overconfidence in the highest confidence bins');
    vm.fair = scaleFair(D.fairness, m.fair);
    vm.cam = rangeData.cam;
    vm.queue = buildQueue(rangeData);
    vm.drift = buildDrift(range, mode);
    vm.driftHint = mode === 'drift' ? 'Output shift exceeds limit — investigate before next deploy' : 'Inputs and outputs within reference bounds';
    return vm;
  }

  /* ── Compose body by role ─────────────────────────────────────────────── */
  function composeBody(vm) {
    if (vm.flags.loading) return RDS.skeletonBody();
    if (vm.flags.empty) return RDS.emptyBody(vm);
    if (vm.role === 'admin') {
      return [RDS.systemHealth(vm), RDS.kpis(vm), RDS.modelPerf(vm), RDS.drift(vm), RDS.pipeline(vm)].join('');
    }
    return [RDS.kpis(vm), RDS.modelPerf(vm), RDS.calibration(vm), RDS.fairness(vm), RDS.pipeline(vm), RDS.drift(vm)].join('');
  }

  function renderState(arg) {
    const opts = typeof arg === 'string' ? Object.assign({}, STATES[arg]) : arg;
    const vm = buildVM(opts || {});
    const content = [
      RDS.controls(vm, { live: opts && opts.live }),
      RDS.banner(vm.banner),
      RDS.privacyStrip(),
      composeBody(vm),
    ].join('');
    return RDS.shell(vm, content);
  }

  const STATES = {
    loading: { mode: 'loading' },
    populated: { mode: 'full' },
    empty: { mode: 'empty', version: 'v4.0.0-rc1' },
    drift: { mode: 'drift' },
    calib: { mode: 'calib' },
  };

  window.RDVM = { buildVM, renderState, STATES };
})();
