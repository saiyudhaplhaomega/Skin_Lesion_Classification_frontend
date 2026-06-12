// Lab flow — gallery: masthead + sectioned, labeled frames
function Frame({ num, name, cap, wide, children }) {
  return (
    <div className="frame">
      <div className="frame-label">
        <span className="fl-num">{num}</span>
        <span className="fl-name">{name}</span>
      </div>
      {cap && <p className={`frame-cap ${wide ? 'wide' : ''}`}>{cap}</p>}
      {children}
    </div>
  );
}

function Section({ num, role, title, desc, children }) {
  return (
    <section className="sec">
      <div className="sec-head">
        <span className="sec-num">{num}</span>
        <span className={`sec-role ${role}`}>{role}</span>
        <h2>{title}</h2>
        <span className="sec-desc">{desc}</span>
      </div>
      <div className="frames">{children}</div>
    </section>
  );
}

function Gallery() {
  return (
    <div className="gallery">
      <header className="gallery-head">
        <div className="gh-top">
          <div className="wordmark">
            <span className="mark"><span className="reticle"></span></span>
            <div>
              <span className="wm" style={{ display: 'block' }}>Skin Lesion <b>XAI</b></span>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Lab result upload &amp; review · Clinical Premium</span>
            </div>
          </div>
          <div className="gh-tags">
            <span className="gh-tag"><Icon name="file-text" size={13} />PDF &amp; image reports</span>
            <span className="gh-tag"><Icon name="shield-check" size={13} />Consent-gated review</span>
            <span className="gh-tag"><Icon name="contrast" size={13} />WCAG AA · 44px targets</span>
          </div>
        </div>
        <h1>Lab result upload &amp; review flow</h1>
        <p className="gh-sub">A patient uploads a PDF or image lab report, fields are extracted by OCR, and a clinician verifies the transcription before it joins the lesion case. Every required state is rendered as a labeled frame — patient screens on mobile, the clinician&rsquo;s review on desktop. Status is always shown as color plus icon and text.</p>
        <div className="gallery-band">
          <Icon name="info" size={18} />
          <p><strong>Context, not conclusions.</strong> The AI model never reads or interprets lab values — it only extracts text so a human can verify it. Lab results are clinical context attached to a case for professional review, and the safety disclaimer rides on every patient surface.</p>
        </div>
      </header>

      {/* ── PATIENT — upload & consent ─────────────────────────────────── */}
      <Section num="01" role="patient" title="Upload &amp; consent" desc="Add a report, confirm its details, and grant explicit consent before any clinician sees it.">
        <Frame num="01" name="Upload prompt" cap="Drag-drop or photograph a PDF / image. File-type, focus and privacy guidance up front; the safety disclaimer is always present.">
          <PFUpload />
        </Frame>
        <Frame num="02" name="Details &amp; consent" cap="File preview, lab name, test-date picker and an optional note. Doctor review stays disabled until the explicit consent box is checked.">
          <PFDetails />
        </Frame>
      </Section>

      {/* ── PATIENT — processing & tracking ────────────────────────────── */}
      <Section num="02" role="patient" title="Processing &amp; tracking" desc="A calm status tracker: Uploaded → Extracting → Review pending → Reviewed. Never alarmist, never a countdown.">
        <Frame num="03" name="Uploading in progress" cap="Honest progress with file size. The status tracker shows where the report is in the journey; the upload can be cancelled.">
          <PFUploading />
        </Frame>
        <Frame num="04" name="Processing OCR" cap="Fields are being extracted for a human to verify. Copy makes clear the model reads text only — it does not interpret the values.">
          <PFProcessing />
        </Frame>
        <Frame num="05" name="Pending doctor review" cap="Consent given, report sent. The patient waits on a clear blue review-pending state with the full tracker and the original file.">
          <PFPending />
        </Frame>
      </Section>

      {/* ── PATIENT — outcomes ─────────────────────────────────────────── */}
      <Section num="03" role="patient" title="Outcomes" desc="Reviewed (approved / rejected) and the error path. Each makes the clinical-context framing explicit.">
        <Frame num="06" name="Reviewed — approved" cap="A clinician verified the extraction. Green band, the doctor&rsquo;s note, and a read-only verified summary — framed as transcription confirmed, not a diagnosis.">
          <PFApproved />
        </Frame>
        <Frame num="07" name="Reviewed — rejected" cap="Couldn&rsquo;t be verified. Deliberately un-alarming neutral grey, a reassuring note, and a clear re-upload path. Never blames the patient.">
          <PFRejected />
        </Frame>
        <Frame num="08" name="Error state" cap="Upload interrupted. Reassures the file is saved as a draft and offers a retry — no error codes, no lost work.">
          <PFError />
        </Frame>
      </Section>

      {/* ── DOCTOR — review queue ──────────────────────────────────────── */}
      <Section num="04" role="doctor" title="Review queue" desc="Pseudonymized lab results awaiting extraction review, flagged where the OCR confidence is low.">
        <Frame num="09" name="Lab review queue" wide cap="A worklist of reports awaiting verification — lab, test date, type and per-row status. Low-confidence extractions are flagged for attention; a banner reminds the reviewer they verify transcription, not interpret results.">
          <DFQueue />
        </Frame>
      </Section>

      {/* ── DOCTOR — verify & decide ───────────────────────────────────── */}
      <Section num="05" role="doctor" title="Verify &amp; decide" desc="Original document beside editable extracted fields, the linked case, and an approve / reject decision with notes.">
        <Frame num="10" name="Verify extracted fields" wide cap="Original report on the left, OCR-extracted fields on the right — every field editable, low-confidence ones flagged amber. Transcribed values are explicitly &lsquo;verify, not interpret&rsquo;, and the case links back to its body-map pin and lesion history.">
          <DoctorReview label="Verify extracted fields" />
        </Frame>
        <Frame num="11" name="Approve with note" wide cap="Approve selected. The note defaults to language that confirms the transcription only; submitting logs to the audit trail and attaches verified context to the case.">
          <DoctorReview initialVerdict="approve" confirm={true} label="Approve — verified" />
        </Frame>
        <Frame num="12" name="Reject with reason" wide cap="Reject selected with a structured reason and a patient-facing explanation. The case stays open until a clearer copy is re-uploaded; tone never blames the patient.">
          <DoctorReview initialVerdict="reject" initialReason="Page cropped / unreadable" label="Reject — needs re-upload" />
        </Frame>
      </Section>

      <footer className="foot">
        <span>Skin Lesion XAI — Design System · Clinical Premium · Inter + JetBrains Mono</span>
        <span>Educational platform · not a medical diagnosis tool</span>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Gallery />);
requestAnimationFrame(() => { if (window.lucide) window.lucide.createIcons(); });
