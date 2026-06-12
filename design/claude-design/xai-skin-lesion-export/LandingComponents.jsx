// LandingComponents.jsx — marketing landing components. Exports LandingPage to window.
const { useState: useStateLp, useRef: useRefLp, useEffect: useEffectLp } = React;

/* Lucide icon wrapper */
function Icon({ name, size = 18, strokeWidth = 1.75, color }) {
  const ref = useRefLp(null);
  useEffectLp(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    window.lucide.createIcons({ attrs: { 'stroke-width': strokeWidth, width: size, height: size }, nameAttr: 'data-lucide' });
  }, [name, size, strokeWidth]);
  return <span className="app-icon" ref={ref} style={{ display: 'inline-flex', color }} aria-hidden="true" />;
}

const NAV = [
  { href: '#how', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#trust', label: 'Privacy' },
  { href: '#doctors', label: 'For doctors' },
];

/* ── Header (sticky, shrinks on scroll, mobile sheet) ─────────────────── */
function SiteHeader({ shrunk, onMenu }) {
  return (
    <header className={`site-header ${shrunk ? 'shrunk' : ''}`}>
      <div className="wrap header-inner">
        <a className="brand" href="#top" aria-label="Skin Lesion XAI home">
          <span className="mark"><span className="reticle" /></span>
          <span className="wm">Skin Lesion <b>XAI</b></span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          {NAV.map(n => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <div className="header-cta">
          <button className="btn btn-ghost">Sign in</button>
          <button className="btn btn-primary"><Icon name="scan-line" size={16} />Analyze an image</button>
          <button className="hamburger" aria-label="Open menu" onClick={onMenu}><Icon name="menu" size={22} /></button>
        </div>
      </div>
    </header>
  );
}

function MobileSheet({ open, onClose }) {
  return (
    <div className={`mobile-sheet ${open ? 'open' : ''}`} aria-hidden={!open} role="dialog" aria-label="Menu">
      <div className="sheet-top">
        <a className="brand" href="#top">
          <span className="mark"><span className="reticle" /></span>
          <span className="wm">Skin Lesion <b>XAI</b></span>
        </a>
        <button className="sheet-close" aria-label="Close menu" onClick={onClose}><Icon name="x" size={22} /></button>
      </div>
      <nav className="sheet-links" aria-label="Mobile">
        {NAV.map(n => <a key={n.href} href={n.href} onClick={onClose}>{n.label}<Icon name="arrow-up-right" size={18} /></a>)}
        <a href="#" onClick={onClose}>Sign in<Icon name="log-in" size={18} /></a>
      </nav>
      <div className="sheet-cta">
        <button className="btn btn-primary btn-lg btn-block"><Icon name="scan-line" size={16} />Analyze an image</button>
        <div className="sheet-disclaimer">
          <Icon name="shield-check" size={16} />
          <p><strong>Not a medical diagnosis tool.</strong> Educational AI-supported information for professional review.</p>
        </div>
      </div>
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap hero-grid">
        <div>
          <p className="eyebrow"><span className="dotmark" />Explainable AI monitoring</p>
          <h1>See <span className="accent">why</span> the AI looked there — skin-lesion monitoring you can take to your doctor.</h1>
          <p className="lead">Upload a photo and get an educational, explainable result: a Grad-CAM heatmap of the areas the model focused on, plus a lesion timeline organized for professional review.</p>
          <div className="cta-row">
            <button className="btn btn-primary btn-lg"><Icon name="scan-line" size={17} />Analyze an image</button>
            <button className="btn btn-secondary btn-lg"><Icon name="play-circle" size={17} />See how it works</button>
          </div>
          <div className="hero-disclaimer">
            <Icon name="shield-check" size={17} />
            <p><strong>This platform is not a medical diagnosis tool.</strong> It provides educational AI-supported information and helps organize lesion history for professional review.</p>
          </div>
          <div className="hero-meta">
            <span className="hm"><Icon name="lock" size={15} />Privacy-first by design</span>
            <span className="hm"><Icon name="layers" size={15} />Explainable heatmaps</span>
            <span className="hm"><Icon name="stethoscope" size={15} />Doctor-review ready</span>
          </div>
        </div>
        <AttentionPreview />
      </div>
    </section>
  );
}

/* abstract attention-field product preview — no anatomy, no stock art */
function AttentionPreview() {
  return (
    <div className="preview-card" role="img" aria-label="Product preview: an explanation view showing where the model focused, with a low-concern educational result and confidence.">
      <div className="pc-bar">
        <div className="dotrow"><span className="d" /><span className="d" /><span className="d" /></div>
        <span className="lbl"><Icon name="scan-line" size={12} />explanation · case 4821</span>
      </div>
      <div className="pc-body">
        <div className="pc-stage">
          <div className="field-grid" />
          <div className="reticle-rings" />
          <div className="crosshair" />
          <div className="crosshair h" />
          <div className="heat" />
          <div className="aoi" />
          <div className="aoi-tag">Areas of interest</div>
          <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
          <div className="seg"><span>Original</span><span className="on">Overlay</span><span>Heatmap</span></div>
        </div>
        <div className="pc-panel">
          <div className="pc-band">
            <div className="bt"><Icon name="check-circle" size={15} />Low concern</div>
            <div className="bd">Educational result only. Review the explanation below.</div>
          </div>
          <div className="pc-conf">
            <div className="ct"><span className="ck">Model confidence</span><span className="cv">0.87</span></div>
            <div className="track"><div className="fl" /></div>
          </div>
          <div className="pc-expl">
            <h5><Icon name="layers" size={13} />What the model looked at</h5>
            <p>Activation concentrated on the central region — shown as a Grad-CAM overlay, not a diagnosis.</p>
          </div>
          <div className="pc-foot"><Icon name="shield-check" size={13} />Stored privately · ready for review</div>
        </div>
      </div>
    </div>
  );
}

/* ── How it works ─────────────────────────────────────────────────────── */
const STEPS = [
  { icon: 'upload-cloud', n: '01', t: 'Upload an image', d: 'Add a photo with built-in guidance for lighting, focus, and framing — capture or upload.' },
  { icon: 'scan-line', n: '02', t: 'The AI analyzes it', d: 'A calibrated educational model returns a prediction band and a plain-language summary.' },
  { icon: 'layers', n: '03', t: 'See where it looked', d: 'A Grad-CAM heatmap highlights the areas of interest that influenced the result.' },
  { icon: 'stethoscope', n: '04', t: 'Share for review', d: 'Organize your history and send a pseudonymized case for optional professional review.' },
];
function HowItWorks() {
  return (
    <section className="section alt" id="how">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow"><span className="dotmark" />How it works</p>
          <h2>From a single photo to professional review</h2>
          <p>Four calm steps. The original image always stays one tap away — heatmaps and summaries are supporting context, never a verdict.</p>
        </div>
        <div className="steps">
          {STEPS.map(s => (
            <div className="step" key={s.n}>
              <div className="stop"><span className="si"><Icon name={s.icon} size={22} /></span><span className="n">{s.n}</span></div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <span className="connector" aria-hidden="true"><Icon name="chevron-right" size={18} /></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features (5, with preview thumbnails) ────────────────────────────── */
function Features() {
  return (
    <section className="section" id="features">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow"><span className="dotmark" />Features</p>
          <h2>Built for monitoring, not alarm</h2>
          <p>Every feature informs and organizes — calmly, privately, and without overstating what the model can do.</p>
        </div>
        <div className="features">
          <Feature icon="history" t="Lesion timeline" d="Track each lesion over time with side-by-side history and change notes." tag="Change tracking">
            <ThumbTimeline />
          </Feature>
          <Feature icon="map-pin" t="2D body mapping" d="Pin locations on a neutral body map and revisit any spot's full history." tag="Spatial history">
            <ThumbBody />
          </Feature>
          <Feature icon="sliders-horizontal" t="Privacy modes & consent" d="Choose how images are stored and withdraw consent anytime — instantly." tag="You stay in control">
            <ThumbPrivacy />
          </Feature>
          <Feature icon="layers" t="Explainable heatmaps" d="Every prediction ships with a Grad-CAM overlay of the areas of interest — so a result is never a black box." tag="Explainable by design" wide>
            <ThumbHeat />
          </Feature>
          <Feature icon="stethoscope" t="Doctor-review support" d="Send a pseudonymized case to a clinician and bring an organized history to your appointment." tag="Professional review" wide>
            <ThumbDoctor />
          </Feature>
        </div>
      </div>
    </section>
  );
}
function Feature({ icon, t, d, tag, wide, children }) {
  return (
    <article className={`feature ${wide ? 'wide' : ''}`}>
      <div className="feature-thumb">{children}</div>
      <div className="feature-body">
        <div className="fi"><Icon name={icon} size={22} /></div>
        <div>
          <h3>{t}</h3>
          <p>{d}</p>
          <span className="feature-tag"><Icon name="check" size={13} />{tag}</span>
        </div>
      </div>
    </article>
  );
}
function ThumbTimeline() {
  const hs = [56, 72, 64, 88];
  const ds = ['JAN', 'MAR', 'JUN', 'SEP'];
  return (
    <div className="tmb"><div className="tmb-grid" />
      <div className="tmb-timeline">
        <div className="tl-line" />
        {hs.map((h, i) => (
          <div className="tl-item" key={i}>
            <div className="tl-thumb" style={{ height: h }} />
            <span className="tl-date">{ds[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function ThumbBody() {
  return (
    <div className="tmb"><div className="tmb-grid" />
      <div className="tmb-body">
        <div className="silhouette"><span className="bp a" /><span className="bp b" /><span className="bp c" /></div>
      </div>
    </div>
  );
}
function ThumbPrivacy() {
  return (
    <div className="tmb"><div className="tmb-grid" />
      <div className="tmb-privacy">
        <div className="pr"><span className="pl"><Icon name="cloud" size={14} />Encrypted cloud</span><span className="tg on" /></div>
        <div className="pr"><span className="pl"><Icon name="brain" size={14} />Use for model training</span><span className="tg" /></div>
        <div className="pr"><span className="pl"><Icon name="history" size={14} />Keep full history</span><span className="tg on" /></div>
      </div>
    </div>
  );
}
function ThumbHeat() {
  return (
    <div className="tmb"><div className="tmb-grid" />
      <div className="tmb-heat"><div className="ring" /><div className="hb" /></div>
    </div>
  );
}
function ThumbDoctor() {
  return (
    <div className="tmb"><div className="tmb-grid" />
      <div className="tmb-doc">
        <div className="dr"><span className="av">DR</span><div className="dm"><div className="dn">Case 4821 · left forearm</div><div className="ds">submitted · awaiting review</div></div><span className="badge">In queue</span></div>
        <div className="dr"><span className="av">JL</span><div className="dm"><div className="dn">Dr. J. Larsson</div><div className="ds">professional opinion added</div></div><span className="badge">Reviewed</span></div>
      </div>
    </div>
  );
}

/* ── Trust strip ──────────────────────────────────────────────────────── */
const TRUST = [
  { icon: 'lock', t: 'Privacy-first', d: 'You control storage, retention, and deletion.' },
  { icon: 'shield-off', t: 'No diagnosis claims', d: 'Educational output — never a verdict.' },
  { icon: 'stethoscope', t: 'Doctor-reviewed support', d: 'Cases route to clinicians for review.' },
  { icon: 'accessibility', t: 'Accessible', d: 'WCAG AA, keyboard, and screen-reader ready.' },
];
function Trust() {
  return (
    <section className="section alt" id="trust">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow"><span className="dotmark" />Why you can trust it</p>
          <h2>Restraint, by design</h2>
          <p>The product's defining stance is what it won't do — and how openly it explains the rest.</p>
        </div>
        <div className="trust">
          {TRUST.map(t => (
            <div className="trust-item" key={t.t}>
              <div className="ti"><Icon name={t.icon} size={23} /></div>
              <div><h3>{t.t}</h3><p>{t.d}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Closing CTA band ─────────────────────────────────────────────────── */
function ClosingCTA() {
  return (
    <section className="cta-band" id="doctors">
      <div className="field-grid" />
      <div className="wrap">
        <p className="eyebrow"><span className="dotmark" />Start in under a minute</p>
        <h2>See <span className="accent">why</span> the AI looked there — and bring it to your doctor.</h2>
        <p>Explainable skin-lesion monitoring that organizes your history for professional review. No diagnosis, no guesswork about the AI — just a clear view of what it focused on.</p>
        <div className="cta-row">
          <button className="btn btn-primary btn-lg"><Icon name="scan-line" size={17} />Analyze an image</button>
          <button className="btn btn-secondary btn-lg"><Icon name="stethoscope" size={17} />For clinicians</button>
        </div>
        <div className="band-disclaimer">
          <Icon name="shield-check" size={16} />
          <p><strong>Not a medical diagnosis tool.</strong> Educational AI-supported information for professional review.</p>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ───────────────────────────────────────────────────────────── */
function SiteFooter() {
  const cols = [
    { h: 'Product', links: ['Analyze an image', 'Lesion timeline', '2D body map', 'Privacy modes', 'Explainability'] },
    { h: 'Learn', links: ['How it works', 'The ABCDE guide', 'What is Grad-CAM?', 'AI limitations'] },
    { h: 'Company', links: ['For doctors', 'Privacy policy', 'Terms of service', 'Contact'] },
  ];
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="brand" href="#top">
              <span className="mark"><span className="reticle" /></span>
              <span className="wm">Skin Lesion <b>XAI</b></span>
            </a>
            <p>Educational, privacy-aware AI explainability and lesion-history — calm, trustworthy, and built for professional review.</p>
          </div>
          {cols.map(c => (
            <div className="footer-col" key={c.h}>
              <h4>{c.h}</h4>
              {c.links.map(l => <a href="#" key={l}>{l}</a>)}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div className="footer-disclaimer">
            <Icon name="shield-check" size={17} />
            <p><strong>This platform is not a medical diagnosis tool.</strong> It provides educational AI-supported information and helps organize lesion history for professional review. Always consult a qualified healthcare professional for clinical decisions.</p>
          </div>
          <div className="footer-legal">
            <span>© 2026 Skin Lesion XAI · An educational platform</span>
            <div className="fl-links">
              <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Page wrapper: manages scroll-shrink + mobile menu ────────────────── */
function LandingPage({ forceShrunk = false, initialMenu = false }) {
  const [shrunk, setShrunk] = useStateLp(forceShrunk);
  const [menu, setMenu] = useStateLp(initialMenu);
  const rootRef = useRefLp(null);

  useEffectLp(() => {
    if (forceShrunk) return;
    const root = rootRef.current;
    const scroller = root && root.closest('.win-screen, .phone-body');
    if (!scroller) return;
    const onScroll = () => setShrunk(scroller.scrollTop > 24);
    scroller.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [forceShrunk]);

  return (
    <div className="lp" ref={rootRef}>
      <SiteHeader shrunk={shrunk} onMenu={() => setMenu(true)} />
      <MobileSheet open={menu} onClose={() => setMenu(false)} />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Trust />
        <ClosingCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

Object.assign(window, { Icon, LandingPage });
