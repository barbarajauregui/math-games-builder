interface LogoProps {
  className?: string
  size?: number
}

export function Logo({ className, size = 24 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
    >
      <ellipse cx="50" cy="50" rx="42" ry="14" fill="none" stroke="#d4af6f" strokeWidth="2" transform="rotate(-25 50 50)" />
      <ellipse cx="50" cy="50" rx="38" ry="22" fill="none" stroke="#d4af6f" strokeWidth="2" transform="rotate(15 50 50)" />
      <ellipse cx="50" cy="50" rx="32" ry="32" fill="none" stroke="#d4af6f" strokeWidth="2" />
      <circle cx="50" cy="50" r="9" fill="#fbbf24" stroke="#8b6914" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="3" fill="#3b82f6" />
      <line x1="50" y1="8" x2="50" y2="14" stroke="#d4af6f" strokeWidth="1.5" />
      <line x1="50" y1="86" x2="50" y2="92" stroke="#d4af6f" strokeWidth="1.5" />
      <line x1="8" y1="50" x2="14" y2="50" stroke="#d4af6f" strokeWidth="1.5" />
      <line x1="86" y1="50" x2="92" y2="50" stroke="#d4af6f" strokeWidth="1.5" />
      <circle cx="86" cy="38" r="2" fill="#d4af6f" />
      <circle cx="20" cy="64" r="2" fill="#d4af6f" />
    </svg>
  )
}
