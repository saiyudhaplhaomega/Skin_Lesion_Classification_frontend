"use client";

import { FormEvent, useState } from "react";

type AnalysisResult = {
  label: string;
  confidence: number;
  explanation?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function submitImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);
    setError("");

    if (!file) {
      setError("Choose an image before running the analysis.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/analysis`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`);
      }

      const data = (await response.json()) as AnalysisResult;
      setResult(data);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unknown error";
      setError(`Could not analyze the image. ${message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">Skin Lesion XAI</p>
        <h1>Upload a lesion image</h1>
        <p>
          This is not a medical diagnosis. The AI result is supportive information only.
          Please consult a qualified clinician for medical concerns.
        </p>

        <form className="upload-form" onSubmit={submitImage}>
          <label htmlFor="image">Image file</label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Run analysis"}
          </button>
        </form>

        {error ? <p className="error">{error}</p> : null}

        {result ? (
          <section className="result" aria-live="polite">
            <h2>Result</h2>
            <p>
              Label: <strong>{result.label}</strong>
            </p>
            <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
            {result.explanation ? <p>{result.explanation}</p> : null}
          </section>
        ) : null}
      </section>
    </main>
  );
}
