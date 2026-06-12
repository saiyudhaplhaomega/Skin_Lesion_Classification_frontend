// Silhouette.jsx — gender-neutral, anatomically-abstract body map.
// One coordinate space (viewBox 0 0 440 500), body centered at x=220.
// Exposes: REGIONS_FRONT/BACK, LABELS_FRONT/BACK, Silhouette, Pin, pct().

/* ── Region geometry (capsule segments) ───────────────────────────────── */
// shape kinds: {t:'rect',x,y,w,h,rx} | {t:'circle',cx,cy,r} | {t:'path',d}
const HEAD = [{ t: 'circle', cx: 220, cy: 46, r: 27 }, { t: 'rect', x: 207, y: 68, w: 26, h: 18, rx: 9 }];
const ARM_R = [{ t: 'rect', x: 150, y: 90, w: 28, h: 150, rx: 14 }];   // viewer-left = patient right
const ARM_L = [{ t: 'rect', x: 262, y: 90, w: 28, h: 150, rx: 14 }];
const HAND_R = [{ t: 'rect', x: 148, y: 244, w: 32, h: 32, rx: 14 }];
const HAND_L = [{ t: 'rect', x: 260, y: 244, w: 32, h: 32, rx: 14 }];
const LEG_R = [{ t: 'rect', x: 184, y: 250, w: 34, h: 192, rx: 16 }];
const LEG_L = [{ t: 'rect', x: 222, y: 250, w: 34, h: 192, rx: 16 }];
const FOOT_R = [{ t: 'rect', x: 180, y: 446, w: 38, h: 26, rx: 11 }];
const FOOT_L = [{ t: 'rect', x: 222, y: 446, w: 38, h: 26, rx: 11 }];
const TORSO = [{ t: 'rect', x: 182, y: 86, w: 76, h: 165, rx: 24 }];
const UPPER_BACK = [{ t: 'path', d: 'M182,170 L182,110 Q182,86 206,86 L234,86 Q258,86 258,110 L258,170 Z' }];
const LOWER_BACK = [{ t: 'path', d: 'M182,170 L258,170 L258,227 Q258,251 234,251 L206,251 Q182,251 182,227 Z' }];

const REGIONS_FRONT = [
  { id: 'head', label: 'Head & neck', shapes: HEAD },
  { id: 'torso', label: 'Torso', shapes: TORSO },
  { id: 'arm-r', label: 'Right arm', shapes: ARM_R },
  { id: 'arm-l', label: 'Left arm', shapes: ARM_L },
  { id: 'hand-r', label: 'Right hand', shapes: HAND_R },
  { id: 'hand-l', label: 'Left hand', shapes: HAND_L },
  { id: 'leg-r', label: 'Right leg', shapes: LEG_R },
  { id: 'leg-l', label: 'Left leg', shapes: LEG_L },
  { id: 'foot-r', label: 'Right foot', shapes: FOOT_R },
  { id: 'foot-l', label: 'Left foot', shapes: FOOT_L },
];
const REGIONS_BACK = [
  { id: 'head', label: 'Head & neck', shapes: HEAD },
  { id: 'upper-back', label: 'Upper back', shapes: UPPER_BACK },
  { id: 'lower-back', label: 'Lower back', shapes: LOWER_BACK },
  { id: 'arm-r', label: 'Right arm', shapes: ARM_R },
  { id: 'arm-l', label: 'Left arm', shapes: ARM_L },
  { id: 'hand-r', label: 'Right hand', shapes: HAND_R },
  { id: 'hand-l', label: 'Left hand', shapes: HAND_L },
  { id: 'leg-r', label: 'Right leg', shapes: LEG_R },
  { id: 'leg-l', label: 'Left leg', shapes: LEG_L },
  { id: 'foot-r', label: 'Right foot', shapes: FOOT_R },
  { id: 'foot-l', label: 'Left foot', shapes: FOOT_L },
];

// leader-line labels (single right-hand column) — text:[x,y], to:[x,y]
const LABELS_FRONT = [
  { text: 'Head & neck', x: 302, y: 42, to: [247, 50] },
  { text: 'Arms', x: 302, y: 118, to: [290, 150] },
  { text: 'Torso', x: 302, y: 200, to: [258, 196] },
  { text: 'Hands', x: 302, y: 262, to: [260, 260] },
  { text: 'Legs', x: 302, y: 360, to: [256, 360] },
  { text: 'Feet', x: 302, y: 460, to: [260, 458] },
];
const LABELS_BACK = [
  { text: 'Head & neck', x: 302, y: 42, to: [247, 50] },
  { text: 'Arms', x: 302, y: 110, to: [290, 145] },
  { text: 'Upper back', x: 302, y: 162, to: [258, 158] },
  { text: 'Lower back', x: 302, y: 220, to: [258, 216] },
  { text: 'Hands', x: 302, y: 276, to: [260, 262] },
  { text: 'Legs', x: 302, y: 362, to: [256, 360] },
  { text: 'Feet', x: 302, y: 460, to: [260, 458] },
];

function pct(x, y) { return { left: (x / 440 * 100) + '%', top: (y / 500 * 100) + '%' }; }

function Shape({ s }) {
  if (s.t === 'circle') return <circle className="seg-shape" cx={s.cx} cy={s.cy} r={s.r} />;
  if (s.t === 'path') return <path className="seg-shape" d={s.d} />;
  return <rect className="seg-shape" x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} />;
}

// view: 'front' | 'back'; sel: region id highlighted; dimExcept: highlight one, dim rest;
// locked: non-interactive (detail views); onRegion(id,label)
function Silhouette({ view = 'front', sel, locked, onRegion }) {
  const regions = view === 'back' ? REGIONS_BACK : REGIONS_FRONT;
  const labels = view === 'back' ? LABELS_BACK : LABELS_FRONT;
  return (
    <svg className={'silh' + (locked ? ' locked' : '')} viewBox="0 0 440 500" role="img"
         aria-label={'Gender-neutral body map, ' + view + ' view'}>
      {/* leader labels */}
      <g className="bm-labels" aria-hidden="true">
        {labels.map((l, i) => (
          <g key={i}>
            <line className="bm-leader" x1={300} y1={l.y - 4} x2={l.to[0]} y2={l.to[1]} />
            <circle className="bm-leader-dot" cx={l.to[0]} cy={l.to[1]} r={2} />
            <text className="bm-rlabel" x={l.x} y={l.y} dominantBaseline="middle">{l.text}</text>
          </g>
        ))}
      </g>
      {/* spine reference on back view */}
      {view === 'back' && <line className="bm-spine" x1={220} y1={92} x2={220} y2={246} aria-hidden="true" />}
      {/* regions */}
      {regions.map(r => (
        <g key={r.id}
           className={'bm-region' + (sel === r.id ? ' sel' : '')}
           role={locked ? 'img' : 'button'}
           tabIndex={locked ? undefined : 0}
           aria-label={locked ? undefined : ('Log a lesion on ' + r.label.toLowerCase())}
           onClick={locked ? undefined : () => onRegion && onRegion(r.id, r.label)}
           onKeyDown={locked ? undefined : (e) => { if ((e.key === 'Enter' || e.key === ' ') && onRegion) { e.preventDefault(); onRegion(r.id, r.label); } }}>
          {r.shapes.map((s, i) => <Shape key={i} s={s} />)}
        </g>
      ))}
    </svg>
  );
}

// HTML pin marker overlaid on the stage. p: {n,x,y,status}; active; ghost; showPreview; preview {loc,date,images,statusLabel,statusIcon}
function Pin({ p, active, ghost, showPreview, preview, onClick }) {
  const cls = ['bm-pin', p.status || '', active ? 'active' : '', ghost ? 'ghost' : '', showPreview ? 'show-preview' : ''].filter(Boolean).join(' ');
  return (
    <button className={cls} style={pct(p.x, p.y)} onClick={onClick} aria-label={preview ? ('Lesion ' + p.n + ', ' + preview.loc) : ('Pin ' + p.n)}>
      {preview && (
        <span className="bm-preview" role="tooltip">
          <span className="pv-top">
            <span className="pv-loc">{preview.loc}</span>
            <span className="pv-pin">#{p.n}</span>
          </span>
          <Chip tone={p.status} icon={preview.statusIcon}>{preview.statusLabel}</Chip>
          <span className="pv-meta">
            <span><Icon name="calendar" size={12} />{preview.date}</span>
            <span><Icon name="image" size={12} />{preview.images} photos</span>
          </span>
        </span>
      )}
      <span className="dot">{p.n}</span>
    </button>
  );
}

Object.assign(window, { REGIONS_FRONT, REGIONS_BACK, LABELS_FRONT, LABELS_BACK, pct, Silhouette, Pin });
