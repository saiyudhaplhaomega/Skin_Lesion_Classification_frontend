// Lab flow — patient-facing state frames (mobile)
const { useState: useStateP } = React;

// Reusable tracker step definitions ------------------------------------------
function trackerSteps(stage) {
  // stage: 'uploading' | 'ocr' | 'pending' | 'approved' | 'rejected'
  const S = (state, extra) => ({ state, ...extra });
  const base = {
    uploaded: { key: 'up', title: 'Uploaded', icon: 'upload', desc: 'Report received and encrypted.' },
    ocr: { key: 'ocr', title: 'Extracting fields', icon: 'scan-line', desc: 'Reading text from your report.' },
    review: { key: 'rev', title: 'Review pending', icon: 'stethoscope', desc: 'Waiting for a clinician to verify.' },
    done: { key: 'done', title: 'Reviewed', icon: 'check-circle', desc: 'A clinician has checked the extraction.' },
  };
  if (stage === 'uploading') return [
    { ...base.uploaded, ...S('active', { spin: true, desc: 'Sending your report securely…' }) },
    { ...base.ocr, ...S('pending') },
    { ...base.review, ...S('pending') },
    { ...base.done, ...S('pending') },
  ];
  if (stage === 'ocr') return [
    { ...base.uploaded, ...S('done', { time: '09:41' }) },
    { ...base.ocr, ...S('active', { spin: true, desc: 'Reading text from your report…' }) },
    { ...base.review, ...S('pending') },
    { ...base.done, ...S('pending') },
  ];
  if (stage === 'pending') return [
    { ...base.uploaded, ...S('done', { time: '09:41' }) },
    { ...base.ocr, ...S('done', { desc: 'Fields extracted and ready.', time: '09:41' }) },
    { ...base.review, ...S('active', { icon: 'stethoscope', tone: '', desc: 'Sent to your care team for verification.' }) },
    { ...base.done, ...S('pending') },
  ];
  if (stage === 'approved') return [
    { ...base.uploaded, ...S('done') },
    { ...base.ocr, ...S('done') },
    { ...base.review, ...S('done', { desc: 'Verified by Dr. R. Adeyemi.' }) },
    { ...base.done, title: 'Reviewed — verified', ...S('active', { tone: 'green', icon: 'check', desc: 'Extraction confirmed accurate.', time: '2026-06-04' }) },
  ];
  // rejected
  return [
    { ...base.uploaded, ...S('done') },
    { ...base.ocr, ...S('done') },
    { ...base.review, ...S('done') },
    { ...base.done, title: 'Reviewed — needs a new upload', ...S('active', { tone: 'red', icon: 'rotate-ccw', desc: 'Couldn\u2019t be verified against the original.', time: '2026-06-04' }) },
  ];
}

/* ── P1. Upload prompt ────────────────────────────────────────────────── */
function PFUpload() {
  return (
    <PhoneScreen title="Add lab result">
      <p style={{ margin: '0 2px', fontSize: 13, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
        Add a lab or pathology report to keep alongside your lesion history for your clinician to review.
      </p>
      <div className="dropzone">
        <div className="dzi"><Icon name="upload-cloud" size={24} /></div>
        <h3>Drag a report here</h3>
        <p>or choose a source below</p>
        <div className="dz-formats">
          <Chip tone="neutral" icon="file-text">PDF</Chip>
          <Chip tone="neutral" icon="image">JPG / PNG</Chip>
        </div>
      </div>
      <div className="action-row">
        <Btn icon="folder">Browse files</Btn>
        <Btn variant="secondary" icon="camera">Photograph</Btn>
      </div>
      <div className="file-guide">
        <div className="fg-row"><Icon name="file-check-2" size={14} />PDF or image, up to 20&nbsp;MB</div>
        <div className="fg-row"><Icon name="eye" size={14} />Make sure text is in focus and fully visible</div>
        <div className="fg-row"><Icon name="lock" size={14} />Stored encrypted; shared only when you ask for review</div>
      </div>
      <LabContextBanner />
      <Disclaimer />
    </PhoneScreen>
  );
}

/* ── P2. Details & consent ────────────────────────────────────────────── */
function PFDetails() {
  return (
    <PhoneScreen title="Report details">
      <FileCard kind="pdf" name="vitamin-d-panel-may.pdf" sub="1 page · 248 KB" verified />
      <Field label="Lab or facility name" icon="building-2" value="Meridian Pathology" />
      <div className="fieldgrid">
        <Field label="Test date" icon="calendar" value="2026-05-22" mono />
        <Field label="Report type" icon="clipboard-list" value="Blood panel" />
      </div>
      <Field label="Note for your clinician" optional icon="message-square" area
        placeholder="e.g. ordered by my GP to check vitamin D" />
      <ConsentRow on={true}>
        I consent to share this report and its extracted fields, pseudonymously, with a reviewing clinician. <b>Doctor review stays disabled until this is checked.</b>
      </ConsentRow>
      <div className="action-row">
        <Btn variant="secondary" icon="save">Save to history</Btn>
        <Btn icon="stethoscope">Send for review</Btn>
      </div>
      <Disclaimer />
    </PhoneScreen>
  );
}

/* ── P3. Uploading in progress ────────────────────────────────────────── */
function PFUploading() {
  return (
    <PhoneScreen title="Adding report">
      <div className="center-state">
        <div className="spinner" aria-hidden="true"></div>
        <h3>Uploading your report…</h3>
        <p>Keep this screen open. This usually takes a few seconds.</p>
        <div className="prog"><div className="fill" style={{ width: '46%' }}></div></div>
        <div className="prog-meta"><span>vitamin-d-panel-may.pdf</span><span>114 / 248 KB</span></div>
      </div>
      <StatusTracker steps={trackerSteps('uploading')} compact />
      <button className="btn btn-ghost btn-block" style={{ minHeight: 44 }}>Cancel upload</button>
      <Disclaimer />
    </PhoneScreen>
  );
}

/* ── P4. Processing OCR ───────────────────────────────────────────────── */
function PFProcessing() {
  return (
    <PhoneScreen title="Reading report">
      <div className="center-state">
        <div className="csi teal"><Icon name="scan-line" size={26} /></div>
        <h3>Extracting fields…</h3>
        <p>We're reading the text so your clinician can verify it. This typically takes 10–20 seconds.</p>
      </div>
      <StatusTracker steps={trackerSteps('ocr')} compact />
      <LabContextBanner />
      <Disclaimer />
    </PhoneScreen>
  );
}

/* ── P5. Pending doctor review ────────────────────────────────────────── */
function PFPending() {
  return (
    <PhoneScreen title="Lab result">
      <div className="rev-band" style={{ background: 'var(--blue-bg)', borderColor: 'var(--blue-border)' }}>
        <span className="rbi" style={{ background: 'var(--blue)', color: '#fff' }}><Icon name="stethoscope" size={17} /></span>
        <div>
          <div className="rbt" style={{ color: 'var(--blue)' }}>Waiting for professional review</div>
          <div className="rbd">Your report and its extracted fields were sent for a clinician to verify. We'll notify you when it's checked.</div>
        </div>
      </div>
      <StatusTracker steps={trackerSteps('pending')} />
      <FileCard kind="pdf" name="vitamin-d-panel-may.pdf" sub="Meridian Pathology · 2026-05-22" onRemove={false} />
      <LabContextBanner />
      <Disclaimer />
    </PhoneScreen>
  );
}

/* ── P6. Reviewed — approved ──────────────────────────────────────────── */
function PFApproved() {
  return (
    <PhoneScreen title="Lab result">
      <div className="rev-band green">
        <span className="rbi"><Icon name="check" size={17} /></span>
        <div>
          <div className="rbt">Reviewed — extraction verified</div>
          <div className="rbd">A clinician confirmed the transcribed fields match your report. It's saved as verified context in your history.</div>
        </div>
      </div>
      <StatusTracker steps={trackerSteps('approved')} compact />
      <div className="doctor-note">
        <div className="dnh">
          <span className="av">RA</span>
          <div><div className="nm">Dr. R. Adeyemi</div><div className="rl">Dermatology · Reviewer</div></div>
          <span className="when">2026-06-04</span>
        </div>
        <div className="dnb">Fields match the uploaded report. Added to your record for context at your next visit. <b>This confirms the transcription only — it is not a diagnosis or an interpretation of the values.</b></div>
      </div>
      <LabSummary title="Meridian Pathology · blood panel" rows={[
        { k: 'Test date', v: '2026-05-22', mono: true },
        { k: 'Accession', v: 'MP-0455-2261', mono: true },
        { k: 'Vitamin D, 25-OH', v: '24 ng/mL', mono: true },
        { k: 'Reference range', v: '30\u201380 ng/mL', mono: true },
      ]} />
      <LabContextBanner teal />
      <Disclaimer />
    </PhoneScreen>
  );
}

/* ── P7. Reviewed — rejected ──────────────────────────────────────────── */
function PFRejected() {
  return (
    <PhoneScreen title="Lab result">
      <div className="rev-band neutral">
        <span className="rbi"><Icon name="rotate-ccw" size={17} /></span>
        <div>
          <div className="rbt">Couldn't verify this upload</div>
          <div className="rbd">A clinician couldn't confirm the fields against the original. Nothing is wrong with your health — the file just needs a clearer copy.</div>
        </div>
      </div>
      <StatusTracker steps={trackerSteps('rejected')} compact />
      <div className="doctor-note">
        <div className="dnh">
          <span className="av">RA</span>
          <div><div className="nm">Dr. R. Adeyemi</div><div className="rl">Dermatology · Reviewer</div></div>
          <span className="when">2026-06-04</span>
        </div>
        <div className="dnb">The scan is partly cut off, so the values can't be confirmed. Please re-upload a full, in-focus copy of all pages and I'll take another look.</div>
      </div>
      <div className="action-row">
        <Btn variant="secondary" icon="message-square">Message clinician</Btn>
        <Btn icon="upload">Re-upload report</Btn>
      </div>
      <LabContextBanner />
      <Disclaimer />
    </PhoneScreen>
  );
}

/* ── P8. Error ────────────────────────────────────────────────────────── */
function PFError() {
  return (
    <PhoneScreen title="Add lab result">
      <div className="center-state">
        <div className="csi neutral"><Icon name="cloud-off" size={26} /></div>
        <h3>Upload interrupted</h3>
        <p>Something unexpected happened while adding your report. Nothing was lost.</p>
        <span className="saved-note"><Icon name="check" size={14} />Your file has been saved as a draft</span>
      </div>
      <div className="action-row">
        <Btn icon="refresh-cw">Try again</Btn>
        <Btn variant="secondary" icon="file-up">Choose another file</Btn>
      </div>
      <LabContextBanner />
      <Disclaimer />
    </PhoneScreen>
  );
}

Object.assign(window, {
  PFUpload, PFDetails, PFUploading, PFProcessing, PFPending, PFApproved, PFRejected, PFError,
});
