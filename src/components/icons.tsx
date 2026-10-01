// Inline 1.5px line icons. No icon font: names can never leak as raw text.
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: P) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const LogIcon = (p: P) => (
  <Svg {...p}>
    <path d="M5 4h11l3 3v13H5z" />
    <path d="M8 9h8M8 13h8M8 17h5" />
  </Svg>
);
export const WorkIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3 7h6l2 2h10v10H3z" />
  </Svg>
);
export const ArenaIcon = (p: P) => (
  <Svg {...p}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </Svg>
);
export const AboutIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1-4 4-6 8-6s7 2 8 6" />
  </Svg>
);
export const ContactIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);
export const ToolboxIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="8" width="18" height="12" rx="1" />
    <path d="M9 8V5h6v3M3 13h18" />
  </Svg>
);
export const ArrowUpRight = (p: P) => (
  <Svg width="14" height="14" {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
);
export const ArrowRight = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </Svg>
);
export const ArrowLeft = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </Svg>
);
export const DownloadIcon = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="M12 4v12M6 11l6 6 6-6M4 20h16" />
  </Svg>
);
export const CopyIcon = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <rect x="8" y="8" width="12" height="12" rx="1" />
    <path d="M16 8V4H4v12h4" />
  </Svg>
);
export const CheckIcon = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="m5 12 5 5 9-10" />
  </Svg>
);
export const PlusIcon = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);
export const MinusIcon = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="M5 12h14" />
  </Svg>
);
export const MusicIcon = (p: P) => (
  <Svg {...p}>
    <path d="M9 18V5l11-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="17" cy="16" r="3" />
  </Svg>
);
export const PlayIcon = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="M7 4v16l13-8z" />
  </Svg>
);
export const PauseIcon = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="M8 5v14M16 5v14" />
  </Svg>
);
export const PrevIcon = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="M18 5v14L8 12zM6 5v14" />
  </Svg>
);
export const NextIcon = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="M6 5v14l10-7zM18 5v14" />
  </Svg>
);
export const ShuffleIcon = (p: P) => (
  <Svg width="16" height="16" {...p}>
    <path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3" />
  </Svg>
);
/** Hand-drawn style curved arrow for margin notes. */
export const ScribbleArrow = (p: P) => (
  <svg width="56" height="32" viewBox="0 0 56 32" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true" {...p}>
    <path d="M2 6c14-6 34-4 44 14" />
    <path d="m40 18 7 4 1-8" />
  </svg>
);
