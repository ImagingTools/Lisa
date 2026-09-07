/**
 * Confirmation dialog. Implemented as a tiny custom modal to avoid pulling in
 * a UI lib for a single use case. Mirrors the QML
 * `ModalDialogManager.openDialog(messageDialogComp, ...)` pattern.
 */
import { useEffect, type CSSProperties } from 'react';

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const dialogStyle: CSSProperties = {
  background: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-m)',
  padding: 'var(--margin-l)',
  maxWidth: 420,
  width: '100%',
  boxShadow: 'var(--shadow-md)',
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;
  return (
    <div style={overlayStyle} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div style={dialogStyle}>
        <h3 id="confirm-title" style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ marginBottom: 'var(--margin-l)' }}>{message}</p>
        <div className="form-actions">
          <button type="button" className="btn" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${destructive ? 'btn--danger' : 'btn--primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
