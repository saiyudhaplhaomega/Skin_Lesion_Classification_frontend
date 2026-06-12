// LoginScreens.jsx — Sign in + states. Exports LoginScreen to window.
const { useState: useStateL } = React;

function LoginForm({ state = 'default', compact }) {
  const [email, setEmail] = useStateL(state === 'invalid' ? 'dana.okoro@northshore.org' : '');
  const [pw, setPw] = useStateL(state === 'invalid' ? 'wrongpass' : '');
  const [remember, setRemember] = useStateL(false);

  const loading = state === 'loading';
  const locked = state === 'locked';
  const invalid = state === 'invalid';
  const network = state === 'network';
  const disabled = loading || locked;

  return (
    <div className="auth-body">
      <h1 className="auth-title">Sign in</h1>
      <p className="auth-sub">Welcome back. Sign in to view your lesion history and educational AI analysis.</p>

      {invalid && (
        <Banner tone="red" title="We couldn't sign you in">
          The email or password doesn't match our records. Check for typos and try again — you have <strong>3 attempts</strong> remaining.
        </Banner>
      )}
      {locked && (
        <Banner tone="red" icon="lock" title="Account temporarily locked">
          For your security, sign-in is paused after several failed attempts. Try again in 14:38, or <a href="#" onClick={e=>e.preventDefault()}>reset your password</a> to regain access now.
        </Banner>
      )}
      {network && (
        <Banner tone="neutral" icon="wifi-off" title="Can't reach the server">
          We couldn't connect just now. Check your connection — your details haven't been sent yet. <a href="#" onClick={e=>e.preventDefault()}>Try again</a>.
        </Banner>
      )}

      <Field
        id={`email-${state}`} label="Email or username" leadIcon="mail" type="email"
        placeholder="you@example.com" value={email} onChange={setEmail}
        autoComplete="username" disabled={disabled}
        invalid={invalid} 
      />
      <PasswordField
        id={`pw-${state}`} value={pw} onChange={setPw} disabled={disabled}
        link linkLabel="Forgot password?" invalid={invalid}
        error={invalid ? 'Incorrect email or password' : undefined}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 22px', gap: 12, flexWrap: 'wrap' }}>
        <Check id={`rem-${state}`} checked={remember} onChange={setRemember}>
          Remember this device
        </Check>
      </div>

      <button type="button" className="btn btn-primary btn-block btn-lg" disabled={disabled}
        aria-busy={loading ? 'true' : undefined}>
        {loading ? <><span className="spin" /> Signing you in…</> : 'Sign in'}
      </button>

      <OrDivider />
      <div className="sso-row">
        <SsoButton kind="google" />
        <SsoButton kind="hospital" />
      </div>

      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', margin: '22px 0 18px' }}>
        New to Skin Lesion XAI? <a href="#" onClick={e=>e.preventDefault()} style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Create an account</a>
      </p>
      <MiniDisclaimer />
    </div>
  );
}

function LoginScreen({ state = 'default' }) {
  return (
    <div className="auth-shell split screen-fill">
      <div className="auth-form-col">
        <FormHead />
        <LoginForm state={state} />
        <FormFoot />
      </div>
      <BrandPanel />
    </div>
  );
}

window.LoginScreen = LoginScreen;
window.LoginForm = LoginForm;
