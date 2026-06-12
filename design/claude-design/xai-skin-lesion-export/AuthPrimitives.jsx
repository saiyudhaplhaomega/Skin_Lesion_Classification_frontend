// AuthPrimitives.jsx — reusable auth building blocks. Exports to window.
const { useState, useRef, useEffect } = React;

/* ── Text field ───────────────────────────────────────────────────────── */
function Field({ label, type = 'text', placeholder, value, onChange, leadIcon, optional, link, linkLabel,
                 invalid, error, ok, okText, help, autoComplete, disabled, id, inputMode, name }) {
  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={id}>
          <span>{label}{optional && <span className="opt">  ·  optional</span>}</span>
          {link && <a href="#" onClick={(e) => e.preventDefault()}>{linkLabel}</a>}
        </label>
      )}
      <div className="input-wrap">
        {leadIcon && <span className="lead"><Icon name={leadIcon} size={17} /></span>}
        <input
          id={id} name={name} type={type} className={`input ${leadIcon ? 'has-lead' : ''} ${invalid ? 'invalid' : ''}`}
          placeholder={placeholder} value={value} disabled={disabled} autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={invalid ? 'true' : undefined}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
      </div>
      {invalid && error && <p className="field-error"><Icon name="alert-circle" size={14} />{error}</p>}
      {ok && okText && <p className="field-ok"><Icon name="check-circle" size={14} />{okText}</p>}
      {help && !invalid && <p className="field-help">{help}</p>}
    </div>
  );
}

/* ── Password field with show/hide ────────────────────────────────────── */
function PasswordField({ label = 'Password', value, onChange, placeholder = 'Enter your password',
                         link, linkLabel, invalid, error, autoComplete = 'current-password', id, help, disabled }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        <span>{label}</span>
        {link && <a href="#" onClick={(e) => e.preventDefault()}>{linkLabel}</a>}
      </label>
      <div className="input-wrap">
        <span className="lead"><Icon name="lock" size={17} /></span>
        <input
          id={id} type={show ? 'text' : 'password'} className={`input has-lead has-trail ${invalid ? 'invalid' : ''}`}
          placeholder={placeholder} value={value} disabled={disabled} autoComplete={autoComplete}
          aria-invalid={invalid ? 'true' : undefined}
          onChange={(e) => onChange && onChange(e.target.value)}
        />
        <button type="button" className="input-trail" onClick={() => setShow(s => !s)}
          aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
          <Icon name={show ? 'eye-off' : 'eye'} size={18} />
        </button>
      </div>
      {invalid && error && <p className="field-error"><Icon name="alert-circle" size={14} />{error}</p>}
      {help && !invalid && <p className="field-help">{help}</p>}
    </div>
  );
}

/* ── Checkbox ─────────────────────────────────────────────────────────── */
function Check({ checked, onChange, children, boxed, id }) {
  return (
    <label className={`check ${boxed ? 'boxed' : ''} ${boxed && checked ? 'on' : ''}`} htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange && onChange(e.target.checked)} />
      <span className="box"><Icon name="check" size={13} /></span>
      <span className="ctext">{children}</span>
    </label>
  );
}

/* ── Password strength ────────────────────────────────────────────────── */
function scorePassword(pw) {
  const reqs = {
    len: pw.length >= 12,
    upper: /[A-Z]/.test(pw) && /[a-z]/.test(pw),
    num: /[0-9]/.test(pw),
    sym: /[^A-Za-z0-9]/.test(pw),
  };
  let score = Object.values(reqs).filter(Boolean).length;
  if (pw.length === 0) score = 0;
  else if (pw.length < 8) score = Math.min(score, 1);
  return { score, reqs };
}
const STRENGTH_TEXT = ['', 'Weak', 'Fair', 'Good', 'Strong'];
function StrengthMeter({ value }) {
  const { score, reqs } = scorePassword(value || '');
  if (!value) return (
    <p className="field-help">Use at least 12 characters with a mix of letters, numbers, and a symbol.</p>
  );
  return (
    <div className="strength" aria-live="polite">
      <div className={`strength-bars s${score}`}><i></i><i></i><i></i><i></i></div>
      <div className="strength-top">
        <span className={`strength-label s${score}`}>{STRENGTH_TEXT[score]} password</span>
        <span className="field-help" style={{ margin: 0 }}>{score < 3 ? 'Add length & variety' : 'Meets requirements'}</span>
      </div>
      <ul className="strength-reqs">
        <Req ok={reqs.len}>12+ characters</Req>
        <Req ok={reqs.upper}>Upper & lowercase</Req>
        <Req ok={reqs.num}>A number</Req>
        <Req ok={reqs.sym}>A symbol</Req>
      </ul>
    </div>
  );
}
function Req({ ok, children }) {
  return (
    <li className={ok ? 'ok' : ''}>
      <span className="dotreq">{ok ? <Icon name="check" size={13} /> : <span className="empty" />}</span>
      {children}
    </li>
  );
}

/* ── Divider ──────────────────────────────────────────────────────────── */
function OrDivider({ label = 'or' }) {
  return <div className="or-div"><span>{label}</span></div>;
}

/* ── SSO buttons ──────────────────────────────────────────────────────── */
function GoogleLogo() {
  return (
    <svg className="g-logo" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}
function SsoButton({ kind }) {
  if (kind === 'google') {
    return (
      <button type="button" className="sso-btn"><GoogleLogo /> Continue with Google</button>
    );
  }
  return (
    <button type="button" className="sso-btn">
      <span className="h-logo"><Icon name="building-2" size={15} /></span>
      Continue with hospital SSO
      <span className="ss-meta">SAML</span>
    </button>
  );
}

/* ── Inline banner ────────────────────────────────────────────────────── */
const BANNER_ICON = { red: 'alert-octagon', amber: 'alert-triangle', blue: 'info', neutral: 'wifi-off' };
function Banner({ tone = 'red', icon, title, children }) {
  return (
    <div className={`banner ${tone}`} role="alert">
      <Icon name={icon || BANNER_ICON[tone]} size={18} />
      <div className="b-body">
        <div className="b-title">{title}</div>
        {children && <div className="b-text">{children}</div>}
      </div>
    </div>
  );
}

/* ── Brand panel (dark, right side on desktop) ────────────────────────── */
function BrandPanel() {
  return (
    <aside className="auth-brand-col" aria-hidden="true">
      <div className="grid-tex" />
      <div className="wordmark inverse">
        <span className="mark on-dark"><span className="reticle" /></span>
        <span className="wm">Skin Lesion <b>XAI</b></span>
      </div>
      <div style={{ marginTop: 56 }}>
        <div className="brand-reticle-lg"><span className="ring" /></div>
        <h2 className="brand-claim">Understand what the model <span className="accent">looked at</span> — never a diagnosis.</h2>
        <p className="brand-lede">A privacy-first space to photograph lesions, track them over time, and route anything of concern to professional review.</p>
      </div>
      <ul className="brand-points">
        <li><span className="bp-ic"><Icon name="layers" size={16} /></span><span><b>Explainable by design</b>Every prediction ships with a Grad-CAM heatmap, not a verdict.</span></li>
        <li><span className="bp-ic"><Icon name="shield-check" size={16} /></span><span><b>Privacy you control</b>Choose how images are stored — or keep them on your device only.</span></li>
        <li><span className="bp-ic"><Icon name="stethoscope" size={16} /></span><span><b>Built for professional review</b>Organize a lesion history a clinician can actually work from.</span></li>
      </ul>
      <div className="brand-foot">
        <div className="brand-disclaimer">
          <Icon name="shield-check" size={16} />
          <p><strong>This platform is not a medical diagnosis tool.</strong> It provides educational AI-supported information and helps organize lesion history for professional review.</p>
        </div>
        <div className="brand-cert">
          <span><Icon name="lock" size={14} /> End-to-end encrypted</span>
          <span><Icon name="file-check-2" size={14} /> HIPAA-aware</span>
        </div>
      </div>
    </aside>
  );
}

/* ── Locale / help row in form header ─────────────────────────────────── */
function FormHead({ children }) {
  return (
    <div className="auth-head">
      <div className="wordmark">
        <span className="mark"><span className="reticle" /></span>
        <span className="wm">Skin Lesion <b>XAI</b></span>
      </div>
      {children || <span className="auth-locale"><Icon name="globe" size={14} /> English (US)</span>}
    </div>
  );
}

function FormFoot() {
  return (
    <div className="auth-foot">
      <div className="links">
        <a href="#" onClick={e=>e.preventDefault()}>Privacy</a>
        <a href="#" onClick={e=>e.preventDefault()}>Terms</a>
        <a href="#" onClick={e=>e.preventDefault()}>Help</a>
      </div>
      <span className="copy">© 2026 Skin Lesion XAI</span>
    </div>
  );
}

/* ── Stepper ──────────────────────────────────────────────────────────── */
function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          {i > 0 && <span className="sline" />}
          <div className={`stp ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}>
            <span className="sdot">{i < current ? <Icon name="check" size={14} /> : i + 1}</span>
            <span className="slab">{s}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── Inline disclaimer (light) ────────────────────────────────────────── */
function MiniDisclaimer() {
  return (
    <div className="disclaimer" role="note">
      <Icon name="shield-check" size={17} />
      <p><strong>This platform is not a medical diagnosis tool.</strong> It provides educational AI-supported information and helps organize lesion history for professional review.</p>
    </div>
  );
}

Object.assign(window, {
  Field, PasswordField, Check, StrengthMeter, scorePassword, OrDivider,
  SsoButton, GoogleLogo, Banner, BrandPanel, FormHead, FormFoot, Stepper, MiniDisclaimer,
});
