# Figma-to-Storybook Component Mapping

| Figma Component | Status | Storybook Path | Last Parity Check | Notes |
| :--- | :--- | :--- | :--- | :--- |
| Button / primary | Complete | Elements/➡️ Button | 2026-03-04 | 1:1 mapping verified manually |
| Special Primary Buttons / success | Complete | Elements/➡️ Button → Success | 2026-05-29 | hover + focused states added |
| Special Primary Buttons / warning | Complete | Elements/➡️ Button → Warning | 2026-05-29 | hover + focused states added |
| Special Primary Buttons / information | Complete | Elements/➡️ Button → Information | 2026-05-29 | hover + focused states added |
| Special Primary Buttons / destructive | Complete | Elements/➡️ Button → SpecialDestructive | 2026-05-29 | New variant (error), all 3 states |
| Sidebars | Complete | Components/🍺 Sidebar | 2026-10-26 | Replaced NavMenu; cell primitives, sections, variants 1 & 2, 4 themes |
| Dropdown / Menu | Complete | Components/🔽 Dropdown | 2026-10-27 | Figma 2190:52619 & 2159:51455; standalone trigger & popover menu |
| Dropdown / Selectors | Complete | Elements/🔤 Input → Input Dropdown | 2026-10-27 | Figma 2198:54679; merged into Input with 4 types and 5 states |
| fmdq-logo | Complete | Elements/🏛️ Logo | 2026-10-26 | Node 6769:1811; Default & DarkBG Card variants |
| Command shortcut | Complete | Components/🔽 Dropdowns → Elements / ⌘ Command Shortcut | 2026-10-27 | Figma 2327:77216; 2 variants (Type) |
| Dropdown / menu item headers | Complete | Components/🔽 Dropdowns → Elements / 🏷️ Menu Item Header | 2026-10-27 | Figma 2159:85848; 2 variants (borders) |
| Dropdown / menu item | Complete | Components/🔽 Dropdowns → Elements / 📋 Menu Item | 2026-10-27 | Figma 2159:51455; 15 variants (type × state); spacing/typography 1:1 |
| Dropdown / menu items section | Complete | Components/🔽 Dropdowns → Nested / 🧩 Menu Items Section | 2026-10-27 | Figma 2159:81118 |
| Dropdown / menu items | Complete | Components/🔽 Dropdowns → Nested / 🪟 Menu List | 2026-10-27 | Popover; added --shadow-dropdown-menu token |
| .Selector menu / menu item | Complete | Components/🔽 Dropdowns → Elements / 🔘 Selector Menu Item | 2026-10-27 | Figma 2459:70670; 32 variants (type × style × state); focused → DM Sans Medium |
| .Selector menu / menu list | Complete | Components/🔽 Dropdowns → Nested / 📃 Selector Menu List | 2026-10-27 | Shadow is an exact --shadow-normal-xsm match |
| Dropdown / Menu | Complete | Components/🔽 Dropdowns → Full / 🔽 Dropdowns Menu | 2026-10-27 | Figma 2190:52619; 12 variants (type × state × extended); added --radius-6 |
| Dropdown / Selectors | Complete | Components/🔽 Dropdowns → Full / 🔤 Dropdowns Selector | 2026-10-27 | Figma 2198:54679; 20 variants; composes Input size="lg" + foundations icons |
| Auth background / dotted shader | Implemented; motion under visual review | Layout/🌌 AuthBackground | 2026-10-27 (wrapper property parity 94/100) | Figma 10310:262840 (DRP); native Three.js GLSL background; extracted palette, mask and shader settings; no auth UI; proprietary shader reconstructed |
| Tabbed Buttons | Complete | Elements/🚥 Tabbed Buttons | 2026-10-27 | Figma 1543:6760; middle and more variants given full borders to match the code (borders checked by hand, not with figma_check_design_parity) |
| Pagination | Complete | Components/📄 Pagination | 2026-10-27 | Figma 347:10062; rebuild from lowest base elements: PageNumber (2608:66376, 12 variants), TruncatedPages (2775:76546), PageIndicator (2609:67848), NavigationControls (2607:66246, 15 variants), PaginationList (2767:76342, 15 variants), full Pagination bar (2767:76362, 15 variants with 5 variations and 4 alignments) |

## Reuse mapping — Pagination (2026-10-27)

| Figma element | Decision | Implementation |
| :--- | :--- | :--- |
| `page number` (`2608:66376`) | genuinely new primitive | `PageNumber` (`size="small" \| "large"`, `shape="square" \| "round"`, 4 states) |
| `truncated pages` (`2775:76546`) | genuinely new primitive | `TruncatedPages` (`size="small" \| "large"`, ellipsis `…`) |
| `page indicator` (`2609:67848`) | genuinely new primitive | `PageIndicator` (14px DM Sans SemiBold text) |
| `navigation controls` (`2607:66246`) | genuinely new primitive | `NavigationControls` (`type`: single, grouped, button, selector; 4 styles) |
| `pagination list` (`2767:76342`) | genuinely new composite | `PaginationList` (auto-truncation, 2px gap, optional single arrows) |
| `Dividers` (`2609:66656`) | existing component as-is | `Divider` (`type="default"`) |
| `Icons` (`chevron-left`, `chevron-right`, `arrow-left`, `arrow-right`) | existing icons as-is | `Icon` (`variant="linear"`, `size={16}`) |
| `Pagination` bar (`2767:76362`) | genuinely new composite | `Pagination` (5 variations, 4 orientations, divider rule, interactive states) |

## Reuse mapping — Dropdowns (rule §0, recorded before coding)

| Figma element | Decision | Component |
| :--- | :--- | :--- |
| Input Frame / Label / Helper Text | existing as-is | `Input` (`size="lg"`) — already h56, r12, 1px neutral-300, gap 12 |
| Avatars | existing as-is | `Avatar` (`type="Image"`, `size="xs"` items / `"sm"` trigger) |
| Toggle (`Type=Checkcircle`) | existing + scoped CSS override | `Toggle` (FormControl) — 16px not 24px; secondary-400 not fmdq-blue |
| `icon / hashtag`, `icon / heart`, chevron, dots | existing as-is | `Icon` (foundations, 418 icons) |
| menu item / header / shortcut / sections / popovers | genuinely new | `src/components/Dropdowns/` |

> **Note.** `Components/🔽 Dropdown` (singular) and `Elements/🔤 Input → Input Dropdown` were earlier builds from these same Figma nodes (`2190:52619`, `2198:54679`, `2159:51455`). `Components/🔽 Dropdowns` (plural) is the rebuild from the elements up and is the current reference. The two older entries are left in place and untouched.

## Reuse mapping — AuthBackground native shader (2026-10-27)

| Figma element | Decision | Implementation |
| :--- | :--- | :--- |
| Auth background / dotted shader | extend existing component | Replace iframe inside `src/layout/AuthBackground`; preserve optional children slot |
| Primary/900 surface | existing token as-is | `--color-primary-900` (#001633) |
| Dotted pattern vector mask | procedural GPU mask | Extracted rotated lattice: 18.3676 × 17.2058 px, dots 7.3471 × 6.8823 px |
| animated-shader SHADER fill | reuse earlier native Three.js shader approach | Apply extracted named parameters and four exact color tokens; native motion is a reconstruction, not proprietary Figma shader source |
| Focus vignette | scoped native shader | Extracted 1100 × 1000 bounds at (170, 12), navy RGB (0, .0941, .2), alpha .92/.75/0 at 0/.55/1 |

Figma REST token is expired and installed Bridge does not implement DEEP_GET_COMPONENT. Complete layer data and reference screenshot recovered through `figma_execute` (read-only) and `figma_capture_screenshot`. No design layers modified.

Validation: application TypeScript and component ESLint pass. Repository-wide ESLint has pre-existing errors outside AuthBackground. Automated `figma_check_design_parity` returns 403 (expired REST token); not marked parity-complete. Native canvas visually verified in Safari against the Desktop Bridge reference.

Motion refinement (2026-10-27): user-supplied multi-frame references supersede the earlier regular-ribbon interpretation. Replaced travelling sine stripes with continuously evolving 3D domain-warped fold contours, locally varying widths and brightness. Dot geometry, grain and Figma settings remain anchored. Prior 94/100 property parity checked only wrapper properties, not animated shape fidelity.

REST token was subsequently refreshed. Wrapper property parity succeeded at 94/100: only fixed Figma dimensions versus responsive viewport sizing differed. This property check does not validate the animated fold field.

Art-direction update (2026-10-27): gold now reads shared --color-fmdq-gold (#CC9933), motion multiplier is 0.7×, and broad overlapping Gaussian shoulders replace thresholded fold edges for feathered mesh-gradient illumination. These user-requested refinements supersede the original gold fill and edge interpretation.

Coverage refinement (2026-10-27): interpreted reduced gold mass as occasional approximately 90% blue / 10% gold frames. Independently varying fold width reduces coverage in sparse intervals, while a spatial mix of crisp crease cores and feathered shoulders restores fabric definition. Ratio is a visual target, not a measured pixel constraint.

Additional-reference refinement (2026-10-27): introduced occasional low-frequency draped arcs with a bright narrow hem and a one-sided feathered face. Existing small folds also shade asymmetrically. Larger sweeps are gated by coverage and combined using maximum rather than additive blending, preserving sparse intervals, brand gold and the 0.7× speed.

Curvature refinement (2026-10-31): reduced spatial frequency, domain-warp strength and high-frequency surface detail to open tight curls into larger-radius arcs. Narrowed scalar highlight widths proportionally to avoid increasing gold coverage. Crease/feather shading, brand gold and motion speed preserved.
