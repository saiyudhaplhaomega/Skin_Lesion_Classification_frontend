// Notification center — seed data, category & tab maps.
// PHI-safe: no lesion locations, no results/diagnoses, no identifying detail in any preview.

const TABS = [
  { id: 'all',      label: 'All' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'doctor',   label: 'Doctor' },
  { id: 'system',   label: 'System' },
];

// tone drives the icon-tile color (status color = meaning only, always paired w/ icon + text)
const SEED = [
  {
    id: 'n1', cat: 'analysis', group: 'today', unread: true,
    tone: 'accent', icon: 'scan-line',
    title: 'Your image analysis is ready',
    desc: 'Educational results and an explanation heatmap are available to view.',
    time: '12 min ago',
    cta: { label: 'View results', icon: 'arrow-right' },
  },
  {
    id: 'n2', cat: 'doctor', group: 'today', unread: true,
    tone: 'blue', icon: 'stethoscope',
    title: 'Professional review added',
    desc: 'A reviewer added an educational opinion to your lesion timeline.',
    tag: { tone: 'amber', icon: 'alert-triangle', label: 'Follow-up advised' },
    time: '1 hr ago',
    cta: { label: 'View review', icon: 'arrow-right' },
  },
  {
    id: 'n3', cat: 'system', group: 'today', unread: true,
    tone: 'amber', icon: 'shield-alert',
    title: 'Your consent expires in 14 days',
    desc: 'Renew to keep your lesion history available for professional review.',
    time: '3 hr ago',
    cta: { label: 'Review consent', icon: 'arrow-right' },
  },
  {
    id: 'n4', cat: 'analysis', group: 'earlier', unread: false,
    tone: 'green', icon: 'file-text',
    title: 'Lab result reviewed',
    desc: 'Your uploaded lab report finished processing and is ready to view.',
    tag: { tone: 'green', icon: 'check-circle', label: 'Processed' },
    time: 'Yesterday, 4:20 PM',
    cta: { label: 'Open lab results', icon: 'arrow-right' },
  },
  {
    id: 'n5', cat: 'system', group: 'earlier', unread: false,
    tone: 'amber', icon: 'smartphone',
    title: 'New device sign-in detected',
    desc: "A new device signed in to your account. If this wasn't you, review activity.",
    tag: { tone: 'amber', icon: 'alert-triangle', label: 'Security notice' },
    time: 'Yesterday, 9:02 AM',
    cta: { label: 'Review activity', icon: 'arrow-right' },
  },
  {
    id: 'n6', cat: 'system', group: 'earlier', unread: false,
    tone: 'neutral', icon: 'wrench',
    title: 'Scheduled maintenance',
    desc: 'Service may be briefly unavailable on Jun 9, 02:00–03:00 UTC.',
    time: 'Jun 3',
    cta: null,
  },
];

const GROUP_LABEL = { today: 'Today', earlier: 'Earlier' };

Object.assign(window, { TABS, SEED, GROUP_LABEL });
