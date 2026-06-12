// Lab flow — doctor-facing frames (desktop browser window)
const { useState: useStateD } = React;

/* ── Browser window chrome + doctor app shell ─────────────────────────── */
function DoctorShell({ page, title, sub, children, label }) {
  const NAV = [
    { id: 'queue', label: 'Review queue', icon: 'inbox' },
    { id: 'labs', label: 'Lab results', icon: 'file-text', badge: '6' },
    { id: 'history', label: 'Case history', icon: 'history' },
  ];
  return (
    <div className="win">
      <div className="win-bar">
        <div className="wdots"><i></i><i></i><i></i></div>
        <div className="url"><Icon name="lock" size={11} />app.skinlesionxai.health/review/labs</div>
      </div>
      <div className="win-screen" data-screen-label={'Doctor · ' + (label || title)}>
        <div className="dshell">
          <aside className="dside">
            <div className="dbrand">
              <div className="mark"><div className="reticle"></div></div>
              <div className="wm">Skin Lesion <b>XAI</b></div>
            </div>
            <div className="dnavlabel">Clinician</div>
            {NAV.map(n => (
              <button key={n.id} className={`dnav ${page === n.id ? 'active' : ''}`}>
                <Icon name={n.icon} size={18} />{n.label}
                {n.badge && <span className="badge">{n.badge}</span>}
              </button>
            ))}
            <div className="dside-foot">
              <div className="davatar">RA</div>
              <div><div className="nm">Dr. R. Adeyemi</div><div className="rl">Dermatology · Reviewer</div></div>
            </div>
          </aside>
          <div className="dwork">
            <header className="dtopbar">
              <div className="tt"><h2>{title}</h2>{sub && <span className="ts">{sub}</span>}</div>
              <div className="tr">
                <div className="dsearch"><Icon name="search" size={15} />Search cases…</div>
                <button className="dicon-btn" aria-label="Notifications"><Icon name="bell" size={17} /><span className="dot"></span></button>
              </div>
            </header>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── D1. Lab review queue ─────────────────────────────────────────────── */
const QUEUE = [
  { id: 'LAB-2026-0188', case: 'CSE-2026-0413', lab: 'Meridian Pathology', type: 'Blood panel', typeIcon: 'file-text', date: '2026-05-22', recv: '2026-06-04', flag: '2 low-confidence fields', sel: true },
  { id: 'LAB-2026-0187', case: 'CSE-2026-0410', lab: 'Northgate Labs', type: 'Pathology report', typeIcon: 'clipboard-list', date: '2026-05-19', recv: '2026-06-04', flag: null },
  { id: 'LAB-2026-0185', case: 'CSE-2026-0402', lab: 'St. Brides Clinic', type: 'Image scan', typeIcon: 'image', date: '2026-05-15', recv: '2026-06-03', flag: 'Page may be cropped' },
  { id: 'LAB-2026-0181', case: 'CSE-2026-0398', lab: 'Meridian Pathology', type: 'Blood panel', typeIcon: 'file-text', date: '2026-05-11', recv: '2026-06-03', flag: null },
];
function DFQueue() {
  return (
    <DoctorShell page="labs" title="Lab results" sub="Pseudonymized · awaiting extraction review" label="Lab review queue">
      <div className="dcontent">
        <div className="dqueue-head">
          <div className="qtitle"><h3>Awaiting review</h3><Chip tone="blue" icon="stethoscope">6 pending</Chip></div>
          <div className="dqueue-filters">
            <span className="dqf on">All</span>
            <span className="dqf">Needs attention</span>
            <span className="dqf">Blood panels</span>
            <span className="dqf">Pathology</span>
          </div>
        </div>
        <div className="ctx-banner" style={{ marginBottom: 16 }}>
          <Icon name="info" size={16} />
          <p><strong>You are verifying transcription accuracy, not interpreting results.</strong> Confirm the extracted fields match the original document, then approve or reject. Lab values are clinical context for the case — not AI diagnostic output.</p>
        </div>
        <div className="dtable">
          <div className="thead">
            <span>Lab ID</span><span>Lab / facility</span><span>Test date</span><span>Received</span><span>Report type</span><span>Status</span>
          </div>
          {QUEUE.map(r => (
            <div key={r.id} className={`trow ${r.sel ? 'sel' : ''}`}>
              <div className="c-id">{r.id}<div className="sub">{r.case}</div></div>
              <div className="c-lab">{r.lab}<div className="sub">Patient pseudonymized</div></div>
              <div className="c-mono">{r.date}</div>
              <div className="c-mono">{r.recv}</div>
              <div className="c-type"><Icon name={r.typeIcon} size={14} />{r.type}</div>
              <div>
                {r.flag
                  ? <span className="c-flag"><Icon name="alert-triangle" size={13} />{r.flag}</span>
                  : <Chip tone="neutral" icon="clock">Ready to verify</Chip>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DoctorShell>
  );
}

/* ── OCR field + value-table helpers ──────────────────────────────────── */
function OcrField({ label, value, conf = 'high', mono }) {
  return (
    <div className={`ocr-field ${conf === 'low' ? 'flag' : ''}`}>
      <div className="of-lbl">
        <span className="k">{label}</span>
        <span className={`ocr-conf ${conf}`}>
          <Icon name={conf === 'low' ? 'alert-triangle' : 'check'} size={11} />
          {conf === 'low' ? 'Low' : 'High'}
        </span>
      </div>
      <div className={`of-in ${mono ? 'mono' : ''}`}>
        <input type="text" defaultValue={value} aria-label={label} />
        <span className="edit"><Icon name="pencil" size={14} /></span>
      </div>
    </div>
  );
}

const VALUES = [
  { k: 'Vitamin D, 25-OH', v: '24', ref: '30–80 ng/mL', flag: false },
  { k: 'Calcium, total', v: '9.4', ref: '8.6–10.2 mg/dL', flag: false },
  { k: 'TSH', v: '2.1', ref: '0.4–4.0 mIU/L', flag: true },
];

/* ── Doctor review detail (D2 verify · D3 approve · D4 reject) ─────────── */
function DoctorReview({ initialVerdict = null, initialReason = null, confirm = null, label }) {
  const [verdict, setVerdict] = useStateD(initialVerdict);
  const [reason, setReason] = useStateD(initialReason);
  const [showConfirm, setShowConfirm] = useStateD(!!confirm);
  const REASONS = ['Page cropped / unreadable', 'Wrong document', 'Fields don\u2019t match', 'Duplicate upload'];

  const sub = verdict === 'approve' ? 'Verifying extraction · approving'
    : verdict === 'reject' ? 'Verifying extraction · rejecting'
    : 'Verify extracted fields against the original';

  return (
    <DoctorShell page="labs" title="LAB-2026-0188" sub={sub} label={label}>
      <div className="dreview">
        {/* original document */}
        <div className="dr-left">
          <div className="dr-doc-head">
            <div className="dh-l"><Icon name="file-text" size={16} /><span className="nm">vitamin-d-panel-may.pdf</span><span className="pg">page 1 / 1</span></div>
            <div className="dr-doc-tools">
              <button className="tool" aria-label="Zoom in"><Icon name="zoom-in" size={15} /></button>
              <button className="tool" aria-label="Rotate"><Icon name="rotate-cw" size={15} /></button>
              <button className="tool" aria-label="Open original"><Icon name="external-link" size={15} /></button>
            </div>
          </div>
          <div className="dr-doc-stage">
            <div className="doc-page scan">
              <div className="dp-brand">
                <div><div className="dp-lab">Meridian Pathology</div><div className="dp-sub">Accredited clinical laboratory</div></div>
                <div className="dp-acc">Accession<br /><b>MP-0455-2261</b></div>
              </div>
              <div className="dp-meta">
                <div><span className="mk">Collected </span><span className="mv">2026-05-22</span></div>
                <div><span className="mk">Reported </span><span className="mv">2026-05-24</span></div>
                <div><span className="mk">Ordering </span><span className="mv">Dr. P. Okafor</span></div>
                <div><span className="mk">Specimen </span><span className="mv">Serum</span></div>
              </div>
              <div className="dp-title">Result summary</div>
              <table className="dp-tbl">
                <thead><tr><th>Analyte</th><th className="r">Result</th><th className="r">Reference</th></tr></thead>
                <tbody>
                  <tr><td>Vitamin D, 25-OH</td><td className="r"><span className="hl">24</span></td><td className="r">30–80 ng/mL</td></tr>
                  <tr><td>Calcium, total</td><td className="r">9.4</td><td className="r">8.6–10.2 mg/dL</td></tr>
                  <tr><td>TSH</td><td className="r"><span className="hl">2.1</span></td><td className="r">0.4–4.0 mIU/L</td></tr>
                </tbody>
              </table>
              <div className="dp-foot">Reference ranges are method-dependent. This report is for the named patient and ordering clinician. Not a screening or diagnostic conclusion.</div>
            </div>
          </div>
        </div>

        {/* extraction + verdict */}
        <div className="dr-right">
          <div className="dr-r-scroll">
            <div className="ctx-banner tealedge">
              <Icon name="info" size={16} />
              <p><strong>Verify the transcription matches the document.</strong> Edit any field the model read incorrectly. Highlighted values link to where they sit on the page.</p>
            </div>

            <div>
              <div className="dr-block-h">Extracted fields<span className="cnt">5 fields</span></div>
              <div className="ocr-grid">
                <OcrField label="Lab / facility" value="Meridian Pathology" conf="high" />
                <OcrField label="Test date" value="2026-05-22" conf="high" mono />
                <OcrField label="Accession no." value="MP-0455-2261" conf="low" mono />
                <OcrField label="Ordering provider" value="Dr. P. Okafor" conf="high" />
              </div>
              <div style={{ marginTop: 12 }}>
                <OcrField label="Report type" value="Blood panel — vitamin D, metabolic" conf="high" />
              </div>
            </div>

            <div>
              <div className="dr-block-h">Transcribed values<span className="cnt">verify · not interpreted</span></div>
              <div className="val-tbl">
                <div className="vh"><span>Analyte</span><span>Value</span><span>Reference</span><span></span></div>
                {VALUES.map((v, i) => (
                  <div key={i} className={`vr ${v.flag ? 'flag' : ''}`}>
                    <span className="vk">{v.k}</span>
                    <input className="vin" defaultValue={v.v} aria-label={v.k + ' value'} />
                    <span className="vk" style={{ fontWeight: 400, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>{v.ref}</span>
                    <span className="vflag">{v.flag && <Icon name="alert-triangle" size={14} />}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="dr-block-h">Linked case</div>
              <div className="case-link">
                <div className="cl-top">
                  <div className="cl-thumb"><div className="ph"></div><span className="pin"><Icon name="map-pin" size={9} />07</span></div>
                  <div className="cl-main">
                    <div className="cid">CSE-2026-0413</div>
                    <div className="cloc">Upper back · pin 07</div>
                    <div className="cmeta">3 lesion images · last analyzed 2026-06-03</div>
                  </div>
                  <StatusChip status="amber" label="Monitor" />
                </div>
                <div className="cl-links">
                  <a><Icon name="map-pin" size={14} />Open on body map</a>
                  <a><Icon name="history" size={14} />View lesion history</a>
                </div>
              </div>
            </div>

            <div>
              <div className="dr-block-h">Patient note</div>
              <div className="pnote"><p>"Ordered by my GP to check vitamin D — adding it here so it's in one place for my next dermatology visit."</p></div>
            </div>
          </div>

          {/* verdict footer */}
          <div className="dr-footer">
            <div className="verdict-opts">
              <div className={`verdict-opt approve ${verdict === 'approve' ? 'sel' : ''}`} onClick={() => setVerdict('approve')}>
                <span className="vico"><Icon name="check" size={13} /></span>Approve — extraction verified
              </div>
              <div className={`verdict-opt reject ${verdict === 'reject' ? 'sel' : ''}`} onClick={() => setVerdict('reject')}>
                <span className="vico"><Icon name="x" size={13} /></span>Reject — needs re-upload
              </div>
            </div>

            {verdict === 'reject' && (
              <div className="reason-chips">
                {REASONS.map(r => (
                  <span key={r} className={`reason-chip ${reason === r ? 'sel' : ''}`} onClick={() => setReason(r)}>{r}</span>
                ))}
              </div>
            )}

            <textarea className="notes"
              placeholder={verdict === 'reject' ? 'Explain what the patient should re-upload (sent to the patient)…' : 'Note for the patient and case record (optional)…'}
              defaultValue={
                verdict === 'approve' ? 'Fields match the uploaded report. Added as verified context — not a diagnosis or interpretation of the values.'
                : verdict === 'reject' ? 'The scan is partly cut off, so the values can\u2019t be confirmed. Please re-upload a full, in-focus copy of all pages.'
                : ''}></textarea>

            <div className="dr-submit-row">
              <span className="meta"><Icon name="shield-check" size={13} />Logged to the audit trail</span>
              <span className="grow"></span>
              {verdict === 'reject'
                ? <button className="btn btn-danger" onClick={() => setShowConfirm(true)}><Icon name="x" size={16} />Reject &amp; notify patient</button>
                : <button className="btn btn-primary" disabled={verdict !== 'approve'} onClick={() => setShowConfirm(true)}><Icon name="check" size={16} />Submit verification</button>}
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="dr-confirm" onClick={() => setShowConfirm(false)}>
          <div className="dr-confirm-card" onClick={e => e.stopPropagation()}>
            <div className={`ci ${verdict === 'approve' ? 'green' : 'neutral'}`}>
              <Icon name={verdict === 'approve' ? 'check-circle' : 'rotate-ccw'} size={26} />
            </div>
            <h3>{verdict === 'approve' ? 'Extraction verified' : 'Sent back for re-upload'}</h3>
            <p>{verdict === 'approve'
              ? 'The verified fields are attached to case CSE-2026-0413 as clinical context. The patient has been notified.'
              : 'The patient has been asked to re-upload a clearer copy. The case stays open until a new file arrives.'}</p>
            <Btn onClick={() => setShowConfirm(false)} icon="arrow-right">Next in queue</Btn>
          </div>
        </div>
      )}
    </DoctorShell>
  );
}

Object.assign(window, { DoctorShell, DFQueue, DoctorReview });
