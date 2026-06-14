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

export type LabResultResponse = {
  id: string;
  lesion_id: string | null;
  test_date: string | null;
  lab_name: string | null;
  file_type: string;
  status: string;
  patient_note: string | null;
  doctor_note: string | null;
  consent_to_share_with_doctor: boolean;
  created_at: string;
};

export type LabExtractedValueResponse = {
  id: string;
  extraction_run_id: string;
  name: string;
  value: string;
  unit: string | null;
  confidence: number;
  review_status: string;
  reviewed_value: string | null;
  reviewed_unit: string | null;
  review_note: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type LabExtractionRunResponse = {
  id: string;
  lab_result_id: string;
  provider: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  values: LabExtractedValueResponse[];
};

export type LabOcrReviewPageResponse = {
  lab_result: LabResultResponse;
  run: LabExtractionRunResponse;
};

export type LabOcrReviewPayload = {
  review_status: "accepted" | "edited" | "rejected";
  reviewed_value?: string;
  reviewed_unit?: string;
  review_note?: string;
};

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getLatestLabOcrRun(labResultId: string): Promise<LabOcrReviewPageResponse> {
  return apiJson<LabOcrReviewPageResponse>(`/api/v1/lab-results/${labResultId}/ocr-runs/latest`);
}

export async function createLabOcrRun(labResultId: string): Promise<LabExtractionRunResponse> {
  return apiJson<LabExtractionRunResponse>(`/api/v1/lab-results/${labResultId}/ocr-runs`, {
    method: "POST",
  });
}

export async function reviewLabOcrValue(
  labResultId: string,
  valueId: string,
  payload: LabOcrReviewPayload,
): Promise<LabExtractedValueResponse> {
  return apiJson<LabExtractedValueResponse>(
    `/api/v1/lab-results/${labResultId}/ocr-values/${valueId}/review`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}
