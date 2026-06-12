// Upload & Analysis Flow — patient-facing state frames
const { useState } = React;

/* ── Frame + screen chrome ──────────────────────────────────────────── */
function Frame({ num, name, desc, children }) {
  return (
    <div className="frame">
      <div className="frame-label">
        <span className="frame-num">{num}</span>
        <div className="frame-meta">
          <div className="fname">{name}</div>
          <div className="fdesc">{desc}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function Screen({ title, back = true, privacy = true, children }) {
  return (
    <div className="screen" data-screen-label={title}>
      <div className="sbar">
        <span>9:41</span>
        <span className="dots"><i></i><i></i><i></i><span className="battery"></span></span>
      </div>
      <div className="app-bar">
        {back && <button className="nav-btn" aria-label="Go back"><Icon name="chevron-left" size={18} /></button>}
        <span className="title">{title}</span>
        {privacy && <span className="privacy-tag"><Icon name="shield-check" size={13} />On-device</span>}
      </div>
      <div className="screen-body">{children}</div>
    </div>
  );
}

// step: 0 upload · 1 quality · 2 result.  fail = mark current step as needing attention
function Stepper({ step }) {
  const items = [
    { n: 'Upload', i: 'upload' },
    { n: 'Quality', i: 'scan-line' },
    { n: 'Result', i: 'sparkles' },
  ];
  return (
    <div className="stepper">
      {items.map((it, i) => (
        <React.Fragment key={it.n}>
          <div className={`st ${step > i ? 'done' : ''} ${step === i ? 'active' : ''}`}>
            <span className="sd">{step > i ? <Icon name="check" size={12} color="#fff" /> : i + 1}</span>
            {it.n}
          </div>
          {i < items.length - 1 && <div className={`ln ${step > i ? 'done' : ''}`}></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Grad-CAM viewer ────────────────────────────────────────────────── */
function Stage({ mode, opacity }) {
  return (
    <div className="viewer-stage">
      {(mode === 'original' || mode === 'overlay') && (
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, #c9a890 0%, #b8917a 30%, #8f6f5e 70%, #6b5346 100%)' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 48% 47%, rgba(60,40,32,.55) 0%, rgba(60,40,32,0) 26%)' }} />
        </div>
      )}
      {mode === 'heatmap' && <div style={{ position: 'absolute', inset: 0, background: '#0c1016' }} />}
      <div className="heat" style={{
        position: 'absolute', inset: 0,
        opacity: mode === 'heatmap' ? 1 : (mode === 'overlay' ? opacity / 100 : 0),
        background: 'radial-gradient(circle at 48% 47%, rgba(255,60,40,.95) 0%, rgba(255,170,30,.8) 14%, rgba(120,220,90,.55) 30%, rgba(40,120,220,.4) 48%, rgba(20,30,90,0) 70%)',
      }} />
    </div>
  );
}

function GradCamViewer() {
  const [mode, setMode] = useState('overlay');
  const [op, setOp] = useState(65);
  return (
    <div className="viewer">
      <Stage mode={mode} opacity={op} />
      <div className="viewer-bar">
        <div className="seg" role="tablist" aria-label="View mode">
          <button className={mode === 'original' ? 'on' : ''} onClick={() => setMode('original')}>Original</button>
          <button className={mode === 'heatmap' ? 'on' : ''} onClick={() => setMode('heatmap')}>Heatmap</button>
          <button className={mode === 'overlay' ? 'on' : ''} onClick={() => setMode('overlay')}>Overlay</button>
        </div>
        <label className="opacity-ctrl">
          Opacity
          <input type="range" min="0" max="100" value={op} disabled={mode !== 'overlay'} onChange={e => setOp(+e.target.value)} />
        </label>
      </div>
    </div>
  );
}

/* Temperature-scaled confidence with an uncertainty band */
function Confidence({ value, lo, hi, tone }) {
  return (
    <div className="card conf-card">
      <div className="conf-top">
        <span className="cl"><Icon name="git-commit-horizontal" size={14} />Calibrated confidence</span>
        <span className="cv">{value.toFixed(2)}</span>
      </div>
      <div className="conf-track">
        <div className="conf-band" style={{ left: lo + '%', width: (hi - lo) + '%' }}></div>
        <div className={`fl ${tone}`} style={{ width: value * 100 + '%' }}></div>
      </div>
      <div className="conf-foot">
        <Icon name="info" size={13} color="var(--text-muted)" />
        Temperature-scaled estimate ({lo}–{hi}% range). An educational measure of model certainty — not a probability of disease.
      </div>
    </div>
  );
}

function Consent({ on, children }) {
  const [v, setV] = useState(on);
  return (
    <div className={`consent ${v ? 'on' : ''}`} role="checkbox" aria-checked={v} tabIndex={0} onClick={() => setV(!v)}>
      <span className="box">{v && <Icon name="check" size={14} color="#fff" />}</span>
      <span className="ct">{children}</span>
    </div>
  );
}

/* ── 1. Default — upload prompt ─────────────────────────────────────── */
function FrameUpload() {
  return (
    <Screen title="Analyze image">
      <Stepper step={0} />
      <div className="dropzone">
        <div className="dzi"><Icon name="upload-cloud" size={26} /></div>
        <h3>Add a skin image to analyze</h3>
        <p>Drag a photo here, or choose a source below.</p>
      </div>
      <div className="dz-actions">
        <Btn icon="folder">Browse files</Btn>
        <Btn variant="secondary" icon="camera">Use camera</Btn>
      </div>
      <div className="file-guide">
        <div className="fg-row"><Icon name="file-image" size={14} />JPG or PNG, up to 10&nbsp;MB</div>
        <div className="fg-row"><Icon name="sun" size={14} />Even lighting, lesion centered and in focus</div>
        <div className="fg-row"><Icon name="ruler" size={14} />Hold the camera 10–15&nbsp;cm from the skin</div>
      </div>
      <Disclaimer />
    </Screen>
  );
}

/* ── 2. Loading — analyzing ─────────────────────────────────────────── */
function FrameLoading() {
  return (
    <Screen title="Analyze image">
      <Stepper step={1} />
      <div className="card analyzing">
        <div className="thumb-mini"><div className="img"></div><div className="scan"></div></div>
        <div className="spinner" aria-hidden="true"></div>
        <div className="prog"><div className="fill" style={{ width: '58%' }}></div></div>
        <div className="ap">Analyzing your image…</div>
        <div className="as">This typically takes 10–20 seconds</div>
        <div className="privacy-note"><Icon name="shield-check" size={13} />Processed privately — your image is not shared</div>
        <button className="btn btn-ghost" style={{ marginTop: 4 }}>Cancel analysis</button>
      </div>
      <Disclaimer />
    </Screen>
  );
}

/* ── 3. Quality fail — retake guidance ──────────────────────────────── */
function FrameQuality() {
  return (
    <Screen title="Quality check">
      <Stepper step={1} />
      <div className="qa-preview">
        <div className="img"></div>
        <div className="veil"></div>
        <span className="flag"><Icon name="alert-triangle" size={14} />Image looks blurry</span>
      </div>
      <div className="qa-banner">
        <span className="qi"><Icon name="alert-triangle" size={19} /></span>
        <div>
          <div className="qt">Let's retake this one</div>
          <div className="qd">The focus is too soft for a clear analysis. A sharper photo helps the model highlight the right areas.</div>
        </div>
      </div>
      <div className="retake-tips">
        <div className="tip"><span className="ti bad"><Icon name="focus" size={16} /></span><span className="tt"><b>Sharpen the focus.</b> Tap the lesion on screen, then hold steady before capturing.</span></div>
        <div className="tip"><span className="ti ok"><Icon name="sun" size={16} /></span><span className="tt"><b>Lighting looks good.</b> Keep the same even, natural light.</span></div>
        <div className="tip"><span className="ti ok"><Icon name="crop" size={16} /></span><span className="tt"><b>Framing looks good.</b> Lesion is centered — keep it that way.</span></div>
      </div>
      <div className="action-row">
        <Btn icon="camera">Retake photo</Btn>
        <Btn variant="secondary" icon="image">Choose another</Btn>
      </div>
      <Disclaimer />
    </Screen>
  );
}

/* ── 4. Result — low concern (green) ────────────────────────────────── */
function FrameResultGreen() {
  return (
    <Screen title="Educational result">
      <Stepper step={2} />
      <div className="result-stack">
        <GradCamViewer />
        <div className="band green">
          <div className="bt"><span className="b-icon"><Icon name="check" size={16} color="#fff" /></span>Low concern</div>
          <div className="bd">No features of immediate concern were highlighted. These are educational results only — this is not a diagnosis.</div>
        </div>
        <Confidence value={0.86} lo={80} hi={91} tone="green" />
        <div className="card expl">
          <h4><Icon name="sparkles" size={15} />What the model looked at</h4>
          <ul className="ex-list">
            <li><Icon name="layers" size={14} />The heatmap concentrates on the lesion itself rather than surrounding skin.</li>
            <li><Icon name="circle-dot" size={14} />Borders read as regular and coloration appears even in this image.</li>
            <li><Icon name="calendar-clock" size={14} />A good candidate to re-photograph in about 3 months to track any change.</li>
          </ul>
        </div>
        <Chip tone="green" icon="layers">Heatmap quality: clean</Chip>
        <Consent on={true}>Save this analysis to your <b>lesion history</b> so you can track changes and share it for professional review.</Consent>
        <div className="action-row">
          <Btn icon="check">Save to timeline</Btn>
          <Btn variant="secondary" icon="stethoscope">Request review</Btn>
        </div>
        <Disclaimer />
      </div>
    </Screen>
  );
}

/* ── 5. Result — professional review recommended (amber) ────────────── */
function FrameResultAmber() {
  return (
    <Screen title="Educational result">
      <Stepper step={2} />
      <div className="result-stack">
        <GradCamViewer />
        <div className="band amber">
          <div className="bt"><span className="b-icon"><Icon name="alert-triangle" size={16} color="#fff" /></span>Professional review recommended</div>
          <div className="bd">The model highlighted features worth a closer look by a clinician. This is educational information, not a diagnosis.</div>
        </div>
        <Confidence value={0.63} lo={52} hi={74} tone="amber" />
        <div className="card expl">
          <h4><Icon name="sparkles" size={15} />What the model looked at</h4>
          <ul className="ex-list">
            <li><Icon name="layers" size={14} />Activation spreads to the lesion border and an area of uneven coloration.</li>
            <li><Icon name="git-compare" size={14} />Some asymmetry between the upper and lower regions of the lesion.</li>
            <li><Icon name="stethoscope" size={14} />Sharing this case with a professional is a sensible next step.</li>
          </ul>
        </div>
        <Chip tone="amber" icon="layers">Heatmap quality: clean</Chip>
        <Consent on={true}>Send this case for <b>professional review</b>. Your image and history are shared pseudonymously with a reviewing clinician.</Consent>
        <div className="action-row">
          <Btn icon="stethoscope">Request review</Btn>
          <Btn variant="secondary" icon="history">Save to timeline</Btn>
        </div>
        <Disclaimer />
      </div>
    </Screen>
  );
}

/* ── 6. Error — analysis interrupted ────────────────────────────────── */
function FrameError() {
  return (
    <Screen title="Analyze image">
      <Stepper step={1} />
      <div className="err-state">
        <div className="ei"><Icon name="cloud-off" size={24} /></div>
        <h3>Analysis interrupted</h3>
        <p>Something unexpected happened while analyzing your image. Nothing was lost.</p>
        <span className="saved-note"><Icon name="check" size={14} />Your image has been saved</span>
        <div className="action-row" style={{ marginTop: 'var(--sp-sm)' }}>
          <Btn icon="refresh-cw">Try again</Btn>
          <Btn variant="secondary" icon="image">Use another image</Btn>
        </div>
      </div>
      <Disclaimer />
    </Screen>
  );
}

/* ── 7. Empty — no cases yet ────────────────────────────────────────── */
function FrameEmpty() {
  return (
    <Screen title="Lesion history" back={false}>
      <div className="empty">
        <div className="ei"><Icon name="history" size={24} /></div>
        <h3>No cases yet</h3>
        <p>When you analyze a skin image, it's saved here as a case so you can track changes over time and share your history for professional review.</p>
        <Btn icon="scan-line">Analyze first image</Btn>
      </div>
      <Disclaimer />
    </Screen>
  );
}

/* ── 8. Success / complete ──────────────────────────────────────────── */
function FrameSuccess() {
  return (
    <Screen title="Analysis complete" back={false}>
      <div className="success-top">
        <div className="si"><Icon name="check-circle" size={28} /></div>
        <h3>Case saved to your timeline</h3>
        <p>Analysis complete. These are educational results only. You can revisit this case or share it for professional review anytime.</p>
      </div>
      <div className="card tl-card">
        <div className="tl-head"><Icon name="history" size={14} color="var(--text-muted)" />Lesion history<span className="new">New entry</span></div>
        <div className="tl-entry fresh">
          <div className="tl-thumb"><div className="img"></div></div>
          <div className="tl-main">
            <div className="tl-loc">Left forearm · pin 03</div>
            <div className="tl-date">2026-06-05 · 09:41</div>
          </div>
          <StatusChip status="green" label="Low concern" />
        </div>
        <div className="tl-entry">
          <div className="tl-thumb"><div className="img"></div></div>
          <div className="tl-main">
            <div className="tl-loc">Left forearm · pin 03</div>
            <div className="tl-date">2026-03-02 · earlier capture</div>
          </div>
          <StatusChip status="green" label="Low concern" />
        </div>
      </div>
      <div className="action-row">
        <Btn icon="history">View timeline</Btn>
        <Btn variant="secondary" icon="scan-line">Analyze another</Btn>
      </div>
      <Disclaimer />
    </Screen>
  );
}

/* ── Gallery ────────────────────────────────────────────────────────── */
function Gallery() {
  return (
    <div className="gallery">
      <div className="page-head">
        <div className="brand-row">
          <span className="mark"><span className="reticle"></span></span>
          <span className="wm">Skin Lesion <b>XAI</b></span>
        </div>
        <h1>Upload &amp; analysis flow</h1>
        <p>The patient-facing upload → quality check → educational result journey, with every key state rendered as a labeled screen. Status is always paired with an icon and text, the safety disclaimer is present on every result, and language stays educational throughout.</p>
        <div className="meta-row">
          <Chip tone="blue" icon="shield-check">Not a diagnosis tool</Chip>
          <Chip tone="neutral" icon="smartphone">Patient mobile app</Chip>
          <Chip tone="neutral" icon="contrast">WCAG AA · 44px targets</Chip>
        </div>
      </div>
      <div className="frames">
        <Frame num="01" name="Default — upload prompt" desc="Drag-drop or camera capture with file-type and framing guidance.">
          <FrameUpload />
        </Frame>
        <Frame num="02" name="Loading — analyzing" desc="Calm progress with a private-processing note. Never counts down.">
          <FrameLoading />
        </Frame>
        <Frame num="03" name="Quality fail — retake guidance" desc="Blur detected. Specific, encouraging tips on focus, lighting and framing.">
          <FrameQuality />
        </Frame>
        <Frame num="04" name="Result — low concern" desc="Calm green band, temperature-scaled confidence, Grad-CAM toggle, consent.">
          <FrameResultGreen />
        </Frame>
        <Frame num="05" name="Result — professional review recommended" desc="Amber band routing to a clinician — no urgency framing, no red.">
          <FrameResultAmber />
        </Frame>
        <Frame num="06" name="Error — analysis interrupted" desc="API failure. Reassures effort isn't lost and offers a retry. No error codes.">
          <FrameError />
        </Frame>
        <Frame num="07" name="Empty — no cases yet" desc="First-run state inviting the patient to analyze their first image.">
          <FrameEmpty />
        </Frame>
        <Frame num="08" name="Success — case saved" desc="Complete state. Timeline entry added, with the new case highlighted.">
          <FrameSuccess />
        </Frame>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Gallery />);
