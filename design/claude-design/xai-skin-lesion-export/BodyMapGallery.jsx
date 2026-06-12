// BodyMapGallery.jsx — every body-map state as a labeled frame, desktop + mobile.
const STATE_ICON = { green: 'check-circle', amber: 'alert-triangle', blue: 'info', red: 'alert-octagon', neutral: 'minus-circle' };

function FrameLabel({ name, tag, tone, toneLabel }) {
  return (
    <div className="frame-label">
      <span className="fl-name">{name}</span>
      {tag && <span className="fl-tag">{tag}</span>}
      {tone && <span className={`chip ${tone}`} style={{ fontSize: 11, padding: '3px 9px' }}>
        <Icon name={STATE_ICON[tone]} size={12} />{toneLabel}</span>}
    </div>
  );
}
function DesktopFrame({ name, tag, tone, toneLabel, cap, url = 'app.skinlesionxai.health/body-map', children }) {
  return (
    <div className="frame">
      <FrameLabel name={name} tag={tag} tone={tone} toneLabel={toneLabel} />
      {cap && <p className="frame-cap">{cap}</p>}
      <div className="win">
        <div className="win-bar">
          <div className="dots"><i /><i /><i /></div>
          <div className="url"><Icon name="lock" size={11} />{url}</div>
        </div>
        <div className="win-screen">{children}</div>
      </div>
    </div>
  );
}
function PhoneStatus() {
  return (
    <div className="phone-status">
      <span>9:41</span>
      <span className="st-r"><Icon name="signal" size={15} /><Icon name="wifi" size={15} /><Icon name="battery-full" size={17} /></span>
    </div>
  );
}
function MobileFrame({ name, tag, tone, toneLabel, cap, children }) {
  return (
    <div className="frame">
      <FrameLabel name={name} tag={tag} tone={tone} toneLabel={toneLabel} />
      {cap && <p className="frame-cap" style={{ maxWidth: 360 }}>{cap}</p>}
      <div className="phone">
        <div className="phone-screen">
          <div className="phone-notch" />
          <PhoneStatus />
          <div className="phone-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
function Section({ num, title, desc, children }) {
  return (
    <section className="sec">
      <div className="sec-head">
        <span className="sec-num">{num}</span>
        <h2>{title}</h2>
        {desc && <span className="sec-desc">{desc}</span>}
      </div>
      {children}
    </section>
  );
}
function Rail({ title, children }) {
  return (<><p className="rail-label">{title}</p><div className="frames">{children}</div></>);
}

/* ── App ──────────────────────────────────────────────────────────────── */
function App() {
  return (
    <div className="gallery">
      <header className="gallery-head">
        <div className="gh-top">
          <div className="wordmark">
            <span className="mark"><span className="reticle" /></span>
            <div>
              <span className="wm" style={{ display: 'block' }}>Skin Lesion <b>XAI</b></span>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>2D body map · Clinical Premium</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="gh-tag"><Icon name="venetian-mask" size={13} />Gender-neutral silhouette</span>
            <span className="gh-tag"><Icon name="contrast" size={13} />WCAG AA · 44px pins</span>
          </div>
        </div>
        <h1>Body map — lesion location</h1>
        <p className="gh-sub">A calm, anatomically-neutral map for pinning where each lesion sits on the body and opening its timeline. Every state is shown as a labeled frame on desktop (side panel) and mobile (floating overlay). Regions are live — hover or focus a region to feel the highlight.</p>
        <div className="gallery-band">
          <Icon name="info" size={18} />
          <p><strong>Locating, never diagnosing.</strong> The map organizes lesion history for professional review. Status is always color <em>plus</em> icon and text — never color alone — and the safety disclaimer rides on every surface.</p>
        </div>
      </header>

      {/* 1 — DEFAULT & VIEW */}
      <Section num="01" title="Default & body view" desc="The empty map a first-time patient sees, and the front / back toggle.">
        <Rail title="Desktop · in context">
          <DesktopFrame name="Body map" tag="default · empty" cap="Neutral silhouette, no pins. Regions carry text labels (head & neck, torso, arms, hands, legs, feet); the side panel invites the first pin and shows the disclaimer.">
            <BodyMapDesktop s={{ view: 'front', mode: 'default', pins: [] }} />
          </DesktopFrame>
          <DesktopFrame name="Body map" tag="back view" cap="The Back toggle flips to a posterior silhouette — torso splits into upper and lower back with a spine reference line. Existing back pins shown.">
            <BodyMapDesktop s={{ view: 'back', mode: 'pins', pins: ['07', '09'] }} />
          </DesktopFrame>
        </Rail>
      </Section>

      {/* 2 — PLACEMENT */}
      <Section num="02" title="Pin placement" desc="Select a region, confirm the location, save a numbered pin.">
        <Rail title="Desktop">
          <DesktopFrame name="Pin placement" tag="region selected" tone="blue" toneLabel="Placing" cap="Tapping a region highlights it in accent and opens a confirmation dialog. Copy describes the outcome — 'Save location' — and offers an optional label before anything is saved.">
            <BodyMapDesktop s={{ view: 'front', mode: 'placement', pins: [], sel: 'arm-l', selLabel: 'Left arm', modal: 'placement' }} />
          </DesktopFrame>
        </Rail>
      </Section>

      {/* 3 — PINS & PREVIEW */}
      <Section num="03" title="Lesion pins & preview" desc="Numbered markers, status by color + icon, hover for a quick preview.">
        <Rail title="Desktop">
          <DesktopFrame name="Lesion pins" tag="hover preview" cap="Pins are numbered, sized for a 44px touch target, and colored by clinical status. Hovering a pin floats a preview card with its status, date, and photo count; the side panel lists every pin on this view.">
            <BodyMapDesktop s={{ view: 'front', mode: 'pins', pins: ['02', '03', '05'], hoverPin: '03' }} />
          </DesktopFrame>
        </Rail>
      </Section>

      {/* 4 — DETAIL */}
      <Section num="04" title="Pin detail" desc="Click a pin to expand its summary and jump to the full timeline.">
        <Rail title="Desktop">
          <DesktopFrame name="Pin detail" tag="expanded" tone="blue" toneLabel="Review pending" cap="The selected pin pulses on the map and its summary fills the side panel — latest photo, status, first-logged and last-updated dates, size trend, and a clear route to the full lesion timeline.">
            <BodyMapDesktop s={{ view: 'front', mode: 'detail', pins: ['02', '03', '05'], activePin: '02' }} />
          </DesktopFrame>
        </Rail>
      </Section>

      {/* 5 — EDIT / RELOCATE */}
      <Section num="05" title="Edit mode — relocate" desc="Move a pin to a new region, with a confirmation that history stays linked.">
        <Rail title="Desktop">
          <DesktopFrame name="Relocate pin" tag="confirm move" tone="amber" toneLabel="Editing" cap="The original position stays as a dashed ghost while a pulsing target marks the new region. Confirming reassures the patient that only the location changes — photos, history, and analysis stay linked to the lesion.">
            <BodyMapDesktop s={{ view: 'front', mode: 'edit', pins: ['02', '03'], editPin: '05', editFrom: 'Right shoulder', selLabel: 'Right arm', sel: 'arm-r', ghost: { n: '05', x: 200, y: 106, status: 'amber' }, target: { x: 164, y: 142 }, modal: 'edit' }} />
          </DesktopFrame>
        </Rail>
      </Section>

      {/* 6 — MOBILE */}
      <Section num="06" title="Mobile" desc="Map fills the viewport; the info panel becomes a floating bottom sheet.">
        <Rail title="Mobile">
          <MobileFrame name="Body map" tag="default" cap="Front / back toggle spans the top; the map fills the screen with a floating hint anchored to the bottom.">
            <BodyMapMobile s={{ view: 'front', mode: 'default', pins: [] }} />
          </MobileFrame>
          <MobileFrame name="Pin detail" tag="bottom sheet" tone="blue" toneLabel="Review pending" cap="Tapping a pin raises a bottom sheet with the lesion summary and a full-width route to its timeline.">
            <BodyMapMobile s={{ view: 'front', mode: 'pins', pins: ['02', '03', '05'], activePin: '02', sheet: 'detail' }} />
          </MobileFrame>
          <MobileFrame name="Pin placement" tag="confirm" tone="blue" toneLabel="Placing" cap="Placement confirmation rises as a sheet — selected region, optional label, disclaimer, and a clear Save action.">
            <BodyMapMobile s={{ view: 'front', mode: 'placement', pins: [], sel: 'arm-l', selLabel: 'Left arm', sheet: 'placement' }} />
          </MobileFrame>
          <MobileFrame name="Body map" tag="back view" cap="Back silhouette with posterior pins; upper / lower back regions are tappable.">
            <BodyMapMobile s={{ view: 'back', mode: 'pins', pins: ['07', '09'] }} />
          </MobileFrame>
        </Rail>
      </Section>

      <footer style={{ marginTop: 72, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Skin Lesion XAI — Design System · Clinical Premium · Inter + JetBrains Mono</span>
        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Educational platform · not a medical diagnosis tool</span>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
requestAnimationFrame(() => { if (window.lucide) window.lucide.createIcons(); });
