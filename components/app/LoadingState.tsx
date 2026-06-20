export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="app-card" role="status" aria-live="polite">
      <p>{label}</p>
    </div>
  );
}
