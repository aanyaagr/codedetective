"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";

type Props = { title?: string; message?: string; compact?: boolean };

/** Shown in place of account-only content when nobody is signed in. */
export function SignInGate({
  title = "SIGN IN TO OPEN THIS CASE FILE",
  message = "Your evidence, XP and investigation progress are saved to your detective account.",
  compact = false,
}: Props) {
  const pathname = usePathname();
  const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
  return (
    <div className={`cd-gate ${compact ? "cd-gate-compact" : ""}`}>
      <div className="cd-gate-icon"><ShieldAlert size={26} /></div>
      <div className="cd-gate-kicker">RESTRICTED // DETECTIVES ONLY</div>
      <h3>{title}</h3>
      <p>{message}</p>
      <div className="cd-gate-actions">
        <Link href={`/login${next}`} className="cd-btn cd-btn-primary">ENTER THE BUREAU</Link>
        <Link href={`/login${next ? `${next}&` : "?"}mode=register`} className="cd-btn cd-btn-ghost">CREATE DETECTIVE ID</Link>
      </div>
    </div>
  );
}

/** Loading / error placeholder in the same style. */
export function CaseFileStatus({ loading, error, onRetry }: { loading?: boolean; error?: string; onRetry?: () => void }) {
  if (loading) {
    return (
      <div className="cd-status" role="status">
        <span className="cd-status-dot" /> RETRIEVING CASE FILE…
      </div>
    );
  }
  return (
    <div className="cd-status cd-status-error" role="alert">
      <strong>TRANSMISSION FAILED</strong>
      <span>{error}</span>
      {onRetry && <button onClick={onRetry} className="cd-btn cd-btn-ghost">RETRY</button>}
    </div>
  );
}
