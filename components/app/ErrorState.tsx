export function ErrorState({ message }: { message: string }) {
  return (
    <div className="app-card app-card--error" role="alert">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      <p>Check that the backend is running and NEXT_PUBLIC_API_BASE_URL points to it.</p>
    </div>
  );
}
