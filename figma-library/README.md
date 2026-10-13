# Magma Icon Library Builder

This development plugin builds a searchable Figma icon library from
`src/svg/icons`.

## Library structure

- Google icons are component sets named `Category/Icon Name`.
- Each Google component set has `Variant=Filled` and `Variant=Outlined`.
- Magma-owned icons remain under `Custom` and are not modified.
- Components include the Google source name, React export name, category, and
  search terms in their descriptions.
- Category pages provide the first library level, so component names contain
  only the icon name (for example, `UI Actions/Accessibility`).
- Every component uses a 24 × 24 frame for stable instance swapping.

## Run in Figma

1. Create or open the dedicated Magma icon library file.
2. Open **Plugins → Development → Import plugin from manifest…**.
3. Select `figma-library/manifest.json`.
4. Run **Magma Icon Library Builder**.
5. Choose the repository's `src/svg/icons` folder and select **Build library**.
6. Review the generated category pages, then publish the file as a library.

Run the importer again after updating Material Symbols. With **Replace matching
generated components** selected, matching icon components are rebuilt using the
latest SVG artwork.
