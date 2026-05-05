# UI Design System (As Implemented)

## 1. Executive UI Summary
- Light enterprise dashboard with white surfaces and blue actions.
- Global font is Nunito Sans with bold heading hierarchy.
- Controls are compact, mostly `42px` height, `rounded-md`.
- Borders are consistently light gray with 1px weight.
- Status and semantic chips use distinct blue/green/yellow/red palettes.
- Tables are dense, sticky-header friendly, and scroll-driven.
- Sidebar is dual-mode (expanded/collapsed) plus mobile drawer.
- Overlay/layering uses very high z-index for sidebar safety.

## 2. Global Design Tokens (As Implemented)

### 2.1 Typography Tokens
| Token | Exact Value | Observed In |
|---|---|---|
| `font.family.sans` | `"Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` | `src/index.css` |
| `type.h1.dashboard` | `font-size: 28px; line-height: 28px; font-weight: 800; letter-spacing: 0` | `.dashboard-heading` |
| `type.h2.section` | `font-size: 24px; font-weight: 800` | `AllStats`, `Statistics`, `MyProfile` |
| `type.h3.block` | `font-size: 22px; font-weight: 800` | `BrandLoader`, `MyProfile` |
| `type.body.default` | `14px; line-height: 20px; weight 500-600` | Subheadings/forms |
| `type.body.table` | `12px-13px` | Data tables |
| `type.label.meta` | `10px-12px; uppercase; weight 800` | Labels/chips/headers |
| `type.weights` | `300, 400, 500, 600, 700, 800` | Global |
| `type.tracking` | `0, 0.03em, 0.08em, 0.14em, tracking-wide` | Chips/meta/sidebar headings |

### 2.2 Color Tokens
| Category | Token | Exact Value | Observed In |
|---|---|---|---|
| Neutral | `color.bg.app` | `#F5F7FA` | Page background |
| Neutral | `color.bg.surface` | `#FFFFFF` | Cards/modals/inputs |
| Neutral | `color.bg.subtle` | `#f8fafc`, `#f8fbff`, `#f4f7fc` | Subtle panels |
| Primary | `color.primary.500` | `#3c79ff` | Primary button/focus |
| Primary | `color.primary.600` | `#356ee6` | Primary hover |
| Primary | `color.primary.alt` | `#3874FF` | Charts/metrics |
| Success | `color.success.main` | `#22c55e` | Success indicators |
| Success | `color.success.text` | `#027a48` | Success chips |
| Success | `color.success.bg` | `#ecfdf3` | Success chips |
| Success | `color.success.border` | `#abefc6` | Success chips |
| Warning | `color.warn.main` | `#f59e0b` | Warning indicators |
| Warning | `color.warn.text` | `#b54708` | Warning chips |
| Warning | `color.warn.bg` | `#fff8eb` | Warning chips |
| Warning | `color.warn.border` | `#fedf89` | Warning chips |
| Danger | `color.danger.main` | `#ef4444` | Danger indicators |
| Danger | `color.danger.text` | `#b42318` | Danger chips |
| Danger | `color.danger.bg` | `#fef3f2` | Danger chips |
| Danger | `color.danger.border` | `#fecdca` | Danger chips |
| Border | `color.border.app` | `#CBD0DD` | `--app-border` |
| Border | `color.border.default` | `#d5d9e4` | Cards/controls |
| Border | `color.border.soft` | `#e2e8f0`, `#eaecf0` | Dividers |
| Text | `color.text.primary` | `#141824`, `#0f172a` | Headings |
| Text | `color.text.secondary` | `#334155`, `#475569`, `#52607a`, `#64748b` | Body/meta |
| Text | `color.text.muted` | `#94a3b8`, `#98a2b3`, `#667085` | Muted |
| Overlay | `color.overlay.dark` | `rgba(15,23,42,0.45)`, `rgba(0,0,0,0.35)`, `rgba(0,0,0,0.70)` | Modals/drawers |

### 2.3 Shape Tokens
| Token | Exact Value | Observed In |
|---|---|---|
| `radius.sm` | `rounded-sm` (~2px) | Tiny info blocks |
| `radius.md` | `rounded-md` (6px) | Inputs/buttons/default cards |
| `radius.lg` | `rounded-lg` (8px) | Dropdown cards |
| `radius.xl` | `rounded-xl` (12px) | Feature cards |
| `radius.2xl` | `rounded-2xl` (16px) | Large modal cards |
| `radius.pill` | `rounded-full` (999px) | Chips/avatars/dots |

### 2.4 Border Tokens
| Token | Exact Value | Observed In |
|---|---|---|
| `border.width.default` | `1px` | Global |
| `border.color.global` | `var(--app-border)` => `#CBD0DD` | Global reset |
| `border.color.component` | `#d5d9e4` | Controls/cards/tables |
| `border.color.separator` | `#e2e8f0` | Internal separators |

### 2.5 Spacing Tokens
| Token | Exact Value | Observed In |
|---|---|---|
| `space.2` | `8px` | Tight gaps |
| `space.3` | `12px` | Compact groups |
| `space.4` | `16px` | Standard spacing |
| `space.5` | `20px` | Card padding |
| `space.6` | `24px` | Page sections |
| `control.height` | `42px` | Inputs/buttons on tools/forms |

### 2.6 Elevation & Shadows
| Token | Exact Value | Observed In |
|---|---|---|
| `shadow.header` | `0 6px 20px rgba(15,23,42,0.06)` | Header |
| `shadow.dropdown` | `0 10px 30px rgba(15,23,42,0.15)` | Profile menu |
| `shadow.modal` | `0 24px 60px rgba(15,23,42,0.25)` | Plan modal |
| `shadow.offline` | `0 28px 60px rgba(15,23,42,0.14)` | Offline panel |
| `shadow.primary` | `0 12px 26px rgba(60,121,255,0.32)` | Primary CTA |

### 2.7 Motion Tokens
| Token | Exact Value | Observed In |
|---|---|---|
| `motion.fast` | `150ms` | Hover fades |
| `motion.base` | `200ms` | Common transitions |
| `motion.medium` | `300ms` | Drawer/button transitions |
| `motion.slow` | `500ms` | Sidebar width |
| `ease.default` | `ease` | Common |
| `ease.out` | `ease-out` | Entries |
| `keyframe.rowIn` | `0.35s ease-out` | Row animation |
| `keyframe.slideDownGlow` | `0.45s ease-out` | Offline modal intro |
| `keyframe.pulseFast` | `1.2s ease-in-out` | Pulse states |

### 2.8 Layering & z-index Tokens
| Layer Token | Exact Value | Observed In |
|---|---|---|
| `z.modal.default` | `50` | Standard modals |
| `z.drawer.todo` | `9999` | Todo drawer |
| `z.datepicker` | `10050` | Datepicker popper |
| `z.toast` | `99999` | Toaster |
| `z.mobile.overlay` | `2147483646` | Mobile sidebar overlay |
| `z.mobile.panel` | `2147483647` | Mobile sidebar panel |
| `z.sidebar.tooltip` | `2147483647` | Collapsed sidebar tooltip |

## 3. Component Style Specifications
Header, sidebar, cards, forms, tables, tooltip, modal, loader all use the tokens above. Implementation snippets are in [UI-HTML-CSS-JS-IMPLEMENTATION.md](/c:/Users/ecin/OneDrive/Desktop/traffic_saviour_frontend/UI-HTML-CSS-JS-IMPLEMENTATION.md).

## 4. Page-Level Visual Grammar
- AllStats, AllCampaign, Statistics, clickLogs1: dashboard data UI baseline.
- campaignCreation: multi-step form baseline.
- CampaignIntegration/Billing/Pricing/MyProfile: account and business workflow baseline.
- RedirectInspector/BotScanner/IpIntelligence/UrlBuilderTool/UrlShortenerTool: tool-page baseline.

## 5. Consistency Audit
See [UI-CONSISTENCY-AUDIT.md](/c:/Users/ecin/OneDrive/Desktop/traffic_saviour_frontend/UI-CONSISTENCY-AUDIT.md).

## 6. Canonical Rules
- Keep typography, color, spacing, and state styles bound to these token tables.
- No functional/API/data/routing changes for UI-only work.
