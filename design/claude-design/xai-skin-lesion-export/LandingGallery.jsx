// LandingGallery.jsx — frames the landing page in desktop & mobile variants.
function FrameLabel({ name, tag, cap }) {
  return (
    <>
      <div className="frame-label">
        <span className="fl-name">{name}</span>
        {tag && <span className="fl-tag">{tag}</span>}
      </div>
      {cap && <p className="frame-cap">{cap}</p>}
    </>
  );
}

function DesktopFrame({ name, tag, cap, url = 'skinlesionxai.health', children }) {
  return (
    <div className="frame">
      <FrameLabel name={name} tag={tag} cap={cap} />
      <div className="win-vp">
        <div className="win">
          <div className="win-bar">
            <div className="dots"><i /><i /><i /></div>
            <div className="url"><Icon name="lock" size={11} />{url}</div>
            <div className="win-tools"><Icon name="rotate-cw" size={15} /><Icon name="share" size={15} /></div>
          </div>
          <div className="win-screen">{children}</div>
        </div>
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
function MobileFrame({ name, tag, cap, children }) {
  return (
    <div className="frame">
      <FrameLabel name={name} tag={tag} cap={cap} />
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
      <div className="frames">{children}</div>
    </section>
  );
}

function App() {
  return (
    <div className="gallery">
      <header className="gallery-head">
        <div className="gh-top">
          <div className="gh-wordmark">
            <span className="mark"><span className="reticle" /></span>
            <div>
              <span className="wm" style={{ display: 'block' }}>Skin Lesion <b>XAI</b></span>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Marketing landing page · Clinical Premium</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="gh-tag"><Icon name="shield-check" size={13} />Disclaimer in hero, band &amp; footer</span>
            <span className="gh-tag"><Icon name="contrast" size={13} />WCAG AA · landmarks · 44px targets</span>
          </div>
        </div>
        <h1>Landing page — desktop &amp; mobile</h1>
        <p className="gh-sub">The public front door for Skin Lesion XAI: sticky nav, hero with an abstract attention-field preview, a four-step explainer, five feature cards with product thumbnails, a trust strip, a closing CTA band, and the footer. The page is fully responsive — each frame reflows to its own width via container queries. Scroll any frame to watch the nav shrink.</p>
        <div className="gallery-band">
          <Icon name="info" size={18} />
          <p><strong>No diagnosis claims, no anatomy, no stock illustration.</strong> The hero visual is an abstract Grad-CAM attention field rendered in CSS — areas of interest, not a body or organ image. Status pairs color with icon and text throughout, and the safety disclaimer appears in the hero, the closing band, and the footer.</p>
        </div>
      </header>

      <Section num="01" title="Desktop" desc="Full landing page in a 1240px window. Scroll to shrink the nav; hover steps and feature cards.">
        <DesktopFrame name="Landing page" tag="default · top of page" cap="Hero fills the first view: value proposition, two CTAs, the safety disclaimer, and the attention-field product preview. Scroll within the frame to reach every section.">
          <LandingPage />
        </DesktopFrame>
        <DesktopFrame name="Landing page" tag="nav shrunk on scroll" cap="Scrolled state: the sticky header compresses (76px → 60px) and gains a soft shadow. Shown here pinned for comparison.">
          <LandingPage forceShrunk />
        </DesktopFrame>
      </Section>

      <Section num="02" title="Mobile" desc="384px device. Nav collapses to a hamburger that opens a full-height sheet; grids stack to one column.">
        <MobileFrame name="Landing page" tag="default" cap="Single-column reflow: visual stacks under the copy, steps and features go vertical, trust items become rows.">
          <LandingPage />
        </MobileFrame>
        <MobileFrame name="Mobile menu" tag="sheet open" cap="The hamburger opens a full-height navigation sheet with the primary CTA and a condensed disclaimer.">
          <LandingPage initialMenu />
        </MobileFrame>
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

/* Scale each desktop window to fit the available gallery width while keeping
   its true 1240px inner layout (transform preserves the container width). */
function fitDesktopFrames() {
  const WIN_W = 1240;
  const head = document.querySelector('.gallery-head');
  if (!head) return;
  const avail = head.clientWidth; // gallery content width (excludes padding)
  const scale = Math.min(1, Math.max(0.4, avail / WIN_W));
  document.querySelectorAll('.win-vp').forEach(vp => {
    const win = vp.querySelector('.win');
    if (!win) return;
    win.style.transform = `scale(${scale})`;
    const h = win.offsetHeight; // true unscaled height
    vp.style.width = (WIN_W * scale) + 'px';
    vp.style.height = (h * scale) + 'px';
  });
}
let fitRaf;
function scheduleFit() { cancelAnimationFrame(fitRaf); fitRaf = requestAnimationFrame(fitDesktopFrames); }
window.addEventListener('resize', scheduleFit);
setTimeout(fitDesktopFrames, 80);
setTimeout(fitDesktopFrames, 400);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitDesktopFrames);
