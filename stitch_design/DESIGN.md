---
name: High-Street Editorial
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#504444'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#827473'
  outline-variant: '#d4c2c2'
  surface-tint: '#7b5455'
  primary: '#7b5455'
  on-primary: '#ffffff'
  primary-container: '#f4c2c2'
  on-primary-container: '#734e4e'
  inverse-primary: '#ecbaba'
  secondary: '#b40065'
  on-secondary: '#ffffff'
  secondary-container: '#e10080'
  on-secondary-container: '#fffbff'
  tertiary: '#5e5e5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#cfceca'
  on-tertiary-container: '#575855'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad9'
  primary-fixed-dim: '#ecbaba'
  on-primary-fixed: '#2f1314'
  on-primary-fixed-variant: '#613d3e'
  secondary-fixed: '#ffd9e3'
  secondary-fixed-dim: '#ffb0ca'
  on-secondary-fixed: '#3e001f'
  on-secondary-fixed-variant: '#8d004e'
  tertiary-fixed: '#e4e2de'
  tertiary-fixed-dim: '#c8c6c3'
  on-tertiary-fixed: '#1b1c1a'
  on-tertiary-fixed-variant: '#474744'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Bodoni Moda
    fontSize: 84px
    fontWeight: '900'
    lineHeight: 90px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Bodoni Moda
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Bodoni Moda
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
  headline-md:
    fontFamily: Bodoni Moda
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.05em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.03em
  label-caps:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  bento-gap: 16px
---

## Brand & Style
The design system embodies a fusion of luxury editorial aesthetics and high-energy streetwear culture. It targets a fashion-forward audience that values craftsmanship but rejects traditional stuffiness. 

The visual direction is **Neo-Brutalist Minimalism**. It utilizes a "high-low" mix: high-end editorial typography paired with raw, thick-stroked UI elements. The interface should feel like a physical fashion zine—bold, intentional, and slightly rebellious. Every interaction should evoke a sense of premium exclusivity through generous whitespace, while maintaining a playful edge with "ink-bleed" textures, manga-inspired sparkles, and asymmetrical layouts.

## Colors
The palette is strictly curated to evoke a "Modern Rose" aesthetic, avoiding any cool tones (blue/green) or warm citrus (orange/yellow).

- **Base (#FDFBF7):** A warm cream used for the primary background to soften the contrast against the black ink.
- **Main (#F4C2C2):** Blush Pink used for large surface areas, soft highlights, and secondary buttons.
- **Highlight (#FF1493):** Hot Pink for high-impact calls to action, active states, and expressive graphic elements.
- **Ink (#000000):** Pure black used for all borders, text, and structural shadows to provide a grounded, brutalist framework.
- **Pure White (#FFFFFF):** Reserved for card interiors or high-contrast highlights to provide "breathing room" within the pink-heavy environment.

## Typography
The typography relies on a dramatic contrast between high-fashion serifs and technical monospaced fonts.

- **Headlines:** Use **Bodoni Moda**. It provides the "Vogue" editorial feel. Headlines should be set with tight tracking to feel dense and impactful.
- **Body:** Use **Hanken Grotesk**. Set with generous letter spacing (3-5%) to mimic luxury branding. It should feel airy and easy to read.
- **Accents/Technical Data:** Use **Space Mono** for labels, SKU numbers, and prices. This adds a "streetwear tag" or industrial feel to the product details.

## Layout & Spacing
This design system uses an **Asymmetrical Bento Grid**. Unlike traditional symmetrical grids, content blocks should vary in height and width to create a rhythmic, zine-like flow.

- **Desktop:** 12-column grid with wide 64px margins. Content should often break the grid, with images overlapping container borders.
- **Mobile:** Single column with 20px margins. Use horizontal scrolling marquees for product discovery to maintain a "fast" feel.
- **Spacing Rhythm:** Use a 4px base unit. Gaps between bento cards should be consistent (16px), but the internal padding of cards should be generous (32px+) to maintain a premium feel.

## Elevation & Depth
Depth is created through **Hard Shadows** rather than blurs, staying true to the Neo-Brutalist style.

- **Primary Elevation:** 4px 4px 0px #000000. This is applied to buttons and primary product cards. It creates a tactile, "sticker" look.
- **Soft Accent Depth:** Use 20px - 40px blurs of #F4C2C2 (Blush Pink) behind floating elements like jewelry close-ups to create a "dreamy" halo effect that contrasts with the sharp black borders.
- **Layering:** Elements should frequently overlap. A product image might sit 24px above its card base, casting a hard shadow onto the card surface itself.

## Shapes
The shape language is a mix of **Rounded-Large (16px)** for containers and **Sharp (0px)** for decorative structural elements.

- **Cards & Containers:** Use `rounded-lg` (16px) to soften the "brutal" black borders and make the UI feel approachable and "youthful."
- **Buttons:** Fully pill-shaped (rounded-xl) to contrast against the rectangular grid.
- **Decorative:** Use 8-pointed stars (sparkles) and halftone circles as background motifs to inject the "manga" influence.
- **Borders:** All primary containers must have a 2px black border. Featured elements use a 4px black border.

## Components

- **Product Cards:** Asymmetrical layouts. The image should slightly "pop" out of the top border. Use a 2px black stroke. Prices are displayed in `label-caps` (Space Mono).
- **Buttons:** 
  - *Primary:* Hot Pink (#FF1493) background, black text, 2px black border, hard shadow. 
  - *Secondary:* Blush Pink (#F4C2C2) background, no shadow, 2px black border.
- **Marquees:** Horizontal scrolling text using `display-lg` (Bodoni Moda) in outline-only black text. Used for "New Drops" or "Limited Edition" announcements.
- **Storytelling Blocks:** Large cream-colored (#FDFBF7) sections with high-contrast editorial text and small manga-style sparkles (#FF1493) scattered near the typography.
- **Inputs:** Square corners (0px) with a 2px bottom-only border for a minimal, high-end stationery feel. Labelled with Space Mono.
- **Chips:** Small, pill-shaped tags in pure white with 1px black borders.