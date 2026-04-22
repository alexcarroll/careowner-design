# VetVet Design System — house rules

This file is the source of truth for design conventions in this project. All HTML/CSS work — by hand or by Claude Code — MUST respect these rules.

## Typography

### The 14px floor (enforced)

**14px is the minimum readable size for any text the user is meant to read.** This applies inside:

- Cards and panels (descriptions, body copy, supporting text)
- Table cells and list items
- Form hints and helper text
- Alerts, callouts, banners
- Tooltips with sentence-length content
- Activity feeds, notifications, message previews
- Sidebar nav labels

There is **no inline `font-size: 12px` or `font-size: 13px`** allowed for any of the above. If you find yourself wanting something smaller "to fit," fix the layout — don't shrink the type.

### When 12px is allowed (rare)

12px (`--font-micro`, `--font-micro-bold`, `--font-monospace`) is reserved for **small details only**:

- Timestamps and metadata badges (e.g. "14m ago", "v2.1")
- Keyboard shortcut hints (e.g. `⌘K`)
- Chart axis labels, sparkline values
- Eyebrow / overline labels (uppercase, tracked, ABOVE a heading)
- Monospaced token names and hex codes in reference tables
- Table column headers (uppercase eyebrows)

If a piece of 12px text would be read as a sentence, it's wrong — promote it to 14px.

### Tokens

| Token | Size / line | Use |
|---|---|---|
| `--font-heading-1` | 600 24/32 | Page titles |
| `--font-heading-2` | 600 20/28 | Section titles |
| `--font-heading-3` | 600 16/20 | Card / panel titles |
| `--font-body` | 400 14/20 | Default reading text |
| `--font-body-bold` | 500 14/20 | Emphasized body |
| `--font-caption` | 400 14/20 | Descriptions, hints, supporting text (alias of body — kept for semantic clarity) |
| `--font-caption-bold` | 500 14/20 | Labels above inputs, eyebrow at body size |
| `--font-micro` | 400 12/16 | Small details only — see list above |
| `--font-micro-bold` | 500 12/16 | Small details only |
| `--font-monospace` | 400 12/16 | Code, hex codes, token names |

`--font-caption` is **14px**, not 12px. This was a deliberate change after early reviews showed 12px descriptions inside cards were too small. Do not "fix" the alias by shrinking it.

## Color & theming

- Light theme is the default. `<html data-theme="dark">` opts into the forest-dark theme.
- Dark mode currently has visual bugs in some places (`index.html` etc.) — only `dark-mode.html` is a fully-tuned dark surface. Don't add a global toggle until that's resolved.
- Brand color: forest teal `#14535A` (brand-800). Always pair with high contrast neutral.

## Components

- Use the DS classes (`.btn`, `.btn--brand-primary`, `.card`, `.badge`, etc.) — do not hand-roll equivalents.
- Buttons: 32px default, 28px sm, 40px lg. Hit targets on touch surfaces are 44px min.
- Spacing: 4px grid (`--spacing-1` through `--spacing-12`). Avoid arbitrary px values.

## File map

- `vetvet-ds.css` — the design system. Tokens at top, components below, dark-mode overrides at the bottom.
- `index.html` — design system overview / landing.
- `tokens.html` — token reference.
- `components.html` — component gallery.
- `guidelines.html` — written guidance.
- `dark-mode.html` — standalone dark showcase (does NOT share the toggle with other pages).
