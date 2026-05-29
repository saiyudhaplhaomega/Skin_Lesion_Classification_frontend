export default function HomePage() {
  return (
    <main className="public-page">
      <section className="public-hero">
        <p className="eyebrow">AI-assisted monitoring</p>
        <h1>Skin Lesion AI Monitoring Platform</h1>
        <p>
          Educational AI-assisted skin lesion monitoring with Grad-CAM
          explainability, lesion history, body mapping, privacy modes, and
          doctor-review support.
        </p>
        <p className="safety-note">
          This platform is not a medical diagnosis tool. It provides educational
          AI-supported information and helps organize lesion history for
          professional review.
        </p>
      </section>
      <section className="public-grid" aria-label="Platform features">
        <article>
          <h2>Grad-CAM explainability</h2>
          <p>Review model attention maps as educational context, not proof of disease.</p>
        </article>
        <article>
          <h2>Lesion history</h2>
          <p>Organize body locations, image history, notes, and review tasks over time.</p>
        </article>
        <article>
          <h2>Privacy modes</h2>
          <p>Choose metadata-only, thumbnail, or fuller history workflows as consent allows.</p>
        </article>
      </section>
    </main>
  );
}
