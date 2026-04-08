

## Add PrimAB logo to Partners section

**What**: Replace the first placeholder ("Logotyp 1") in the SponsorsSection with the uploaded PrimAB logo.

**Steps**:

1. Copy `user-uploads://PrimAB_logotyp_på_transparent_bakgrund.png` to `src/assets/sponsor-primab.png`
2. Update `src/components/SponsorsSection.tsx`:
   - Import the logo asset
   - Convert the logo grid from placeholder text to a data-driven array
   - Replace the first grid item with an `<img>` showing the PrimAB logo, keeping items 2-4 as placeholders

**Technical detail**: The logo has a transparent background and dark blue color. Since the site uses a dark theme, we may need to add a light/white background or use CSS `filter: invert()` to ensure visibility. Will add a subtle light background to the logo container.

