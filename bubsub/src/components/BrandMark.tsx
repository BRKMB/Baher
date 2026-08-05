/** Geometric BUB SUB monogram from brand identity. */
export function BrandMark({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 72"
      fill="currentColor"
      fillRule="evenodd"
      role="img"
      aria-label="BUB SUB"
    >
      {/* Top-left B */}
      <path d="M3 3h22v28H3V3zm8 6h8V6h-8v3zm0 13h8v-3h-8v3z" />
      {/* Bottom-left S */}
      <path d="M3 39h22v8H11v4h14v14H3v-8h14v-4H3V39z" />
      {/* Center U (shared, full height) */}
      <path d="M29 3h8v48h14V3h8v56H29V3z" />
      {/* Top-right B */}
      <path d="M47 3h22v28H47V3zm8 6h8V6h-8v3zm0 13h8v-3h-8v3z" />
      {/* Bottom-right B */}
      <path d="M47 39h22v28H47V39zm8 6h8v-3h-8v3zm0 13h8v-3h-8v3z" />
    </svg>
  )
}

/** Mini card-stack accent matching the app icon (lime / blue / pink). */
export function BrandCards({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-end gap-[3px] ${className}`} aria-hidden>
      <span className="block w-[7px] h-[11px] rounded-[2px] bg-[#c8ff00] shadow-sm" />
      <span className="block w-[7px] h-[13px] rounded-[2px] bg-[#2f6bff] shadow-sm" />
      <span className="block w-[7px] h-[9px] rounded-[2px] bg-[#ff2d8a] shadow-sm" />
    </div>
  )
}
