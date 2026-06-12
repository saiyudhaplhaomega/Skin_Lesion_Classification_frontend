/* ============================================================================
   Research dashboard — gallery app.
   Mounts: (1) an interactive Live console, (2) five static operational-state
   frames, (3) a mobile showcase (real narrow iframes). Wires the live controls.
   ============================================================================ */
(function () {
  'use strict';
  const RDVM = window.RDVM;
  const refreshIcons = () => { if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.75 } }); };

  /* ── Live console (interactive) ──────────────────────────────────────── */
  const live = { range: '30d', version: 'v3.4.1', role: 'researcher' };

  function renderLive() {
    const host = document.getElementById('live');
    host.innerHTML = RDVM.renderState({ mode: 'full', live: true, range: live.range, version: live.version, role: live.role });
    refreshIcons();
  }

  function wireLive() {
    const host = document.getElementById('live');
    host.addEventListener('click', (e) => {
      const ddBtn = e.target.closest('[data-dd="version"]');
      if (ddBtn) {
        const pop = ddBtn.parentElement.querySelector('.rd-menu-pop');
        const open = pop.hasAttribute('hidden');
        if (open) { pop.removeAttribute('hidden'); ddBtn.setAttribute('aria-expanded', 'true'); }
        else { pop.setAttribute('hidden', ''); ddBtn.setAttribute('aria-expanded', 'false'); }
        return;
      }
      const ver = e.target.closest('[data-version]');
      if (ver) { live.version = ver.getAttribute('data-version'); renderLive(); return; }
      const range = e.target.closest('[data-range]');
      if (range) { live.range = range.getAttribute('data-range'); renderLive(); return; }
      const role = e.target.closest('[data-role]');
      if (role) { live.role = role.getAttribute('data-role'); renderLive(); return; }
    });
    // close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (e.target.closest('#live .rd-dd')) return;
      const pop = document.querySelector('#live .rd-menu-pop');
      if (pop && !pop.hasAttribute('hidden')) {
        pop.setAttribute('hidden', '');
        const b = document.querySelector('#live [data-dd="version"]');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── Static operational-state frames ─────────────────────────────────── */
  const FRAMES = [
    { n: '01', key: 'loading',   title: 'Loading skeleton', sub: 'data fetch in progress', chip: chip('neutral', 'loader', 'Loading') },
    { n: '02', key: 'populated', title: 'Data populated', sub: 'nominal — all metrics within bounds', chip: chip('green', 'check-circle', 'Healthy') },
    { n: '03', key: 'empty',     title: 'No data yet', sub: 'newly registered model, pre-evaluation', chip: chip('neutral', 'circle-dashed', 'Empty') },
    { n: '04', key: 'drift',     title: 'Drift alert active', sub: 'output distribution shift exceeds limit', chip: chip('red', 'alert-octagon', 'Drift alert') },
    { n: '05', key: 'calib',     title: 'Calibration drift warning', sub: 'ECE rising — model overconfident', chip: chip('amber', 'alert-triangle', 'Calibration warning') },
  ];
  function chip(tone, icon, label) {
    return `<span class="chip ${tone}"><span class="app-icon"><i data-lucide="${icon}"></i></span>${label}</span>`;
  }
  function renderFrames() {
    document.getElementById('frames').innerHTML = FRAMES.map((f) => `
      <div class="frame">
        <div class="frame-cap">
          <span class="num">${f.n}</span>
          <h2>${f.title}</h2>
          <span class="sub">${f.sub}</span>
          <span class="spacer"></span>
          ${f.chip}
        </div>
        <div class="frame-body">${RDVM.renderState(f.key)}</div>
      </div>`).join('');
  }

  /* ── Mobile showcase (true narrow viewports via iframe) ──────────────── */
  const PHONES = [
    { state: 'populated', label: 'Data populated', sub: 'single-column, sidebar collapses to menu' },
    { state: 'drift', label: 'Drift alert', sub: 'banner + status stay legible at 390px' },
    { state: 'loading', label: 'Loading', sub: 'skeleton reflows to one column' },
  ];
  function renderPhones() {
    document.getElementById('phones').innerHTML = PHONES.map((p) => `
      <figure class="phone">
        <div class="phone-bezel">
          <div class="phone-notch"></div>
          <iframe class="phone-screen" src="mobile-view.html?state=${p.state}" title="${p.label} — mobile" loading="lazy"></iframe>
        </div>
        <figcaption><b>${p.label}</b><span>${p.sub}</span></figcaption>
      </figure>`).join('');
  }

  function init() {
    renderLive();
    wireLive();
    renderFrames();
    renderPhones();
    refreshIcons();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
