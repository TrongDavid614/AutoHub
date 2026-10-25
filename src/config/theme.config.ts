/**
 * AUTOHUB DESIGN SYSTEM TOKENS
 * Extracted directly from AutoHub Figma Design System (Dark Luxury & Futuristic EV).
 */

export const THEME_COLORS = {
  // 1. Canvas & Backgrounds
  canvas: {
    primary: '#0B1326', // Main page canvas
    deep: '#060E20', // Deepest dark, footer, showcase backdrops
  },

  // 2. Surface & Panels
  surface: {
    container: '#131B2E', // Main cards, headers, modals
    elevated: '#171F33', // Inner cards, specs, message bubbles
    interactive: '#222A3D', // Hover states, user bubbles, button secondary
    highlight: '#2D3449', // Badges, chips, active tabs
  },

  // 3. Borders & Separators
  border: {
    subtle: '#3E4850', // Border lines (1px)
    dark: '#2D3449', // Inset dark border
    glow: 'rgba(137, 206, 255, 0.3)', // Cyan glow border
  },

  // 4. Brand Accents
  accent: {
    primary: '#89CEFF', // Electric Ice Blue (Glow, badges, active icons, price)
    action: '#0EA5E9', // Sky Blue 500 (Interactive CTA)
    contrast: '#00344D', // Deep Cyan text for high contrast on #89CEFF
  },

  // 5. Typography Colors
  text: {
    primary: '#DAE2FD', // Main headings, titles, high contrast (100%)
    secondary: '#BEC8D2', // Body descriptions, lead paragraphs (100%)
    muted: '#88929B', // Technical labels, timestamps, metadata (100%)
  },

  // 6. Semantic Status
  status: {
    success: '#10B981', // Emerald - Available, Deposit Paid, Active
    warning: '#F59E0B', // Amber - Pending 15m, Pending Review
    danger: '#EF4444', // Rose - Expired 72h, Cancelled, Error
    info: '#89CEFF', // Cyan - Information, AI Processing
  },
} as const;

export const THEME_FONTS = {
  sans: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  mono: "'Space Mono', monospace",
} as const;
