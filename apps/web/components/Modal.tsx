import { useEffect, useRef } from "react";

export function Modal({
  open, onClose, title, children
}: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "Tab" && ref.current) {
        const focusables = ref.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length) {
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement as HTMLElement | null;
          if (e.shiftKey && active === first) { last.focus(); e.preventDefault(); }
          else if (!e.shiftKey && active === last) { first.focus(); e.preventDefault(); }
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <strong id="modal-title" style={{ fontSize: 18 }}>{title}</strong>
          <button className="btn-secondary" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
