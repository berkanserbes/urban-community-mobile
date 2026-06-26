export const Colors = {
  primary: {
    DEFAULT: '#2563eb',
    hover:   '#1d4ed8',
    light:   '#eff6ff',
    muted:   '#bfdbfe',
  },
  error: {
    DEFAULT: '#ef4444',
    hover:   '#dc2626',
    light:   '#fef2f2',
  },
  success: {
    DEFAULT: '#22c55e',
    hover:   '#16a34a',
    light:   '#f0fdf4',
  },
  warning: {
    DEFAULT: '#f59e0b',
    hover:   '#d97706',
    light:   '#fffbeb',
  },
  background: {
    primary:   '#ffffff',
    secondary: '#f9fafb',
    tertiary:  '#f3f4f6',
    inverse:   '#111827',
  },
  text: {
    primary:   '#111827',
    secondary: '#6b7280',
    disabled:  '#9ca3af',
    inverse:   '#ffffff',
    link:      '#2563eb',
  },
  border: {
    default: '#d1d5db',
    focus:   '#3b82f6',
    error:   '#ef4444',
    subtle:  '#e5e7eb',
  },
  icon: {
    default: '#6b7280',
    muted:   '#9ca3af',
    active:  '#2563eb',
  },
  dark: {
    background: {
      primary:   '#111827',
      secondary: '#1f2937',
      tertiary:  '#374151',
    },
    text: {
      primary:   '#ECEDEE',
      secondary: '#9ca3af',
      disabled:  '#6b7280',
    },
    border: {
      default: '#4b5563',
      subtle:  '#374151',
    },
    icon: {
      default: '#9BA1A6',
      muted:   '#6b7280',
      active:  '#60a5fa',
    },
  },
} as const;

export const Spacing = {
  xs:    4,
  sm:    8,
  md:   12,
  lg:   16,
  xl:   24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const Radius = {
  sm:   6,
  md:   10,
  lg:   12,
  xl:   16,
  full: 9999,
} as const;
