
## Update sponsor logo grid styling

**What**: Remove the white background from logo containers so they blend into the dark site background, and add a subtle gold/primary border for separation.

**Steps**:

1. **Update `src/components/SponsorsSection.tsx`**:
   - Change logo container class from `bg-white/90 border border-border` to `bg-transparent border border-primary/30` (gold-tinted border)
   - For the PrimAB logo (dark on transparent), apply CSS `filter: invert(1) brightness(2)` or similar to make it visible on the dark background
   - Keep hover effect as `hover:border-primary/50` for a brighter gold on hover
   - Remove the `p-3` padding or keep minimal padding for breathing room

**Technical detail**: The PrimAB logo is dark blue on transparent background. On the dark site theme it will be invisible without either inverting the colors via CSS filter or keeping a light background. Using `filter: brightness(0) invert(1)` will turn it white/light, making it visible against the dark background while maintaining the transparent look the user wants.
