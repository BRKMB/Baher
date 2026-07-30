/** Soft Egyptian backdrop for the table pass — SVG glyphs, low opacity. */
export function PassEgyptBackdrop() {
  return (
    <div className="boarding-pass__egypt" aria-hidden>
      <svg className="boarding-pass__egypt-ankh" viewBox="0 0 64 96" fill="none">
        <path
          d="M32 8c-7.2 0-13 5.8-13 13 0 5.2 3 9.7 7.4 11.8L24 52h16l-2.4-19.2C42 30.7 45 26.2 45 21c0-7.2-5.8-13-13-13Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M18 52h28M32 52v36" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>

      <svg className="boarding-pass__egypt-eye" viewBox="0 0 96 48" fill="none">
        <path
          d="M8 24c10-14 28-20 40-20s30 6 40 20c-10 14-28 20-40 20S18 38 8 24Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="48" cy="24" r="8" stroke="currentColor" strokeWidth="2" />
        <circle cx="48" cy="24" r="3.2" fill="currentColor" />
        <path
          d="M58 30c4 6 8 10 14 14M42 34c-1 6-1 12 1 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <svg className="boarding-pass__egypt-sun" viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="11" stroke="currentColor" strokeWidth="2" />
        <path
          d="M36 8v8M36 56v8M8 36h8M56 36h8M16 16l5.5 5.5M50.5 50.5 56 56M56 16l-5.5 5.5M16 56l5.5-5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <svg className="boarding-pass__egypt-scarab" viewBox="0 0 80 64" fill="none">
        <ellipse cx="40" cy="34" rx="16" ry="18" stroke="currentColor" strokeWidth="2" />
        <path
          d="M40 16v36M28 28h24M26 40h28M24 22c-8-6-14-8-18-8M56 22c8-6 14-8 18-8M22 48c-6 4-10 10-12 14M58 48c6 4 10 10 12 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <svg className="boarding-pass__egypt-lotus" viewBox="0 0 72 56" fill="none">
        <path
          d="M36 48c0-14 8-26 20-34-4 14-4 24 0 34M36 48c0-14-8-26-20-34 4 14 4 24 0 34M36 48V14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 22c4-6 8-10 12-12 4 2 8 6 12 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <p className="boarding-pass__egypt-glyphs">𓋹 · 𓆣 · 𓇳 · 𓂀</p>
    </div>
  )
}
