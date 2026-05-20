export type AnalysisResponse = {
  case_id: string;
  prediction: string;
  confidence: number;
  explanation_available: boolean;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function analyzeImage(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/analysis`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Image analysis failed");
  }

  return response.json();
}
