// ResetMfa.jsx — Password reset, MFA, session timeout. Exports to window.
const { useState: useStateM, useRef: useRefM, useEffect: useEffectM } = React;

/* ════ PASSWORD RESET ══════════════════════════════════════════════════ */
function ResetScreen({ step = 'request' }) {
  return (
    <div className="auth-shell split screen-fill">
      <div className="auth-form-col">
        <FormHead />
        <div className="auth-body">
          {step === 'request' && <ResetRequest />}
          {step === 'sent' && <ResetSent />}
          {step === 'new' && <ResetNew />}
          {step === 'done' && <ResetDone />}
        </div>
        <FormFoot />
      </div>
      <BrandPanel />
    </div>
  );
}

function ResetRequest() {
  const [email, setEmail] = useStateM('');
  return (
    <>
      <a href="#" onClick={e=>e.preventDefault()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600, marginBottom: 18 }}>
        <Icon name="arrow-left" size={15} /> Back to sign in
      </a>
      <h1 className="auth-title">Reset your password</h1>
      <p className="auth-sub">Enter the email on your account and we'll send a secure link to set a new password.</p>
      <Field id="reset-email" label="Email" leadIcon="mail" type="email" placeholder="you@example.com"
        value={email} onChange={setEmail} autoComplete="email" />
      <button type="button" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 4 }}>Send reset link</button>
      <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.55, margin: '16px 0 22px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <Icon name="shield-check" size={15} /> For your security, we'll send a link — never your password. The link expires in 30 minutes.
      </p>
      <MiniDisclaimer />
    </>
  );
}

function ResetSent() {
  return (
    <>
      <div className="auth-hero-ic blue"><Icon name="mail-check" size={30} /></div>
      <h1 className="auth-title">Check your email</h1>
      <p className="auth-sub">If an account exists for that address, a reset link is on its way. It expires in 30 minutes.</p>
      <span className="email-pill"><Icon name="mail" size={15} />dana.okoro@northshore.org</span>
      <div className="banner blue" style={{ marginTop: 18 }} role="note">
        <Icon name="info" size={18} />
        <div className="b-body">
          <div className="b-title">Didn't get it?</div>
          <div className="b-text">Check your spam folder, or <a href="#" onClick={e=>e.preventDefault()}>resend the link</a>. Make sure the address above is correct.</div>
        </div>
      </div>
      <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: 20 }}>
        <Icon name="arrow-left" size={16} />Back to sign in
      </button>
      <div style={{ marginTop: 22 }}><MiniDisclaimer /></div>
    </>
  );
}

function ResetNew() {
  const [pw, setPw] = useStateM('');
  const [confirm, setConfirm] = useStateM('');
  const match = confirm.length > 0 && confirm === pw;
  return (
    <>
      <h1 className="auth-title">Set a new password</h1>
      <p className="auth-sub">Choose a strong password you haven't used here before. You'll use it to sign in next time.</p>
      <div className="field" style={{ marginBottom: 16 }}>
        <label className="field-label" htmlFor="new-pw"><span>New password</span></label>
        <div className="input-wrap">
          <span className="lead"><Icon name="lock" size={17} /></span>
          <PwInner id="new-pw" value={pw} onChange={setPw} placeholder="Create a strong password" />
        </div>
        <StrengthMeter value={pw} />
      </div>
      <PasswordField id="new-cf" label="Confirm new password" value={confirm} onChange={setConfirm}
        placeholder="Re-enter your new password" autoComplete="new-password" />
      {match && <p className="field-ok" style={{ marginTop: -8, marginBottom: 16 }}><Icon name="check-circle" size={14} />Passwords match</p>}
      <button type="button" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 4 }}>Reset password</button>
      <div style={{ marginTop: 22 }}><MiniDisclaimer /></div>
    </>
  );
}

function ResetDone() {
  return (
    <>
      <div className="auth-hero-ic green"><Icon name="check-circle" size={30} /></div>
      <h1 className="auth-title">Password updated</h1>
      <p className="auth-sub">Your password has been changed. For your security, you've been signed out of other devices. Please sign in with your new password.</p>
      <div className="banner green" style={{ marginTop: 4, background: 'var(--green-bg)', borderColor: 'var(--green-border)' }} role="status">
        <Icon name="shield-check" size={18} color="var(--green)" />
        <div className="b-body">
          <div className="b-title" style={{ color: 'var(--green)' }}>You're all set</div>
          <div className="b-text" style={{ color: '#256b47' }}>No further action needed. We recommend keeping multi-factor authentication on.</div>
        </div>
      </div>
      <button type="button" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 20 }}>Sign in</button>
      <div style={{ marginTop: 22 }}><MiniDisclaimer /></div>
    </>
  );
}

/* ════ MFA ═════════════════════════════════════════════════════════════ */
function OtpInput({ length = 6, error, onComplete, value, setValue }) {
  const refs = useRefM([]);
  const handle = (i, v) => {
    const digit = v.replace(/\D/g, '').slice(-1);
    const next = value.split('');
    next[i] = digit || '';
    const joined = next.join('').slice(0, length);
    setValue(joined);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
    if (joined.length === length && !joined.includes('') && onComplete) onComplete(joined);
  };
  const keyDown = (i, e) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  };
  const paste = (e) => {
    const txt = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length);
    if (txt) { setValue(txt); e.preventDefault(); refs.current[Math.min(txt.length, length - 1)]?.focus(); }
  };
  return (
    <div className="otp-row" onPaste={paste} role="group" aria-label={`${length}-digit verification code`}>
      {Array.from({ length }).map((_, i) => (
        <input key={i} ref={el => refs.current[i] = el}
          className={`otp-cell ${value[i] ? 'filled' : ''} ${error ? 'err' : ''} ${i === 2 ? 'gap' : ''}`}
          inputMode="numeric" maxLength={1} value={value[i] || ''}
          aria-label={`Digit ${i + 1}`}
          onChange={e => handle(i, e.target.value)} onKeyDown={e => keyDown(i, e)} />
      ))}
    </div>
  );
}

function MfaScreen({ state = 'pending' }) {
  return (
    <div className="auth-shell split screen-fill">
      <div className="auth-form-col">
        <FormHead />
        <div className="auth-body">
          {state === 'backup' ? <MfaBackup /> : <MfaTotp state={state} />}
        </div>
        <FormFoot />
      </div>
      <BrandPanel />
    </div>
  );
}

function MfaTotp({ state }) {
  const [code, setCode] = useStateM(state === 'error' ? '418207' : state === 'verifying' ? '602914' : '');
  const [trust, setTrust] = useStateM(false);
  const verifying = state === 'verifying';
  const error = state === 'error';
  return (
    <>
      <div className="auth-hero-ic blue" style={{ width: 56, height: 56, marginBottom: 18 }}><Icon name="shield-check" size={26} /></div>
      <h1 className="auth-title">Verify it's you</h1>
      <p className="auth-sub">Enter the 6-digit code from your authenticator app to finish signing in.</p>

      <div className="mfa-app">
        <span className="ma-ic"><Icon name="smartphone" size={19} /></span>
        <div><div className="ma-t">Authenticator app</div><div className="ma-s">Code refreshes every 30 seconds</div></div>
      </div>

      {error && (
        <Banner tone="red" icon="alert-octagon" title="That code didn't work">
          Double-check the current code in your app — codes expire quickly. <strong>2 attempts</strong> remaining.
        </Banner>
      )}

      <OtpInput value={code} setValue={setCode} error={error} />
      {error && <p className="field-error" style={{ justifyContent: 'center', marginBottom: 4 }}><Icon name="alert-circle" size={14} />Invalid or expired code</p>}

      <div style={{ margin: '18px 0 20px' }}>
        <Check id="trust-dev" checked={trust} onChange={setTrust}>
          Trust this device for 30 days <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— skip codes on this browser</span>
        </Check>
      </div>

      <button type="button" className="btn btn-primary btn-block btn-lg" disabled={verifying} aria-busy={verifying ? 'true' : undefined}>
        {verifying ? <><span className="spin" /> Verifying…</> : 'Verify'}
      </button>

      <p className="resend">
        Can't access your app? <a onClick={e=>e.preventDefault()}>Use a backup code</a>
      </p>
      <div style={{ marginTop: 22 }}><MiniDisclaimer /></div>
    </>
  );
}

function MfaBackup() {
  const [val, setVal] = useStateM('');
  return (
    <>
      <div className="auth-hero-ic blue" style={{ width: 56, height: 56, marginBottom: 18 }}><Icon name="key-round" size={26} /></div>
      <h1 className="auth-title">Enter a backup code</h1>
      <p className="auth-sub">Use one of the single-use backup codes you saved when setting up multi-factor authentication.</p>
      <div className="field backup-field">
        <label className="field-label" htmlFor="backup"><span>Backup code</span></label>
        <div className="input-wrap">
          <span className="lead"><Icon name="key-round" size={17} /></span>
          <input id="backup" className="input has-lead" placeholder="XXXX-XXXX" value={val}
            onChange={e => setVal(e.target.value.toUpperCase())} maxLength={9} autoComplete="one-time-code" />
        </div>
        <p className="field-help">Each backup code works once. After signing in, review your remaining codes in security settings.</p>
      </div>
      <button type="button" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 4 }}>Verify</button>
      <p className="resend"><a onClick={e=>e.preventDefault()}>Back to authenticator code</a></p>
      <div style={{ marginTop: 22 }}><MiniDisclaimer /></div>
    </>
  );
}

/* ════ SESSION TIMEOUT MODAL ═══════════════════════════════════════════ */
function SessionTimeoutScreen({ seconds = 120 }) {
  return (
    <div className="screen-fill" style={{ position: 'relative', height: '100%' }}>
      <AppBackdrop />
      <div className="modal-scrim">
        <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="to-title">
          <div className="modal-top">
            <div className="modal-ic"><Icon name="clock" size={26} /></div>
            <h3 id="to-title">Still there?</h3>
            <p>For your security, your session will end automatically after a period of inactivity.</p>
            <div className={`countdown ${seconds <= 30 ? 'warn' : ''}`}>{fmt(seconds)}</div>
            <div className="cd-label">Until automatic sign-out</div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost">Sign out</button>
            <button className="btn btn-primary">Continue session</button>
          </div>
          <div className="modal-note">
            <Icon name="shield-check" size={14} /> We protect access to your lesion history when you step away.
          </div>
        </div>
      </div>
    </div>
  );
}
function fmt(s) { const m = Math.floor(s / 60); const ss = s % 60; return `${m}:${String(ss).padStart(2, '0')}`; }

// faux app behind the modal (so the overlay reads as "in app")
function AppBackdrop() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'var(--surface)', filter: 'saturate(0.9)' }}>
      <div style={{ height: 64, background: 'var(--surface-card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px' }}>
        <div className="wordmark"><span className="mark"><span className="reticle" /></span><span className="wm">Skin Lesion <b>XAI</b></span></div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)' }} />
          <div style={{ width: 38, height: 38, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)' }} />
        </div>
      </div>
      <div style={{ padding: 28, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {[0,1,2,3,4,5].map(i => (
          <div key={i} className="card" style={{ height: 150, padding: 16 }}>
            <div className="skel" style={{ height: 70, marginBottom: 12 }} />
            <div className="skel" style={{ height: 12, width: '60%', marginBottom: 8 }} />
            <div className="skel" style={{ height: 12, width: '40%' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ResetScreen, MfaScreen, SessionTimeoutScreen, OtpInput, PwInner });
