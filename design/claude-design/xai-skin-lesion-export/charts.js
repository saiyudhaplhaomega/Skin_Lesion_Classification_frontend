/* ============================================================================
   Skin Lesion XAI — Research dashboard chart helpers
   Pure SVG generators. No external libs. Clinical-Premium styling:
   teal accent series, muted grid, status colors only for meaning, no decoration.
   Every function returns an SVG string. Colors reference CSS custom properties.
   ============================================================================ */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const fmtPct = (v) => (v * 100).toFixed(0) + '%';

  // Map a value in [d0,d1] to a pixel in [p0,p1]
  const scale = (v, d0, d1, p0, p1) => p0 + ((v - d0) / (d1 - d0)) * (p1 - p0);

  /* ── ROC curve ──────────────────────────────────────────────────────────
     pts: array of [fpr, tpr] in 0..1. auc annotation drawn separately by caller. */
  function rocCurve(pts, opts = {}) {
    const W = opts.w || 300, H = opts.h || 240;
    const m = { t: 14, r: 14, b: 34, l: 38 };
    const x = (v) => scale(v, 0, 1, m.l, W - m.r);
    const y = (v) => scale(v, 0, 1, H - m.b, m.t);
    const grid = [];
    for (let g = 0; g <= 1.0001; g += 0.25) {
      grid.push(`<line x1="${x(g)}" y1="${m.t}" x2="${x(g)}" y2="${H - m.b}" class="rd-grid"/>`);
      grid.push(`<line x1="${m.l}" y1="${y(g)}" x2="${W - m.r}" y2="${y(g)}" class="rd-grid"/>`);
    }
    const chance = `<line x1="${x(0)}" y1="${y(0)}" x2="${x(1)}" y2="${y(1)}" class="rd-ref"/>`;
    const area = 'M' + pts.map((p) => `${x(p[0])},${y(p[1])}`).join(' L ') +
      ` L ${x(1)},${y(0)} L ${x(0)},${y(0)} Z`;
    const line = 'M' + pts.map((p) => `${x(p[0])},${y(p[1])}`).join(' L ');
    const ticks = [0, 0.5, 1].map((t) =>
      `<text x="${x(t)}" y="${H - m.b + 16}" class="rd-tick" text-anchor="middle">${t}</text>` +
      `<text x="${m.l - 7}" y="${y(t) + 3}" class="rd-tick" text-anchor="end">${t}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="rd-chart" role="img" aria-label="ROC curve">
      ${grid.join('')}
      <path d="${area}" class="rd-area"/>
      ${chance}
      <path d="${line}" class="rd-series"/>
      <line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${H - m.b}" class="rd-axis"/>
      <line x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}" class="rd-axis"/>
      ${ticks}
      <text x="${(m.l + W - m.r) / 2}" y="${H - 4}" class="rd-axlab" text-anchor="middle">False positive rate</text>
      <text transform="translate(11 ${(m.t + H - m.b) / 2}) rotate(-90)" class="rd-axlab" text-anchor="middle">True positive rate</text>
    </svg>`;
  }

  /* ── Reliability / calibration diagram ──────────────────────────────────
     bins: array of {p: meanPredicted, a: observedAccuracy} in 0..1. */
  function reliability(bins, opts = {}) {
    const W = opts.w || 300, H = opts.h || 240;
    const m = { t: 14, r: 14, b: 34, l: 38 };
    const x = (v) => scale(v, 0, 1, m.l, W - m.r);
    const y = (v) => scale(v, 0, 1, H - m.b, m.t);
    const grid = [];
    for (let g = 0; g <= 1.0001; g += 0.25) {
      grid.push(`<line x1="${x(g)}" y1="${m.t}" x2="${x(g)}" y2="${H - m.b}" class="rd-grid"/>`);
      grid.push(`<line x1="${m.l}" y1="${y(g)}" x2="${W - m.r}" y2="${y(g)}" class="rd-grid"/>`);
    }
    const perfect = `<line x1="${x(0)}" y1="${y(0)}" x2="${x(1)}" y2="${y(1)}" class="rd-ref"/>`;
    // gap bars between predicted and observed
    const gaps = bins.map((b) => {
      const cls = b.a < b.p ? 'rd-gap-over' : 'rd-gap-under';
      return `<line x1="${x(b.p)}" y1="${y(b.p)}" x2="${x(b.p)}" y2="${y(b.a)}" class="${cls}"/>`;
    }).join('');
    const line = 'M' + bins.map((b) => `${x(b.p)},${y(b.a)}`).join(' L ');
    const dots = bins.map((b) => `<circle cx="${x(b.p)}" cy="${y(b.a)}" r="3.2" class="rd-dot"/>`).join('');
    const ticks = [0, 0.5, 1].map((t) =>
      `<text x="${x(t)}" y="${H - m.b + 16}" class="rd-tick" text-anchor="middle">${t}</text>` +
      `<text x="${m.l - 7}" y="${y(t) + 3}" class="rd-tick" text-anchor="end">${t}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="rd-chart" role="img" aria-label="Calibration reliability diagram">
      ${grid.join('')}
      ${perfect}
      ${gaps}
      <path d="${line}" class="rd-series"/>
      ${dots}
      <line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${H - m.b}" class="rd-axis"/>
      <line x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}" class="rd-axis"/>
      ${ticks}
      <text x="${(m.l + W - m.r) / 2}" y="${H - 4}" class="rd-axlab" text-anchor="middle">Mean predicted confidence</text>
      <text transform="translate(11 ${(m.t + H - m.b) / 2}) rotate(-90)" class="rd-axlab" text-anchor="middle">Observed accuracy</text>
    </svg>`;
  }

  /* ── Time-series line (CAM quality over weeks) ──────────────────────────
     series: array of {x: label, v: value 0..1}. band: {lo, hi} target band. */
  function trendLine(series, opts = {}) {
    const W = opts.w || 640, H = opts.h || 200;
    const m = { t: 16, r: 16, b: 30, l: 40 };
    const lo = opts.min != null ? opts.min : 0.8, hi = opts.max != null ? opts.max : 1;
    const x = (i) => scale(i, 0, series.length - 1, m.l, W - m.r);
    const y = (v) => scale(v, lo, hi, H - m.b, m.t);
    const yticks = [];
    const step = (hi - lo) / 4;
    for (let v = lo; v <= hi + 1e-6; v += step) {
      yticks.push(`<line x1="${m.l}" y1="${y(v)}" x2="${W - m.r}" y2="${y(v)}" class="rd-grid"/>`);
      yticks.push(`<text x="${m.l - 7}" y="${y(v) + 3}" class="rd-tick" text-anchor="end">${fmtPct(v)}</text>`);
    }
    let bandRect = '';
    if (opts.band) {
      bandRect = `<rect x="${m.l}" y="${y(opts.band.hi)}" width="${W - m.r - m.l}" height="${y(opts.band.lo) - y(opts.band.hi)}" class="rd-target-band"/>` +
        `<line x1="${m.l}" y1="${y(opts.band.lo)}" x2="${W - m.r}" y2="${y(opts.band.lo)}" class="rd-ref"/>`;
    }
    const line = 'M' + series.map((d, i) => `${x(i)},${y(d.v)}`).join(' L ');
    const dots = series.map((d, i) => {
      const warn = opts.band && d.v < opts.band.lo;
      return `<circle cx="${x(i)}" cy="${y(d.v)}" r="3" class="rd-dot${warn ? ' warn' : ''}"/>`;
    }).join('');
    const xlabs = series.map((d, i) =>
      (i % opts.xevery === 0 || i === series.length - 1)
        ? `<text x="${x(i)}" y="${H - m.b + 16}" class="rd-tick" text-anchor="middle">${d.x}</text>` : '').join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="rd-chart" preserveAspectRatio="none" role="img" aria-label="${opts.aria || 'Trend over time'}">
      ${bandRect}
      ${yticks.join('')}
      <path d="${line}" class="rd-series"/>
      ${dots}
      <line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${H - m.b}" class="rd-axis"/>
      <line x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}" class="rd-axis"/>
      ${xlabs}
    </svg>`;
  }

  /* ── Confidence distribution vs accuracy (grouped) ──────────────────────
     bins: array of {label, share 0..1, acc 0..1, conf 0..1}. */
  function confidenceDist(bins, opts = {}) {
    const W = opts.w || 640, H = opts.h || 220;
    const m = { t: 16, r: 16, b: 38, l: 40 };
    const bw = (W - m.l - m.r) / bins.length;
    const yL = (v) => scale(v, 0, 1, H - m.b, m.t); // share axis 0..max
    const maxShare = Math.max(...bins.map((b) => b.share));
    const yShare = (v) => scale(v, 0, maxShare * 1.15, H - m.b, m.t);
    const yAcc = (v) => scale(v, 0, 1, H - m.b, m.t);
    const grid = [];
    for (let g = 0; g <= 1.0001; g += 0.25) {
      grid.push(`<line x1="${m.l}" y1="${yAcc(g)}" x2="${W - m.r}" y2="${yAcc(g)}" class="rd-grid"/>`);
      grid.push(`<text x="${W - m.r + 4}" y="${yAcc(g) + 3}" class="rd-tick" text-anchor="start">${g.toFixed(1)}</text>`);
    }
    const bars = bins.map((b, i) => {
      const cx = m.l + i * bw;
      const h = (H - m.b) - yShare(b.share);
      return `<rect x="${cx + bw * 0.22}" y="${yShare(b.share)}" width="${bw * 0.56}" height="${Math.max(h, 0)}" class="rd-bar-soft" rx="2"/>`;
    }).join('');
    // accuracy line + ideal (acc == conf) markers
    const accLine = 'M' + bins.map((b, i) => `${m.l + i * bw + bw / 2},${yAcc(b.acc)}`).join(' L ');
    const idealDots = bins.map((b, i) => `<circle cx="${m.l + i * bw + bw / 2}" cy="${yAcc(b.conf)}" r="2.6" class="rd-ideal-dot"/>`).join('');
    const accDots = bins.map((b, i) => {
      const over = b.conf - b.acc > 0.05;
      return `<circle cx="${m.l + i * bw + bw / 2}" cy="${yAcc(b.acc)}" r="3" class="rd-dot${over ? ' warn' : ''}"/>`;
    }).join('');
    const xlabs = bins.map((b, i) =>
      `<text x="${m.l + i * bw + bw / 2}" y="${H - m.b + 16}" class="rd-tick" text-anchor="middle">${b.label}</text>`).join('');
    return `<svg viewBox="0 0 ${W} ${H}" class="rd-chart" preserveAspectRatio="none" role="img" aria-label="Confidence distribution versus accuracy">
      ${grid.join('')}
      ${bars}
      ${idealDots}
      <path d="${accLine}" class="rd-series"/>
      ${accDots}
      <line x1="${m.l}" y1="${m.t}" x2="${m.l}" y2="${H - m.b}" class="rd-axis"/>
      <line x1="${m.l}" y1="${H - m.b}" x2="${W - m.r}" y2="${H - m.b}" class="rd-axis"/>
      ${xlabs}
      <text x="${(m.l + W - m.r) / 2}" y="${H - 4}" class="rd-axlab" text-anchor="middle">Predicted confidence bin</text>
    </svg>`;
  }

  /* ── PSI / drift mini gauge (horizontal threshold bar) ──────────────────
     value, thresholds {warn, alert}, max. tone resolved by caller. */
  function driftBar(value, opts = {}) {
    const W = opts.w || 280, H = 48;
    const max = opts.max || 0.5;
    const x = (v) => scale(Math.min(v, max), 0, max, 8, W - 8);
    const warn = opts.warn, alert = opts.alert;
    const tone = value >= alert ? 'var(--red)' : value >= warn ? 'var(--amber)' : 'var(--green)';
    return `<svg viewBox="0 0 ${W} ${H}" class="rd-driftbar" preserveAspectRatio="none" role="img" aria-label="Distribution shift index ${value}">
      <rect x="8" y="20" width="${W - 16}" height="8" rx="4" class="rd-track"/>
      <rect x="8" y="20" width="${x(value) - 8}" height="8" rx="4" fill="${tone}"/>
      <line x1="${x(warn)}" y1="14" x2="${x(warn)}" y2="34" class="rd-thresh"/>
      <line x1="${x(alert)}" y1="14" x2="${x(alert)}" y2="34" class="rd-thresh"/>
      <text x="${x(warn)}" y="44" class="rd-tick" text-anchor="middle">${warn}</text>
      <text x="${x(alert)}" y="44" class="rd-tick" text-anchor="middle">${alert}</text>
      <circle cx="${x(value)}" cy="24" r="5.5" fill="${tone}" stroke="#fff" stroke-width="1.5"/>
    </svg>`;
  }

  global.RDCharts = { rocCurve, reliability, trendLine, confidenceDist, driftBar };
})(window);
