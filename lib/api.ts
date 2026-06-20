// ---------------------------------------------------------------------------
// lib/api.ts - Complete client for the backend FastAPI.
// All 29 backend endpoints are wrapped by exported client methods below.
// Every method targets the URL in API_BASE_URL (env var NEXT_PUBLIC_API_BASE_URL).
// ---------------------------------------------------------------------------

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

// ---------- Shared types ----------

export type AnalysisResponse = {
  case_id: string;
  prediction: string;
  confidence: number;
  explanation_available: boolean;
};

export type ExplanationResponse = {
  analysis_id: string;
  gradcam_overlay_url: string;
  explanation_text: string;
  confidence: number;
  top_features: { name: string; weight: number }[];
};

export type LesionResponse = {
  id: string;
  patient_id: string;
  body_location: string | null;
  first_seen_date: string | null;
  status: string;
  created_at: string;
};

export type LesionListResponse = {
  total: number;
  items: LesionResponse[];
};

export type BodyLocationResponse = {
  id: string;
  lesion_id: string;
  region: string;
  coordinates: { x: number; y: number };
  recorded_at: string;
  status: string;
};

export type DashboardSummaryResponse = {
  total_analyses: number;
  pending_consent: number;
  approved_for_training: number;
  flagged_for_review: number;
};

export type DashboardActivityItem = {
  timestamp: string;
  type: string;
  description: string;
};

export type DashboardActivityResponse = {
  items: DashboardActivityItem[];
};

export type DoctorReviewResponse = {
  id: string;
  lesion_id: string;
  reviewer_id: string;
  status: string;
  notes: string | null;
  created_at: string;
};

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

export type ResearchDatasetMetrics = {
  total_cases: number;
  approved_cases: number;
  rejected_cases: number;
  pending_review: number;
};

export type ModelPerformanceMetrics = {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  evaluated_at: string;
};

export type ActiveLearningQueueItem = {
  case_id: string;
  confidence: number;
  predicted_class: string;
  reason: string;
};

export type ActiveLearningQueue = {
  items: ActiveLearningQueueItem[];
};

// ---------- Internal helpers ----------

async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${path}`);
  }

  return response.json();
}

async function apiFormData<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${path}`);
  }

  return response.json();
}

// ---------- Analysis and explanation ----------

export async function analyzeImage(file: File): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("image", file);
  return apiFormData<AnalysisResponse>("/api/v1/analysis", formData);
}

export async function getReady(): Promise<{ status: string }> {
  return apiJson<{ status: string }>("/api/v1/ready");
}

export async function getAnalysisExplanation(
  caseId: string,
): Promise<ExplanationResponse> {
  return apiJson<ExplanationResponse>(`/api/v1/analysis/${caseId}/explanation`);
}

export async function explainWithLlm(
  analysisId: string,
): Promise<ExplanationResponse> {
  return apiJson<ExplanationResponse>(`/api/v1/explain-llm/${analysisId}`, {
    method: "POST",
  });
}

// ---------- Lesions ----------

export async function createLesion(payload: {
  body_location?: string;
  first_seen_date?: string;
}): Promise<LesionResponse> {
  return apiJson<LesionResponse>("/api/v1/lesions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listLesions(): Promise<LesionListResponse> {
  return apiJson<LesionListResponse>("/api/v1/lesions");
}

export async function getLesion(lesionId: string): Promise<LesionResponse> {
  return apiJson<LesionResponse>(`/api/v1/lesions/${lesionId}`);
}

// ---------- Body mapping ----------

export async function createBodyLocation(
  lesionId: string,
  payload: { region: string; coordinates: { x: number; y: number } },
): Promise<BodyLocationResponse> {
  return apiJson<BodyLocationResponse>(
    `/api/v1/lesions/${lesionId}/body-location`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}

export async function getBodyLocationHistory(
  lesionId: string,
): Promise<BodyLocationResponse[]> {
  return apiJson<BodyLocationResponse[]>(
    `/api/v1/lesions/${lesionId}/body-location/history`,
  );
}

export async function approveBodyLocation(
  lesionId: string,
  locationId: string,
): Promise<{ status: string }> {
  return apiJson<{ status: string }>(
    `/api/v1/lesions/${lesionId}/body-location/${locationId}/approve`,
    { method: "POST" },
  );
}

export async function correctBodyLocation(
  lesionId: string,
  locationId: string,
  payload: { region: string },
): Promise<BodyLocationResponse> {
  return apiJson<BodyLocationResponse>(
    `/api/v1/lesions/${lesionId}/body-location/${locationId}/correct`,
    { method: "POST", body: JSON.stringify(payload) },
  );
}

// ---------- Dashboard ----------

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  return apiJson<DashboardSummaryResponse>("/api/v1/dashboard/summary");
}

export async function getDashboardActivity(): Promise<DashboardActivityResponse> {
  return apiJson<DashboardActivityResponse>("/api/v1/dashboard/activity");
}

// ---------- Doctor reviews ----------

export async function listPendingDoctorReviews(): Promise<DoctorReviewResponse[]> {
  return apiJson<DoctorReviewResponse[]>("/api/v1/doctor-reviews/pending");
}

export async function createDoctorReview(payload: {
  lesion_id: string;
  notes: string;
}): Promise<DoctorReviewResponse> {
  return apiJson<DoctorReviewResponse>("/api/v1/doctor-reviews", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getDoctorReview(
  reviewId: string,
): Promise<DoctorReviewResponse> {
  return apiJson<DoctorReviewResponse>(`/api/v1/doctor-reviews/${reviewId}`);
}

export async function getDoctorReviewLabResults(
  reviewId: string,
): Promise<LabResultResponse[]> {
  return apiJson<LabResultResponse[]>(
    `/api/v1/doctor-reviews/${reviewId}/lab-results`,
  );
}

// ---------- Lab results ----------

export async function createLabResult(payload: {
  lesion_id?: string;
  lab_name?: string;
  test_date?: string;
  patient_note?: string;
}): Promise<LabResultResponse> {
  return apiJson<LabResultResponse>("/api/v1/lab-results", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listLabResults(): Promise<LabResultResponse[]> {
  return apiJson<LabResultResponse[]>("/api/v1/lab-results");
}

export async function getLabResult(
  labResultId: string,
): Promise<LabResultResponse> {
  return apiJson<LabResultResponse>(`/api/v1/lab-results/${labResultId}`);
}

export async function updateLabResult(
  labResultId: string,
  payload: Partial<LabResultResponse>,
): Promise<LabResultResponse> {
  return apiJson<LabResultResponse>(`/api/v1/lab-results/${labResultId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteLabResult(labResultId: string): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/lab-results/${labResultId}`,
    { method: "DELETE" },
  );
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
}

export async function addDoctorReviewToLabResult(
  labResultId: string,
  payload: { reviewer_id: string; notes: string },
): Promise<LabResultResponse> {
  return apiJson<LabResultResponse>(
    `/api/v1/lab-results/${labResultId}/doctor-review`,
    { method: "PATCH", body: JSON.stringify(payload) },
  );
}

export async function getLatestLabOcrRun(
  labResultId: string,
): Promise<LabOcrReviewPageResponse> {
  return apiJson<LabOcrReviewPageResponse>(
    `/api/v1/lab-results/${labResultId}/ocr-runs/latest`,
  );
}

export async function createLabOcrRun(
  labResultId: string,
): Promise<LabExtractionRunResponse> {
  return apiJson<LabExtractionRunResponse>(
    `/api/v1/lab-results/${labResultId}/ocr-runs`,
    { method: "POST" },
  );
}

export async function reviewLabOcrValue(
  labResultId: string,
  valueId: string,
  payload: LabOcrReviewPayload,
): Promise<LabExtractedValueResponse> {
  return apiJson<LabExtractedValueResponse>(
    `/api/v1/lab-results/${labResultId}/ocr-values/${valueId}/review`,
    { method: "PATCH", body: JSON.stringify(payload) },
  );
}

// ---------- Research metrics ----------

export async function getDatasetMetrics(): Promise<ResearchDatasetMetrics> {
  return apiJson<ResearchDatasetMetrics>("/api/v1/research/metrics/dataset");
}

export async function getModelPerformanceMetrics(): Promise<ModelPerformanceMetrics> {
  return apiJson<ModelPerformanceMetrics>("/api/v1/research/metrics/performance");
}

export async function getActiveLearningQueue(): Promise<ActiveLearningQueue> {
  return apiJson<ActiveLearningQueue>("/api/v1/research/active-learning/queue");
}
