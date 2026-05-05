# UI Consistency Audit

| Issue ID | UI Area | Current Style | Expected Canonical Style | Severity | Recommended Fix (Non-functional) | Files Impacted |
|---|---|---|---|---|---|---|
| UI-001 | Heading scale drift | Uses `28`, `24`, `22`, plus ad-hoc page title scales | Standardize to H1 `28`, section `24`, subsection `22` | Med | Keep semantic hierarchy and map all page titles to canonical steps | `AllStats.jsx`, `Statistics.jsx`, `MyProfile.jsx`, tool pages |
| UI-002 | Button consistency | Primary buttons vary in height/padding/weight | Primary should be `h-[42px]`, `rounded-md`, `text-[13]`, `#3c79ff` | High | Introduce shared button utility classes in static docs/CSS | Most pages incl. `Pricing.jsx`, `AllCampaign.jsx`, tools |
| UI-003 | Border color drift | Mix of `--app-border`, `#d5d9e4`, `#e2e8f0` | Canonical border surface token family with explicit usage tiers | Med | Use one default border token, secondary only for separators | Global + major page files |
| UI-004 | Radius inconsistency | Some tables/cards use sharp or `rounded-sm`, others `rounded-2xl` | Default to `rounded-md`; reserve large radii for hero/modals | Low | Normalize routine containers to `rounded-md` | Billing, Statistics, AllStats, Integration |
| UI-005 | Tooltip patterns mismatch | CSS hover, MUI tooltip, portal tooltip, intro tooltip | Define canonical app tooltip and allow exceptions by type | Med | Keep intro.js for tours; unify passive info tooltips | `sidebar.jsx`, `campaignCreation.jsx`, tool pages |
| UI-006 | Scrollbar variants | 3 custom scrollbar systems with differing thickness/colors | Keep purposeful variants but document intended usage | Low | Assign scrollbar classes by context (general/stats/log table) | `src/index.css`, `clickLogs1.jsx`, `Statistics.jsx` |
| UI-007 | Mixed dark legacy classes | Some components still contain dark palette patterns | Light dashboard canonical baseline | Med | Remove unused dark visual branches or scope clearly | `campaignCreation.jsx` |
| UI-008 | z-index strategy | Mix of `z-50`, `z-9999`, `2147483647` extremes | Layer scale policy with reserved slots | High | Add explicit z-index token table and enforce use by layer | `dashboard.jsx`, `sidebar.jsx`, modals/drawers |
| UI-009 | Icon sizing drift | Icons vary `14/15/16/18/20` without rule by context | Define icon sizes by role (control/action/status/nav) | Low | Map sizes: nav 18, action 16-18, table meta 14 | header/sidebar/tables/tools |
| UI-010 | Table header casing/weight drift | Uppercase extra-bold in many places, some sentence case | Canonical table head style per data table type | Med | Use one table head utility for operational tables | AllCampaign, clickLogs1, Billing, tool histories |
| UI-011 | Status color semantic overlap | Blue/green/red labels differ between pages | Shared semantic status dictionary | Med | Map status types to fixed chip tokens | AllCampaign, Billing, Bot/IP/Redirect tools |
| UI-012 | Input focus consistency | Most inputs use inset blue ring; some modal inputs only border color | Canonical input focus = border + inset ring | Low | Apply same focus pattern across modal and page forms | Pricing modal, MyProfile subforms |

## Notes
- No functional/API/routing changes recommended; all fixes are presentational only.
- Highest risk inconsistency is layering (`z-index`) because it can hide critical dialogs.
