// Gallery.jsx — lays out every auth screen & state as labeled frames.
const { useState: useStateG } = React;

/* ── Frame chrome ─────────────────────────────────────────────────────── */
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
const STATE_ICON = { green: 'check-circle', amber: 'alert-triangle', blue: 'info', red: 'alert-octagon', neutral: 'minus-circle' };

function DesktopFrame({ name, tag, tone, toneLabel, cap, url = 'app.skinlesionxai.health', tall, children }) {
  return (
    <div className="frame">
      <FrameLabel name={name} tag={tag} tone={tone} toneLabel={toneLabel} />
      {cap && <p className="frame-cap">{cap}</p>}
      <div className="win">
        <div className="win-bar">
          <div className="dots"><i /><i /><i /></div>
          <div className="url"><Icon name="lock" size={11} />{url}</div>
        </div>
        <div className={`win-screen ${tall ? 'tall' : ''}`}>{children}</div>
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
  return (
    <>
      <p className="eyebrow" style={{ marginTop: 38, marginBottom: 4 }}>{title}</p>
      <div className="frames">{children}</div>
    </>
  );
}

/* ── App ──────────────────────────────────────────────────────────────── */
function App() {
  return (
    <div className="gallery">
      <header className="gallery-head">
        <div className="gh-top">
          <div className="wordmark" style={{ gap: 13 }}>
            <span className="mark" style={{ width: 44, height: 44, borderRadius: 11 }}><span className="reticle" style={{ width: 22, height: 22 }} /></span>
            <div>
              <span className="wm" style={{ fontSize: 19, display: 'block' }}>Skin Lesion <b>XAI</b></span>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Authentication flow · Clinical Premium</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="gh-tag"><Icon name="shield-check" size={13} />Disclaimer on every surface</span>
            <span className="gh-tag"><Icon name="contrast" size={13} />WCAG AA · 44px targets</span>
          </div>
        </div>
        <h1>Authentication &amp; account setup</h1>
        <p className="gh-sub">A complete, privacy-first auth flow for the Skin Lesion XAI patient platform — every screen and state, on desktop and mobile. Inputs are live: type, toggle password visibility, and enter the 6-digit MFA code to feel the real interactions.</p>
        <div className="gallery-band">
          <Icon name="info" size={18} />
          <p><strong>Status is never color alone.</strong> Every error, lock, and success pairs a status color with an icon and plain-language text. No security questions, no CAPTCHA, no passwords sent by email, and no pre-filled identifiers without consent — per the product's safety rules.</p>
        </div>
      </header>

      {/* 1 — SIGN IN */}
      <Section num="01" title="Sign in" desc="Email + password, remember device, SSO, and every failure state a patient can hit.">
        <Rail title="Desktop">
          <DesktopFrame name="Sign in" tag="default" cap="Split layout: form left, calm clinical brand panel right. Show/hide password, remember-device, Google + hospital SSO, and the safety disclaimer.">
            <LoginScreen state="default" />
          </DesktopFrame>
          <DesktopFrame name="Sign in" tag="loading" tone="blue" toneLabel="Submitting" cap="Primary button shows a spinner and disables the form while credentials are checked. Copy stays calm: 'Signing you in…'.">
            <LoginScreen state="loading" />
          </DesktopFrame>
          <DesktopFrame name="Sign in" tag="invalid credentials" tone="red" toneLabel="Error" cap="Generic, non-enumerating message with a remaining-attempts count. Fields marked invalid; no blame, no error codes.">
            <LoginScreen state="invalid" />
          </DesktopFrame>
          <DesktopFrame name="Sign in" tag="account locked" tone="red" toneLabel="Locked" cap="After repeated failures the account is paused for security, with a cooldown timer and a password-reset path to regain access.">
            <LoginScreen state="locked" />
          </DesktopFrame>
          <DesktopFrame name="Sign in" tag="network error" tone="neutral" toneLabel="Offline" cap="Neutral, un-alarming tone. Reassures that nothing was sent yet and offers retry — distinct from a credentials failure.">
            <LoginScreen state="network" />
          </DesktopFrame>
        </Rail>
        <Rail title="Mobile">
          <MobileFrame name="Sign in" tag="default" cap="Brand panel collapses; the form fills the viewport via container queries.">
            <LoginScreen state="default" />
          </MobileFrame>
          <MobileFrame name="Sign in" tag="invalid credentials" tone="red" toneLabel="Error">
            <LoginScreen state="invalid" />
          </MobileFrame>
        </Rail>
      </Section>

      {/* 2 — CREATE ACCOUNT */}
      <Section num="02" title="Create account" desc="Name, email, password with live strength, and two separate consents — terms and privacy.">
        <Rail title="Desktop">
          <DesktopFrame name="Create account" tag="default" tall cap="Live password-strength meter with requirement checklist. Terms and privacy consent are deliberately separate checkboxes." url="app.skinlesionxai.health/register">
            <RegisterScreen state="default" />
          </DesktopFrame>
          <DesktopFrame name="Create account" tag="strong · ready" tone="green" toneLabel="Valid" tall cap="Filled state: strong password, matching confirmation, both consents given — the form is ready to submit." url="app.skinlesionxai.health/register">
            <RegisterScreen state="strong" />
          </DesktopFrame>
          <DesktopFrame name="Create account" tag="password mismatch" tone="red" toneLabel="Error" tall cap="Inline validation on the confirm field — caught before submit, with a clear, non-technical message." url="app.skinlesionxai.health/register">
            <RegisterScreen state="mismatch" />
          </DesktopFrame>
        </Rail>
        <Rail title="Mobile">
          <MobileFrame name="Create account" tag="default">
            <RegisterScreen state="default" />
          </MobileFrame>
        </Rail>
      </Section>

      {/* 3 — CONSENT ONBOARDING */}
      <Section num="03" title="Consent onboarding" desc="Immediately after registration: welcome, storage choice, and a safety acknowledgment before the dashboard.">
        <Rail title="Desktop">
          <DesktopFrame name="Onboarding · Welcome" tag="step 1 of 3" tall cap="Sets expectations: explanation not verdict, organized history, a path to professional review. Disclaimer present." url="app.skinlesionxai.health/welcome">
            <ConsentScreen step={0} />
          </DesktopFrame>
          <DesktopFrame name="Onboarding · Privacy" tag="step 2 of 3" tall cap="Storage mode is an explicit, reversible choice: encrypted cloud, on-device only, or analyze & discard. Privacy-first by default." url="app.skinlesionxai.health/welcome">
            <ConsentScreen step={1} />
          </DesktopFrame>
          <DesktopFrame name="Onboarding · Safety" tag="step 3 of 3" tall cap="A required acknowledgment that the platform is educational only. 'Continue to dashboard' stays disabled until it's checked." url="app.skinlesionxai.health/welcome">
            <ConsentScreen step={2} />
          </DesktopFrame>
        </Rail>
        <Rail title="Mobile">
          <MobileFrame name="Onboarding · Privacy" tag="step 2 of 3" cap="Storage cards stack; the recommended option is labeled, not pre-decided.">
            <ConsentScreen step={1} />
          </MobileFrame>
        </Rail>
      </Section>

      {/* 4 — PASSWORD RESET */}
      <Section num="04" title="Password reset" desc="Request a link, confirm, set a new password, and a success hand-off — no passwords ever emailed.">
        <Rail title="Desktop">
          <DesktopFrame name="Reset · Request" tag="enter email" cap="Single email field. Copy promises a link, never a password, and states the 30-minute expiry up front." url="app.skinlesionxai.health/reset">
            <ResetScreen step="request" />
          </DesktopFrame>
          <DesktopFrame name="Reset · Link sent" tag="confirmation" tone="blue" toneLabel="Check email" cap="Non-enumerating confirmation ('if an account exists'), with the address shown and a resend path.">
            <ResetScreen step="sent" />
          </DesktopFrame>
          <DesktopFrame name="Reset · New password" tag="set new" tall cap="Reached from the emailed link. Same strength meter and confirm-match feedback as registration." url="app.skinlesionxai.health/reset/new">
            <ResetScreen step="new" />
          </DesktopFrame>
          <DesktopFrame name="Reset · Updated" tag="success" tone="green" toneLabel="Done" cap="Confirms the change, notes other devices were signed out, and routes straight back to sign in.">
            <ResetScreen step="done" />
          </DesktopFrame>
        </Rail>
        <Rail title="Mobile">
          <MobileFrame name="Reset · Request" tag="enter email">
            <ResetScreen step="request" />
          </MobileFrame>
        </Rail>
      </Section>

      {/* 5 — MFA */}
      <Section num="05" title="Multi-factor authentication" desc="Auto-advancing 6-digit TOTP, trust-device option, backup codes, and the invalid-code state.">
        <Rail title="Desktop">
          <DesktopFrame name="MFA · Code entry" tag="pending" tone="blue" toneLabel="MFA pending" cap="Six cells auto-advance as you type and accept a pasted code; backspace steps back. 'Trust this device for 30 days' is opt-in. Try typing a code." url="app.skinlesionxai.health/verify">
            <MfaScreen state="pending" />
          </DesktopFrame>
          <DesktopFrame name="MFA · Invalid code" tag="error" tone="red" toneLabel="Error" cap="Cells turn red, with a calm explanation that codes expire quickly and a remaining-attempts count." url="app.skinlesionxai.health/verify">
            <MfaScreen state="error" />
          </DesktopFrame>
          <DesktopFrame name="MFA · Verifying" tag="loading" tone="blue" toneLabel="Verifying" cap="Code complete; the Verify button shows progress while the code is checked." url="app.skinlesionxai.health/verify">
            <MfaScreen state="verifying" />
          </DesktopFrame>
          <DesktopFrame name="MFA · Backup code" tag="recovery" cap="The fallback when the authenticator app is unavailable — single-use, monospaced entry." url="app.skinlesionxai.health/verify">
            <MfaScreen state="backup" />
          </DesktopFrame>
        </Rail>
        <Rail title="Mobile">
          <MobileFrame name="MFA · Code entry" tag="pending" tone="blue" toneLabel="MFA pending">
            <MfaScreen state="pending" />
          </MobileFrame>
        </Rail>
      </Section>

      {/* 6 — SESSION */}
      <Section num="06" title="Session security" desc="An inactivity warning that protects access to lesion history without losing the user's place.">
        <Rail title="Desktop">
          <DesktopFrame name="Session timeout" tag="2:00 remaining" tone="amber" toneLabel="Warning" cap="Modal over the dimmed app. 'For your security' framing — never blame. Continue or sign out; the app waits behind it.">
            <SessionTimeoutScreen seconds={120} />
          </DesktopFrame>
          <DesktopFrame name="Session timeout" tag="0:24 — final" tone="red" toneLabel="Expiring" cap="The countdown turns red in its final seconds to draw attention with color, icon, and text together.">
            <SessionTimeoutScreen seconds={24} />
          </DesktopFrame>
        </Rail>
        <Rail title="Mobile">
          <MobileFrame name="Session timeout" tag="2:00 remaining" tone="amber" toneLabel="Warning">
            <SessionTimeoutScreen seconds={120} />
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
// render lucide icons after mount
requestAnimationFrame(() => { if (window.lucide) window.lucide.createIcons(); });
