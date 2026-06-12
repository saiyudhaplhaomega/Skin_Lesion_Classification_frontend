/* ============================================================================
   Research dashboard — aggregate, de-identified data model.
   NOTHING here is patient-level. Every figure is a cohort aggregate computed
   on a held-out evaluation set, or a system-level operational metric.
   Class labels follow the HAM10000 taxonomy.
   ============================================================================ */
window.RD_DATA = {
  /* ── Model versions (eval metrics are pinned to a version) ───────────── */
  versions: [
    { id: 'v4.0.0-rc1', trained: '2026-06-04', status: 'Release candidate', empty: true },
    { id: 'v3.4.1', trained: '2026-04-18', status: 'Production' },
    { id: 'v3.3.0', trained: '2026-02-02', status: 'Archived' },
    { id: 'v3.2.0', trained: '2025-11-20', status: 'Archived' },
  ],
  prevVersion: { 'v3.4.1': 'v3.3.0', 'v3.3.0': 'v3.2.0', 'v3.2.0': null },
  versionMetrics: {
    'v3.4.1': { auc: 0.927, sens: 0.891, spec: 0.882, f1: 0.864, ece: 0.034, temp: 1.12, fair: 1.00, cmSharp: 1.00, cal: 'good', evalN: '14,302' },
    'v3.3.0': { auc: 0.913, sens: 0.872, spec: 0.869, f1: 0.846, ece: 0.045, temp: 1.20, fair: 0.986, cmSharp: 0.92, cal: 'mid',  evalN: '13,940' },
    'v3.2.0': { auc: 0.898, sens: 0.853, spec: 0.851, f1: 0.825, ece: 0.057, temp: 1.31, fair: 0.972, cmSharp: 0.84, cal: 'low',  evalN: '13,512' },
  },

  kpiDefs: [
    { key: 'auc',  label: 'AUC-ROC',           icon: 'activity',    foot: 'macro, one-vs-rest', dp: 3 },
    { key: 'sens', label: 'Sensitivity',       icon: 'trending-up', foot: 'recall, malignant classes', dp: 3 },
    { key: 'spec', label: 'Specificity',       icon: 'shield',      foot: 'true-negative rate', dp: 3 },
    { key: 'f1',   label: 'Macro F1',          icon: 'target',      foot: 'unweighted mean', dp: 3 },
    { key: 'ece',  label: 'Calibration · ECE', icon: 'gauge',       foot: 'lower is better', dp: 3, lowerBetter: true },
  ],

  roc: [[0,0],[0.02,0.45],[0.04,0.62],[0.07,0.74],[0.12,0.83],[0.18,0.88],[0.28,0.92],[0.42,0.95],[0.6,0.975],[0.8,0.99],[1,1]],

  cm: {
    classes: [
      { id: 'nv', name: 'Melanocytic nevi' }, { id: 'mel', name: 'Melanoma' },
      { id: 'bkl', name: 'Benign keratosis' }, { id: 'bcc', name: 'Basal cell carcinoma' },
      { id: 'akiec', name: 'Actinic keratoses' }, { id: 'vasc', name: 'Vascular' },
      { id: 'df', name: 'Dermatofibroma' },
    ],
    rows: [
      [96, 1, 2, 0, 0, 1, 0], [9, 82, 5, 2, 2, 0, 0], [6, 4, 84, 2, 3, 0, 1],
      [1, 2, 3, 89, 4, 1, 0], [2, 3, 6, 7, 80, 0, 2], [2, 0, 1, 1, 0, 95, 1],
      [3, 1, 4, 1, 2, 1, 88],
    ],
  },

  calibrationSets: {
    good: { ece: 0.034, mce: 0.071, brier: 0.087, temperature: 1.12,
      reliability: [{ p: 0.55, a: 0.57 }, { p: 0.65, a: 0.66 }, { p: 0.75, a: 0.73 }, { p: 0.85, a: 0.81 }, { p: 0.95, a: 0.90 }],
      dist: [{ label: '0.5–0.6', share: 0.08, acc: 0.57, conf: 0.55 }, { label: '0.6–0.7', share: 0.12, acc: 0.66, conf: 0.65 }, { label: '0.7–0.8', share: 0.19, acc: 0.74, conf: 0.75 }, { label: '0.8–0.9', share: 0.28, acc: 0.82, conf: 0.85 }, { label: '0.9–1.0', share: 0.33, acc: 0.90, conf: 0.96 }] },
    mid: { ece: 0.045, mce: 0.089, brier: 0.096, temperature: 1.20,
      reliability: [{ p: 0.55, a: 0.56 }, { p: 0.65, a: 0.64 }, { p: 0.75, a: 0.71 }, { p: 0.85, a: 0.78 }, { p: 0.95, a: 0.87 }],
      dist: [{ label: '0.5–0.6', share: 0.07, acc: 0.56, conf: 0.55 }, { label: '0.6–0.7', share: 0.11, acc: 0.64, conf: 0.66 }, { label: '0.7–0.8', share: 0.18, acc: 0.71, conf: 0.76 }, { label: '0.8–0.9', share: 0.29, acc: 0.79, conf: 0.86 }, { label: '0.9–1.0', share: 0.35, acc: 0.87, conf: 0.96 }] },
    low: { ece: 0.057, mce: 0.108, brier: 0.101, temperature: 1.31,
      reliability: [{ p: 0.55, a: 0.55 }, { p: 0.65, a: 0.62 }, { p: 0.75, a: 0.69 }, { p: 0.85, a: 0.76 }, { p: 0.95, a: 0.85 }],
      dist: [{ label: '0.5–0.6', share: 0.06, acc: 0.55, conf: 0.55 }, { label: '0.6–0.7', share: 0.10, acc: 0.62, conf: 0.66 }, { label: '0.7–0.8', share: 0.17, acc: 0.69, conf: 0.77 }, { label: '0.8–0.9', share: 0.30, acc: 0.76, conf: 0.87 }, { label: '0.9–1.0', share: 0.37, acc: 0.85, conf: 0.97 }] },
    drift: { ece: 0.061, mce: 0.118, brier: 0.104, temperature: 1.34,
      reliability: [{ p: 0.55, a: 0.55 }, { p: 0.65, a: 0.62 }, { p: 0.75, a: 0.68 }, { p: 0.85, a: 0.75 }, { p: 0.95, a: 0.84 }],
      dist: [{ label: '0.5–0.6', share: 0.06, acc: 0.55, conf: 0.55 }, { label: '0.6–0.7', share: 0.10, acc: 0.62, conf: 0.66 }, { label: '0.7–0.8', share: 0.17, acc: 0.68, conf: 0.76 }, { label: '0.8–0.9', share: 0.29, acc: 0.75, conf: 0.86 }, { label: '0.9–1.0', share: 0.38, acc: 0.84, conf: 0.97 }] },
  },

  fairness: {
    target: 0.90,
    fitzpatrick: [
      { label: 'Type I', n: 1420, auc: 0.93 }, { label: 'Type II', n: 3180, auc: 0.94 },
      { label: 'Type III', n: 2740, auc: 0.92 }, { label: 'Type IV', n: 1560, auc: 0.91 },
      { label: 'Type V', n: 640, auc: 0.88 }, { label: 'Type VI', n: 310, auc: 0.86 },
    ],
    age: [
      { label: 'Under 30', n: 1290, auc: 0.91 }, { label: '30–49', n: 3110, auc: 0.93 },
      { label: '50–69', n: 3540, auc: 0.92 }, { label: '70+', n: 1910, auc: 0.90 },
    ],
    location: [
      { label: 'Trunk', n: 3200, auc: 0.94 }, { label: 'Upper limb', n: 2480, auc: 0.93 },
      { label: 'Lower limb', n: 1870, auc: 0.91 }, { label: 'Face', n: 1420, auc: 0.90 },
      { label: 'Scalp / neck', n: 720, auc: 0.89 }, { label: 'Palms / soles', n: 360, auc: 0.85 },
    ],
  },

  /* ── Date-range scoped monitoring windows ────────────────────────────── */
  ranges: {
    '7d':  { window: 'Last 7 days',  updated: '2026-06-06 04:12 UTC',
      cam: { current: 0.944, target: 0.93, series: [{x:'Sun',v:.951},{x:'Mon',v:.948},{x:'Tue',v:.955},{x:'Wed',v:.946},{x:'Thu',v:.952},{x:'Fri',v:.940},{x:'Sat',v:.944}] },
      queue: { pending: 96, depth: '1,180', oldest: 6 },
      drift: { input: 0.05, output: 0.03 } },
    '30d': { window: 'Last 30 days', updated: '2026-06-06 04:12 UTC',
      cam: { current: 0.944, target: 0.93, series: [{x:'W1',v:.950},{x:'W2',v:.953},{x:'W3',v:.948},{x:'W4',v:.945},{x:'W5',v:.941},{x:'W6',v:.944}] },
      queue: { pending: 142, depth: '1,284', oldest: 11 },
      drift: { input: 0.06, output: 0.04 } },
    '90d': { window: 'Last 90 days', updated: '2026-06-06 04:12 UTC',
      cam: { current: 0.944, target: 0.93, series: [{x:'W1',v:.945},{x:'W2',v:.951},{x:'W3',v:.948},{x:'W4',v:.955},{x:'W5',v:.952},{x:'W6',v:.958},{x:'W7',v:.949},{x:'W8',v:.954},{x:'W9',v:.947},{x:'W10',v:.942},{x:'W11',v:.939},{x:'W12',v:.944}] },
      queue: { pending: 142, depth: '1,284', oldest: 11 },
      drift: { input: 0.07, output: 0.05 } },
    'YTD': { window: 'Year to date', updated: '2026-06-06 04:12 UTC',
      cam: { current: 0.944, target: 0.93, series: [{x:'Jan',v:.947},{x:'Feb',v:.952},{x:'Mar',v:.949},{x:'Apr',v:.955},{x:'May',v:.943},{x:'Jun',v:.944}] },
      queue: { pending: 168, depth: '1,420', oldest: 14 },
      drift: { input: 0.08, output: 0.06 } },
  },

  queueReasons: [
    { label: 'High model uncertainty', share: 0.48 },
    { label: 'Near decision boundary', share: 0.30 },
    { label: 'Low CAM quality', share: 0.14 },
    { label: 'Fairness sampling (Fitzpatrick V–VI)', share: 0.09 },
  ],

  driftThresholds: { input: { warn: 0.1, alert: 0.25, max: 0.4 }, output: { warn: 0.1, alert: 0.20, max: 0.4 } },
  driftAlert: { input: 0.14, output: 0.23 },

  /* ── Roles ───────────────────────────────────────────────────────────── */
  roles: {
    researcher: {
      label: 'Researcher',
      user: { init: 'RK', name: 'R. Okonkwo', role: 'ML Research · read-only PHI' },
      nav: [
        { group: 'Monitoring', items: [
          { icon: 'layout-dashboard', label: 'Overview', active: true },
          { icon: 'activity', label: 'Model performance' },
          { icon: 'scale', label: 'Fairness' },
          { icon: 'gauge', label: 'Calibration' },
          { icon: 'git-compare', label: 'Drift detection' },
        ]},
        { group: 'Pipeline', items: [
          { icon: 'inbox', label: 'Active learning' },
          { icon: 'layers', label: 'CAM quality' },
          { icon: 'database', label: 'Data sources' },
        ]},
        { group: 'Platform', items: [
          { icon: 'scroll-text', label: 'Audit log' },
          { icon: 'sliders-horizontal', label: 'Settings' },
        ]},
      ],
    },
    admin: {
      label: 'Administrator',
      user: { init: 'AM', name: 'A. Mbeki', role: 'Platform admin · cloud ops' },
      nav: [
        { group: 'Operations', items: [
          { icon: 'layout-dashboard', label: 'Overview', active: true },
          { icon: 'server', label: 'System health' },
          { icon: 'activity', label: 'Model performance' },
          { icon: 'git-compare', label: 'Drift detection' },
        ]},
        { group: 'Administration', items: [
          { icon: 'users', label: 'User management' },
          { icon: 'flag', label: 'Feature flags' },
          { icon: 'cloud', label: 'Environments' },
          { icon: 'scroll-text', label: 'Audit log' },
        ]},
      ],
    },
  },

  system: [
    { label: 'Serving status', value: 'Operational', tone: 'green', icon: 'check-circle', sub: 'all replicas healthy' },
    { label: 'Inference p95 latency', value: '142', unit: 'ms', icon: 'timer', sub: 'target < 250 ms' },
    { label: 'Throughput', value: '1,240', unit: 'req/min', icon: 'gauge', sub: '6 GPU replicas' },
    { label: 'Inference error rate', value: '0.12', unit: '%', icon: 'alert-triangle', sub: 'last 24 h' },
    { label: 'GPU utilization', value: '61', unit: '%', icon: 'cpu', sub: 'us-east-1 cluster' },
    { label: 'Live model', value: 'v3.4.1', icon: 'box', sub: 'deployed 2026-04-22' },
  ],
};
