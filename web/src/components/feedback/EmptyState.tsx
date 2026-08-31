import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      {message && <p>{message}</p>}
      {action && <div style={{ marginTop: 12 }}>{action}</div>}
    </div>
  );
}
