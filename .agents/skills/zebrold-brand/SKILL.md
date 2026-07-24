# SKILL.md — Zebrold Group of Companies
# Powered by Taste Skill v2 (design-taste-frontend)
# Project: Corporate Conglomerate Website | React 18 + Vite | Vanilla CSS

---

## ZEBROLD BRAND OVERRIDES [DOMINANT — READ FIRST]

These rules override ALL default Taste Skill behaviors.
The agent must read and apply this section before any other section.

### Identity
- **Client:** Zebrold Group of Companies — Frankfurt-headquartered multinational conglomerate
- **Tone:** Premium German engineering meets global ambition. Goldman Sachs boardroom + Tata Group storytelling.
- **Feeling:** Confident, editorial, precise. Never startup-y, never playful, never casual.
- **References:** ril.com (top bar + header structure) · tata.com (page layout + storytelling) · adani.com (scroll animations + section transitions)

### Color System [LOCKED — NO EXCEPTIONS]
```
--color-black:      #0A0A0A   ← Use this, NEVER pure #000000
--color-white:      #FFFFFF
--color-off-white:  #F5F4F0   ← Default light surface
--color-blue-950:   #021D38
--color-blue-900:   #042C53   ← Dark section backgrounds
--color-blue-800:   #0C447C   ← Primary brand blue
--color-blue-600:   #185FA5
--color-blue-400:   #378ADD   ← Interactive accents
--color-blue-100:   #B5D4F4
--color-blue-50:    #E6F1FB
--color-gold:       #C9A84C   ← Premium accent (use sparingly)
--color-gold-light: #F0D080
--color-gray-700:   #2C2C2A
--color-gray-500:   #5F5E5A
--color-gray-300:   #B4B2A9
--color-gray-100:   #E8E7E3
```
- **ONE accent rule:** Blue-800 is the primary accent. Gold is reserved for: logo motto, stat highlights, CTA hover states, key metric numbers. Never both on the same element.
- **BANNED:** AI purple, mesh blob gradients, neon glows, rainbow anything.
- **Dark sections** (hero, footer, global presence): `--color-blue-900` or `--color-black` background, white text.
- **Light sections** (about, sectors, subsidiaries): `--color-off-white` background, `--color-black` text.

### Typography [LOCKED]
```
--font-display: 'Playfair Display', Georgia, serif   ← ALL headings, hero text
--font-body:    'DM Sans', sans-serif                ← ALL body, UI, nav, labels
--font-mono:    'DM Mono', monospace                 ← ALL numbers, stats, tickers
```
- **BANNED:** Inter, Roboto, Arial, system-ui, Geist, Outfit, Cabinet Grotesk, Satoshi — none of these.
- Playfair Display ONLY for H1–H3 and hero headlines.
- DM Mono MUST be used for every number, stat, revenue figure, working capital, employee count, date.
- Section eyebrow labels: DM Sans 500, 12px, letter-spacing: 0.14em, UPPERCASE, color: `--color-gold`.

### Stack [LOCKED — DO NOT CHANGE]
- React 18 + Vite (NOT Next.js)
- Vanilla CSS with CSS custom properties (NO Tailwind — project uses component-scoped CSS)
- React Router v6 for routing
- @tabler/icons-react for icons (already installed — use Tabler outline icons only)
- Framer Motion for animations (install if missing: `npm install framer-motion`)

---

## 1. ACTIVE BASELINE CONFIGURATION

```
DESIGN_VARIANCE:  7   ← Asymmetric grids, offset layouts, not artsy chaos
MOTION_INTENSITY: 7   ← Scroll-triggered reveals, clip-path wipes, countUp, no gimmicks
VISUAL_DENSITY:   5   ← Corporate information density — data-rich but never cramped
```

These values are calibrated for a corporate conglomerate. Do not increase MOTION_INTENSITY above 7 — no spring physics, no magnetic buttons, no particle effects. Every animation must feel like it belongs in a boardroom presentation.

---

## 2. ARCHITECTURE & CONVENTIONS

### Component Structure
Every component lives in `src/components/ComponentName/ComponentName.jsx` + `ComponentName.css`.
Every page lives in `src/pages/PageName/PageName.jsx` + `PageName.css`.
Data files in `src/data/` are plain JS arrays — no fetching, no API calls.
Hooks in `src/hooks/` — `useScrollReveal.js` and `useCountUp.js` already exist, use them.

### Client-Side Only
This is a Vite + React SPA. No SSR, no Server Components, no RSC. All components are client components.

### CSS Rules
- Use CSS custom properties from `src/styles/tokens.css` — never hardcode color hex values.
- Component CSS is scoped by a unique root class: `.sector-card { }` not generic `.card { }`.
- Use CSS Grid for multi-column layouts. Never `width: calc(33% - 1rem)` flex hacks.
- `min-height: 100dvh` for full-screen sections (never `height: 100vh`).
- Animate ONLY `transform` and `opacity`. Never animate `top`, `left`, `width`, `height`.
- `will-change: transform` only on elements with active scroll animations.

### Icons
Use `@tabler/icons-react` exclusively. Import as named exports:
```jsx
import { IconBolt, IconCpu, IconCar } from '@tabler/icons-react'
```
Stroke width: always `1.5`. Size: 24px default, 32px for sector cards, 20px for nav.
NEVER use emoji as icons. NEVER use Lucide, Heroicons, or Phosphor (not installed).

---

## 3. ANTI-SLOP DIRECTIVES FOR ZEBROLD

The following patterns are BANNED for this project. Enforce on every component.

### Layout Bans
- **NO three-equal-card feature rows.** The 12-sector grid uses `grid-template-columns: repeat(3, 1fr)` on desktop but each card has varying content density — never force equal heights.
- **NO centered hero headlines.** The hero uses LEFT-ALIGNED text. Never center H1 in the hero.
- **NO full-width single-column text walls.** Every content section is at minimum 2-column on desktop.
- **NO section-numbered eyebrows.** Write `"Our Sectors"` not `"04 · Sectors"` or `"SECTION 04"`.
- **NO scroll cue arrows.** No "scroll down" text, no animated arrows, no chevrons below the hero.
- **NO decorative status dots** unless showing real semantic state (e.g. office "open" indicator).

### Animation Bans
- **NO `window.addEventListener('scroll')`** — use `IntersectionObserver` (already in `useScrollReveal` hook) or Framer Motion `useInView`.
- **NO spring physics / bounce** — this is a boardroom brand. `cubic-bezier(0.16, 1, 0.3, 1)` only.
- **NO magnetic cursor effects.**
- **NO particle backgrounds, canvas noise, or WebGL hero effects.**
- **NO loading spinners** — use skeleton loaders that match the layout shape instead.

### Copy Bans
- **NO em-dashes ( — ) or en-dashes ( – )** in any text content. Use a hyphen or rewrite the sentence.
- **NO fake placeholder names** like "John Doe" or "Jane Smith." All names are from the Zebrold portfolio data.
- **NO generic stats** like "99.9% uptime" or "50% faster." Use real numbers from `src/data/`.

### Visual Bans
- **NO pure `#000000` black.** Always use `var(--color-black)` which is `#0A0A0A`.
- **NO neon glows or box-shadow color glows.** Shadows are tinted to background hue and subtle.
- **NO gradient text** (background-clip: text) on headlines.
- **NO pills or tags floating on top of images.**
- **NO version labels** (v1.2.3, BETA, INVITE-ONLY) anywhere on the site.
- **NO locale/weather/time strips** (e.g. "Frankfurt 09:41 · 18°C").

---

## 4. ANIMATION SYSTEM [ZEBROLD SPEC]

All animations use `var(--ease-out-expo): cubic-bezier(0.16, 1, 0.3, 1)` — no exceptions.

### A. Scroll Reveal (Sections + Cards)
Use the existing `useScrollReveal` hook. Apply `.reveal` class to every section and card.
CSS already defined in `tokens.css`:
```css
.reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.85s var(--ease-out-expo), transform 0.85s var(--ease-out-expo); }
.reveal.visible { opacity: 1; transform: translateY(0); }
```
For staggered children, use `data-delay` attribute:
```jsx
{sectors.map((s, i) => (
  <div className="reveal sector-card" data-delay={i * 80} key={s.id}>
```

### B. Hero Headline — Clip-Path Word Wipe
Each word in the hero headline reveals with a clip-path wipe (NOT opacity fade):
```css
.hero-word {
  display: inline-block;
  clip-path: inset(0 100% 0 0);
  animation: wordReveal 0.75s var(--ease-out-expo) forwards;
}
@keyframes wordReveal {
  to { clip-path: inset(0 0% 0 0); }
}
```

### C. CountUp Numbers (Stats Strip + About Section)
Use the existing `useCountUp` hook. Triggers on IntersectionObserver.
Numbers must display in `var(--font-mono)`. Format: `EUR 2.1B`, `INR 13,705 Cr`, `26`.
```jsx
const count = useCountUp({ target: 26, duration: 1800 })
<span className="stat-number">{count}</span>
```

### D. Navbar Scroll Behavior
On scroll > 10px: add `.is-scrolled` class to navbar.
```css
.navbar { background: rgba(15,15,15,0.6); backdrop-filter: blur(20px); transition: background 0.3s ease; }
.navbar.is-scrolled { background: rgba(10,10,10,0.95); }
```

### E. Hero Slider Transitions
3-slide auto-rotating hero. Transition: current slide exits with `translateX(-100%)`, new slide enters from `translateX(100%)`. Duration: 800ms with `ease-out-expo`. Auto-advance: 6000ms interval.
```css
.slide { transform: translateX(100%); opacity: 0; transition: transform 0.8s var(--ease-out-expo), opacity 0.8s var(--ease-out-expo); }
.slide.active { transform: translateX(0); opacity: 1; }
.slide.exiting { transform: translateX(-100%); opacity: 0; }
```

### F. Card Hover States
```css
.sector-card {
  transition: transform 0.3s var(--ease-out-expo), box-shadow 0.3s var(--ease-out-expo), border-color 0.3s ease;
}
.sector-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(4, 44, 83, 0.25);
  border-color: var(--color-gold);
}
```

### G. Nav Underline Draw
```css
.nav-link::after {
  content: '';
  display: block;
  height: 1px;
  background: var(--color-gold);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s var(--ease-out-expo);
}
.nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
```

### H. Top Bar Ticker
Financial data in TopBar scrolls horizontally on a CSS marquee loop:
```css
.ticker-track {
  display: flex;
  gap: 3rem;
  animation: ticker 30s linear infinite;
  white-space: nowrap;
}
@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
```

### I. Page Transition
Between route changes: a dark overlay (`--color-blue-900`) swipes in from left, then out to right.
```jsx
// Wrap routes with AnimatePresence from framer-motion
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '-100%' }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### J. Side Drawer (Subsidiary Detail)
Slides in from the right. Overlay behind it fades in.
```css
.side-drawer { transform: translateX(100%); transition: transform 0.55s var(--ease-out-expo); }
.side-drawer.open { transform: translateX(0); }
.drawer-overlay { opacity: 0; transition: opacity 0.3s ease; pointer-events: none; }
.drawer-overlay.open { opacity: 1; pointer-events: all; }
```

---

## 5. PAGE-SPECIFIC DIRECTIVES

### Home Page
- Hero: Full `min-height: 100dvh`, 3-slide auto-rotation, left-aligned content.
- Stats strip: 5 items in a row, white cards on dark background, all numbers use `useCountUp`.
- Sectors grid: `grid-template-columns: repeat(3, 1fr)`, gap `1.5rem`. On tablet: 2 cols. Mobile: 1 col.
- Subsidiaries carousel: CSS `scroll-snap-type: x mandatory`, 4 cards visible desktop, 1 mobile.
- Global presence map: SVG world map, pulsing dots `@keyframes pulse`, click/hover shows tooltip.
- News strip: 3 cards, CSS grid `repeat(3, 1fr)`. Mobile: stack.

### Subsidiaries Page
- Filter bar: sector dropdown + search input. Filter logic in component state (useState).
- Grid: `grid-template-columns: repeat(3, 1fr)`. Cards show: name, sector tag (colored pill), CEO, MD, revenue (DM Mono), WC (DM Mono), 1-line description.
- On card click: open SideDrawer with full company detail from `subsidiaries.js` data.
- Sector pill colors: each sector gets a unique muted color from the blue/teal/slate family. NEVER random rainbow colors.

### Admin Panel (/admin)
- Full-screen, no Navbar, no TopBar, no Footer.
- Sidebar: `--color-blue-900` background, white text. Active item: gold left border (3px) + slightly lighter background.
- All changes save to `localStorage`. On save: show Toast notification (green, 3 seconds).
- Right panel: preview iframe of homepage that refreshes on save via `postMessage`.
- Image upload: drag-drop zone with dashed border, shows preview thumbnail before apply.

---

## 6. PERFORMANCE GUARDRAILS

- `will-change: transform` only on `.hero-slide`, `.side-drawer`, animated cards during hover.
- Remove `will-change` after animation completes using `transitionend` event.
- Grain/noise textures: ONLY on `position: fixed; pointer-events: none; z-index: 0` pseudo-elements.
- SVG world map: inline SVG in JSX — never `<img src="map.svg">` (needs JS interactivity).
- All images: `loading="lazy"` and explicit `width`/`height` to prevent layout shift.
- Hero background images: preload the first slide image in `index.html` `<link rel="preload">`.
- `prefers-reduced-motion`: wrap all keyframe animations and transitions with:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
    * { animation-duration: 0.01ms !important; }
  }
  ```

---

## 7. HARD PRE-FLIGHT CHECKLIST

Before shipping any component or page, every item must honestly pass:

- [ ] All colors use CSS variables — zero hardcoded hex values
- [ ] All headings use `var(--font-display)` (Playfair Display)
- [ ] All numbers/stats use `var(--font-mono)` (DM Mono)
- [ ] No `window.addEventListener('scroll')` — IntersectionObserver or Framer Motion only
- [ ] No `height: 100vh` — replaced with `min-height: 100dvh`
- [ ] No three-equal-card feature rows without intentional asymmetry
- [ ] No centered hero headlines
- [ ] No em-dashes or en-dashes in text content
- [ ] No Inter, Roboto, Geist, or system fonts anywhere
- [ ] No Lucide, Heroicons, or Phosphor icons — Tabler outline only
- [ ] Card hover uses `translateY(-6px)` + gold border, not color fill
- [ ] Sector cards stagger on scroll reveal with `data-delay`
- [ ] CountUp numbers trigger on IntersectionObserver, not on mount
- [ ] Admin saves to localStorage and shows Toast on success
- [ ] Mobile layout tested: no horizontal scroll, no broken grids
- [ ] `prefers-reduced-motion` disables all animations

---

## 8. DATA SOURCES [ALWAYS USE THESE — NEVER INVENT]

All content comes from these files. Never use placeholder or fake data.

```
src/data/subsidiaries.js  ← 26 companies, all fields
src/data/sectors.js       ← 12 sectors, icons, WC, company list
src/data/offices.js       ← 26 offices, city, country, region, function, map coords
src/data/news.js          ← News articles
```

Key real numbers to use in stat blocks and hero:
- Revenue: `EUR 2.1B`
- Working Capital: `INR 13,705 Cr`
- Subsidiaries: `26`
- Sectors: `12`
- Offices: `26`
- HQ: `Bockenheimer Anlage 44, Frankfurt am Main, 60322, Germany`
- Website: `zebroldgroup.com`
- Chairman: `Hemendrah Kumar Sadamsetty`
- Managing Director: `Indu Reddy Morthala`

---

## 9. TONE & COPY RULES

- Headlines: declarative, short, punchy. `"Built to Lead."` not `"We are proud to be a leading company."`
- Numbers formatted always: `EUR 2.1B`, `INR 13,705 Cr`, `26 Offices` — never raw digits alone.
- Sectors always Title Case. Companies always in full official name.
- Use `FY25` not `Financial Year 2024-25` or `fiscal 2025`.
- No buzzwords: no "synergies," "leverage," "ecosystem," "paradigm."
- Section labels (eyebrows) in plain language: `"Our Sectors"` not `"04 - Sectors"`.
