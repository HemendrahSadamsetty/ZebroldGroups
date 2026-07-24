# Design System: ZG Interactive Constellation Hub

## 1. Visual Theme & Atmosphere
A clean, premium, investor-grade interactive showcase inspired by Stripe, Apple, and Instructure. The section features a central animated "ZG" brand core sphere surrounded symmetrically by the 26 company cards. Hovering over any card dynamically connects it to the center, morphing the core from the brand monogram to the company's specific data readout.

- **Density:** Gallery Airy (3/10) - Generous vertical separation (160px top & bottom padding).
- **Variance:** Symmetric Constellation (2/10) - Perfectly centered core flanked by equal left/right card lists.
- **Motion:** Interactive Spring & Orbits (8/10) - Rotating orbital rings, background pulse, and spring-driven card highlights.

## 2. Color Palette & Roles
- **Substrate Background:** `#F9FAFB` (Canvas off-white)
- **Core Hub Border/Tension:** `#111111` (Carbon Black)
- **Primary Ink Text:** `#0A0A0A` (Charcoal Black)
- **Secondary Muted Text:** `#6B7280` (Muted Steel Gray)
- **Accent Highlight:** `#2563EB` (Primary Royal Blue)

## 3. Typography Rules
- **Display Headings:** Inter / Geist / SF Pro Display. Casing: Title casing. Centered alignment.
- **Core Sphere Monogram:** Inter Bold. Casing: Uppercase (`ZG`). Size: 48px.
- **Core Sphere Company Info:** Inter. Bold/Medium weights, relaxed leading. Company name: 20px, Sector: 12px, Tagline: 14px.

## 4. Component Stylings
* **The ZG Core Sphere (`.zg-core-sphere`):**
  - **Dimensions:** 260px width & height (circular).
  - **Borders:** `1px solid #E5E7EB` with slow-rotating SVG orbital rings (`.zg-orbital-ring` rotating at `20s` and `-15s` loops).
  - **Pulsing Background:** Breathing radial glow transition.
  - **Content States:**
    - *Default:* Centered bold `ZG` monogram.
    - *Active:* Faded monogram, transitioning in the active company's name, sector badge, and tagline.

* **Constellation Company Cards:**
  - **Border:** None by default (borderless text logo layout).
  - **Hover:** Translate up `-4px`, background turns `#FFFFFF` with soft whisper border (`#E5E7EB`).
  - **Tactile Underline:** Underline slide-in reveals in accent blue on hover.

## 5. Layout Principles
- Symmetrical split: Left Column (13 cards) | Center Column (260px Core Sphere) | Right Column (13 cards).
- Below `1024px` width, the ZG Core Sphere locks at the top of the section, with the company cards scrolling below.

## 6. Motion & Interaction
- Crossfading of sphere contents: Framer Motion `<AnimatePresence>` handles smooth layout fades.
- Card spring highlights: `type: "spring", stiffness: 100, damping: 20`.
