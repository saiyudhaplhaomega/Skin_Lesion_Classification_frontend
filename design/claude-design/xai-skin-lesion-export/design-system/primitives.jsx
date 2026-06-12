// Clinical App — shared primitives. Exposes Icon, Btn, Chip, Disclaimer, StatusChip on window.
const { useEffect, useRef } = React;

// Lucide icon wrapper — manually manages its SVG child so React re-renders are safe.
function Icon({ name, size = 18, strokeWidth = 1.75, color }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.lucide) return;
    el.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    el.appendChild(i);
    window.lucide.createIcons({
      attrs: { 'stroke-width': strokeWidth, width: size, height: size },
      nameAttr: 'data-lucide',
    });
  }, [name, size, strokeWidth]);
  return <span className="app-icon" ref={ref} style={{ display: 'inline-flex', color }} aria-hidden="true" />;
}

function Btn({ variant = 'primary', icon, children, onClick, type = 'button', style }) {
  return (
    <button type={type} className={`btn btn-${variant}`} onClick={onClick} style={style}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

// status: green | amber | blue | red | neutral
const STATUS_META = {
  green:   { icon: 'check-circle',   label: 'Low concern' },
  amber:   { icon: 'alert-triangle', label: 'Monitor' },
  blue:    { icon: 'stethoscope',    label: 'Doctor review pending' },
  red:     { icon: 'alert-octagon',  label: 'Urgent review recommended' },
  neutral: { icon: 'clock',          label: 'Pending' },
};
function Chip({ tone = 'neutral', icon, children }) {
  return (
    <span className={`chip ${tone}`}>
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}
function StatusChip({ status, label }) {
  const m = STATUS_META[status] || STATUS_META.neutral;
  return <Chip tone={status} icon={m.icon}>{label || m.label}</Chip>;
}

function Disclaimer() {
  return (
    <div className="disclaimer">
      <Icon name="shield-check" size={17} />
      <p><strong>This platform is not a medical diagnosis tool.</strong> It provides educational AI-supported information and helps organize lesion history for professional review.</p>
    </div>
  );
}

Object.assign(window, { Icon, Btn, Chip, StatusChip, Disclaimer });
