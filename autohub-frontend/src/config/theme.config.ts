/**
 * AutoHub design tokens reference (aligned with autohub-ui-rules.md & tokens.css).
 */

export const THEME_COLORS = {
  canvas: {
    primary: 'var(--bg)',
    deep: 'var(--surface-subtle)',
  },
  surface: {
    container: 'var(--surface)',
    elevated: 'var(--surface)',
    interactive: 'var(--surface-subtle)',
    highlight: 'var(--line)',
  },
  border: {
    subtle: 'var(--line-strong)',
    dark: 'var(--line)',
    glow: 'var(--line)',
  },
  accent: {
    primary: 'var(--accent)',
    action: 'var(--accent)',
    contrast: 'var(--accent-contrast)',
  },
  text: {
    primary: 'var(--text)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-muted)',
  },
  status: {
    success: '#15803D',
    warning: '#B45309',
    danger: '#B91C1C',
    info: '#1D5BD6',
  },
} as const;

export const THEME_FONTS = {
  sans: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
} as const;
