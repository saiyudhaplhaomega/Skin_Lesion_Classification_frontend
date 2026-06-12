// RegisterConsent.jsx — Create account + consent onboarding. Exports to window.
const { useState: useStateR } = React;

/* ════ REGISTRATION ════════════════════════════════════════════════════ */
function RegisterForm({ state = 'default' }) {
  const prefilled = state === 'strong' || state === 'mismatch';
  const [name, setName] = useStateR(prefilled ? 'Dana Okoro' : '');
  const [email, setEmail] = useStateR(prefilled ? 'dana.okoro@northshore.org' : '');
  const [pw, setPw] = useStateR(state === 'strong' ? 'Coral-Reef-92!x' : state === 'mismatch' ? 'Coral-Reef-92!x' : '');
  const [confirm, setConfirm] = useStateR(state === 'mismatch' ? 'Coral-Reef-92!' : state === 'strong' ? 'Coral-Reef-92!x' : '');
  const [terms, setTerms] = useStateR(state === 'strong');
  const [privacy, setPrivacy] = useStateR(state === 'strong');

  const mismatch = state === 'mismatch';
  const confirmOk = confirm.length > 0 && confirm === pw;

  return (
    <div className="auth-body">
      <h1 className="auth-title">Create your account</h1>
      <p className="auth-sub">Start tracking lesion history with educational AI analysis. Already registered? <a href="#" onClick={e=>e.preventDefault()}>Sign in</a></p>

      <Field id={`r-name-${state}`} label="Full name" leadIcon="user" placeholder="First and last name"
        value={name} onChange={setName} autoComplete="name" />
      <Field id={`r-email-${state}`} label="Email" leadIcon="mail" type="email" placeholder="you@example.com"
        value={email} onChange={setEmail} autoComplete="email"
        help="We'll send a verification link here. We never share or pre-fill your email." />

      <div className="field" style={{ marginBottom: 16 }}>
        <label className="field-label" htmlFor={`r-pw-${state}`}><span>Password</span></label>
        <div className="input-wrap">
          <span className="lead"><Icon name="lock" size={17} /></span>
          <PwInner id={`r-pw-${state}`} value={pw} onChange={setPw} placeholder="Create a strong password" />
        </div>
        <StrengthMeter value={pw} />
      </div>

      <PasswordField id={`r-cf-${state}`} label="Confirm password" value={confirm} onChange={setConfirm}
        placeholder="Re-enter your password" autoComplete="new-password"
        invalid={mismatch} error={mismatch ? "Passwords don't match" : undefined} />
      {confirmOk && !mismatch && <p className="field-ok" style={{ marginTop: -8, marginBottom: 16 }}><Icon name="check-circle" size={14} />Passwords match</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '8px 0 22px' }}>
        <Check id={`r-terms-${state}`} checked={terms} onChange={setTerms}>
          I agree to the <a href="#" onClick={e=>e.preventDefault()}>Terms of Service</a>.
        </Check>
        <Check id={`r-priv-${state}`} checked={privacy} onChange={setPrivacy}>
          I consent to the processing of my images for <b>educational AI analysis</b>, as described in the <a href="#" onClick={e=>e.preventDefault()}>Privacy Policy</a>. This is separate from the terms and you can withdraw it later.
        </Check>
      </div>

      <button type="button" className="btn btn-primary btn-block btn-lg">Create account</button>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', margin: '14px 0 18px', lineHeight: 1.5 }}>
        Creating an account sets up multi-factor authentication on next sign-in.
      </p>
      <MiniDisclaimer />
    </div>
  );
}

// password input that shares the strength meter wrapper (no own label)
function PwInner({ id, value, onChange, placeholder }) {
  const [show, setShow] = useStateR(false);
  return (
    <>
      <input id={id} type={show ? 'text' : 'password'} className="input has-lead has-trail"
        placeholder={placeholder} value={value} autoComplete="new-password"
        onChange={(e) => onChange(e.target.value)} />
      <button type="button" className="input-trail" onClick={() => setShow(s => !s)}
        aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
        <Icon name={show ? 'eye-off' : 'eye'} size={18} />
      </button>
    </>
  );
}

function RegisterScreen({ state = 'default' }) {
  return (
    <div className="auth-shell split screen-fill">
      <div className="auth-form-col">
        <FormHead />
        <RegisterForm state={state} />
        <FormFoot />
      </div>
      <BrandPanel />
    </div>
  );
}

/* ════ CONSENT ONBOARDING ══════════════════════════════════════════════ */
const STORAGE_MODES = [
  { id: 'cloud', icon: 'cloud', title: 'Encrypted cloud', rec: true,
    desc: 'Images are encrypted and synced so you can track lesions across devices and request professional review. You can export or delete them anytime.' },
  { id: 'device', icon: 'smartphone', title: 'On this device only',
    desc: 'Images never leave your device. Analysis runs locally where supported. You won\'t be able to request a remote review or sync history.' },
  { id: 'none', icon: 'eye-off', title: 'Analyze & discard',
    desc: 'Run a single educational analysis, then discard the image. Nothing is stored and no history is kept.' },
];

function ConsentScreen({ step = 0 }) {
  const [mode, setMode] = useStateR('cloud');
  const [ack, setAck] = useStateR(step === 2);

  return (
    <div className="screen-fill" style={{ background: 'var(--surface)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* top bar */}
      <div style={{ height: 64, flexShrink: 0, background: 'var(--surface-card)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
        <div className="wordmark">
          <span className="mark"><span className="reticle" /></span>
          <span className="wm">Skin Lesion <b>XAI</b></span>
        </div>
        <span className="chip neutral"><Icon name="user-check" size={13} />Setting up your account</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '36px 24px 48px' }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <Stepper steps={['Welcome', 'Privacy', 'Safety']} current={step} />

          {step === 0 && <ConsentWelcome />}
          {step === 1 && <ConsentStorage mode={mode} setMode={setMode} />}
          {step === 2 && <ConsentSafety ack={ack} setAck={setAck} />}
        </div>
      </div>
    </div>
  );
}

function ConsentWelcome() {
  return (
    <div className="card" style={{ padding: 32 }}>
      <div className="auth-hero-ic blue"><Icon name="scan-line" size={30} /></div>
      <h1 className="auth-title" style={{ fontSize: 24 }}>Welcome to Skin Lesion XAI</h1>
      <p className="auth-sub" style={{ marginBottom: 24 }}>
        A calm, private place to photograph lesions, see what an educational AI model looked at, and build a history a clinician can review. Here's what to expect.
      </p>
      <div className="welcome-feats">
        <Feat icon="layers" t="You see the explanation, not a verdict"
          d="Each analysis returns a prediction band plus a Grad-CAM heatmap showing the areas of interest the model focused on." />
        <Feat icon="history" t="Your lesion history, organized"
          d="Track changes over time and place pins on a body map so nothing gets lost between visits." />
        <Feat icon="stethoscope" t="A path to professional review"
          d="When something warrants a closer look, send a pseudonymized case to a clinician — never an automated diagnosis." />
      </div>
      <MiniDisclaimer />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <button className="btn btn-primary btn-lg">Continue<Icon name="arrow-right" size={16} /></button>
      </div>
    </div>
  );
}
function Feat({ icon, t, d }) {
  return (
    <div className="welcome-feat">
      <span className="wf-ic"><Icon name={icon} size={20} /></span>
      <div><div className="wf-t">{t}</div><div className="wf-d">{d}</div></div>
    </div>
  );
}

function ConsentStorage({ mode, setMode }) {
  return (
    <div className="card" style={{ padding: 32 }}>
      <p className="eyebrow" style={{ color: 'var(--accent)' }}>Privacy first</p>
      <h1 className="auth-title" style={{ fontSize: 24 }}>How should we store your images?</h1>
      <p className="auth-sub" style={{ marginBottom: 22 }}>
        You're in control. Choose what works for you now — you can change this anytime in privacy settings.
      </p>
      <div className="store-list" role="radiogroup" aria-label="Storage mode">
        {STORAGE_MODES.map(m => (
          <label key={m.id} className={`store-opt ${mode === m.id ? 'on' : ''}`} role="radio" aria-checked={mode === m.id}>
            <input type="radio" name="storage" checked={mode === m.id} onChange={() => setMode(m.id)} style={{ position: 'absolute', opacity: 0 }} />
            <span className="so-ic"><Icon name={m.icon} size={21} /></span>
            <div className="so-main">
              <div className="so-top">
                <span className="so-title">{m.title}</span>
                {m.rec && <span className="chip blue" style={{ fontSize: 11, padding: '2px 8px' }}><Icon name="check" size={12} />Recommended</span>}
              </div>
              <div className="so-desc">{m.desc}</div>
            </div>
            <span className="so-radio" />
          </label>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26, gap: 12 }}>
        <button className="btn btn-ghost"><Icon name="arrow-left" size={16} />Back</button>
        <button className="btn btn-primary btn-lg">Continue<Icon name="arrow-right" size={16} /></button>
      </div>
    </div>
  );
}

function ConsentSafety({ ack, setAck }) {
  return (
    <div className="card" style={{ padding: 32 }}>
      <div className="auth-hero-ic blue"><Icon name="shield-check" size={30} /></div>
      <h1 className="auth-title" style={{ fontSize: 24 }}>One important thing before you start</h1>
      <p className="auth-sub" style={{ marginBottom: 20 }}>
        Please read and acknowledge how to use this platform safely.
      </p>

      <div style={{ background: 'var(--surface-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 20 }}>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <SafetyRow icon="info" text={<><b>This is not a diagnosis.</b> Results are educational and describe what the model looked at — they don't confirm or rule out any condition.</>} />
          <SafetyRow icon="stethoscope" text={<><b>Always consult a professional.</b> For any concern about your skin, see a qualified clinician. This platform helps you organize, not decide.</>} />
          <SafetyRow icon="alert-triangle" text={<><b>Seek care promptly</b> if a lesion changes, bleeds, or worries you — don't wait on an AI result.</>} />
        </ul>
      </div>

      <Check id="safety-ack" checked={ack} onChange={setAck} boxed>
        I understand this platform provides <b>educational information only</b> and is not a substitute for professional medical advice, diagnosis, or treatment.
      </Check>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26, gap: 12 }}>
        <button className="btn btn-ghost"><Icon name="arrow-left" size={16} />Back</button>
        <button className="btn btn-primary btn-lg" disabled={!ack} aria-disabled={!ack}>
          Continue to dashboard<Icon name="arrow-right" size={16} />
        </button>
      </div>
    </div>
  );
}
function SafetyRow({ icon, text }) {
  return (
    <li style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-card)', border: '1px solid var(--border)', color: 'var(--accent)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        <Icon name={icon} size={16} />
      </span>
      <span style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{text}</span>
    </li>
  );
}

Object.assign(window, { RegisterScreen, RegisterForm, ConsentScreen, STORAGE_MODES });
