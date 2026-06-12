import type { Metadata } from "next";
import { PublicShell } from "../../components/site/PublicShell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read safe-use terms for the educational skin lesion monitoring platform.",
  alternates: { canonical: "/terms" },
};

const terms = [
  {
    title: "Educational use only",
    body: "This platform is not a medical device and provides no diagnosis. All outputs are educational information intended to support — never replace — consultation with a qualified dermatologist.",
  },
  {
    title: "No clinical reliance",
    body: "Do not make treatment decisions based on platform output. Seek immediate professional care for any concerning skin change, regardless of what the model predicts.",
  },
  {
    title: "Data responsibility",
    body: "You control which privacy mode applies to your data. Uploaded content must be your own or used with the subject's explicit consent.",
  },
  {
    title: "Service limitations",
    body: "Model predictions carry inherent uncertainty and dataset bias. The service is provided as-is for educational and research demonstration purposes.",
  },
];

export default function TermsPage() {
  return (
    <PublicShell
      eyebrow="Legal"
      title="Terms of service"
      lead="Safe-use terms for an educational, non-diagnostic AI platform."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {terms.map((t) => (
          <article key={t.title} className="glass edge-light p-6">
            <h2 className="text-base font-semibold">{t.title}</h2>
            <p className="mt-3 text-sm">{t.body}</p>
          </article>
        ))}
      </div>
    </PublicShell>
  );
}
