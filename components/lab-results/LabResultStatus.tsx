type Status = "uploaded" | "doctor_reviewed" | "rejected" | "deleted" | string;

const STATUS_LABELS: Record<string, string> = {
  uploaded: "Uploaded",
  doctor_reviewed: "Reviewed by doctor",
  rejected: "Rejected",
  deleted: "Deleted",
};

const STATUS_CLASS: Record<string, string> = {
  uploaded: "badge badge--neutral",
  doctor_reviewed: "badge badge--success",
  rejected: "badge badge--warning",
  deleted: "badge badge--muted",
};

interface Props {
  status: Status;
}

export function LabResultStatus({ status }: Props) {
  const label = STATUS_LABELS[status] ?? status;
  const cls = STATUS_CLASS[status] ?? "badge badge--neutral";
  return <span className={cls}>{label}</span>;
}
