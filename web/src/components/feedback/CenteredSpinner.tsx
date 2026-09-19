export function CenteredSpinner({ label }: { label?: string }) {
  return (
    <div className="centered-spinner" role="status" aria-live="polite">
      <span className="spinner" aria-hidden />
      {label && <span>{label}</span>}
    </div>
  );
}
