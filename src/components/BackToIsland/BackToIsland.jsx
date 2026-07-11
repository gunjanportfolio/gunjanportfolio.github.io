import { Link } from "react-router-dom";

const BACK_BUTTON_CLASS =
  "inline-flex items-center rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-slate-800 shadow-md transition hover:bg-white active:scale-95";

export default function BackToIsland({ className }) {
  const combinedClassName = className
    ? `${BACK_BUTTON_CLASS} ${className}`
    : BACK_BUTTON_CLASS;

  return (
    <Link
      to="/"
      data-testid="back-to-island"
      aria-label="Back to island"
      className={combinedClassName}
    >
      ← Back to island
    </Link>
  );
}
