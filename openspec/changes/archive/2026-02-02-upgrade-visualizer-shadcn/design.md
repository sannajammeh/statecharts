## Context

The Visualizer package (`apps/visualizer`) is a React application that visualizes statecharts using React Flow. It currently uses custom Tailwind CSS classes for all UI components including buttons, panels, and badges. The monorepo uses Tailwind CSS v4 with CSS-first configuration. The visualizer needs consistent, accessible UI components that match the design system used across the project.

Current pain points:
- Custom button styles in `HistoryControls.tsx` using inline Tailwind classes
- Panel containers using basic divs with manual styling
- No standardized component library for common UI patterns
- Manual accessibility implementation required for interactive elements

## Goals / Non-Goals

**Goals:**
- Install and configure shadcn/ui in the Visualizer package
- Migrate `HistoryControls` buttons to use shadcn Button variants
- Wrap sidebar panels (`EventPanel`, `ContextPanel`) in shadcn Card components
- Replace state type indicators with shadcn Badge variants
- Add tooltips to history control buttons for better UX
- Maintain existing functionality and keyboard shortcuts
- Ensure visual consistency with design tokens

**Non-Goals:**
- Changing React Flow graph components (nodes/edges remain custom)
- Adding new features beyond component migration
- Modifying the simulation logic or statechart engine
- Full design system overhaul of the entire application

## Decisions

### 1. shadcn/ui Registry Configuration
**Decision**: Use the default shadcn registry without custom components.
**Rationale**: The default registry provides all needed components (Button, Card, Badge, Tooltip, Separator, ScrollArea) and follows established patterns. Custom components would add unnecessary complexity for this migration.

### 2. Component Variant Mapping
**Decision**: Map existing button styles to shadcn variants as follows:
- History navigation (Back/Forward) → `variant="secondary"`
- Reset button → `variant="destructive"`
- Event buttons → `variant="default"`

**Rationale**: This maintains semantic meaning while adopting shadcn's design language. The destructive variant for reset provides visual affordance for a destructive action.

### 3. Card Structure for Sidebar
**Decision**: Use Card with Header, Content structure for panels.
**Structure**:
```
<Card>
  <CardHeader>
    <CardTitle>Panel Title</CardTitle>
  </CardHeader>
  <CardContent>
    <!-- panel content -->
  </CardContent>
</Card>
```

**Rationale**: Provides consistent padding, borders, and visual hierarchy. Separators between cards can use the shadcn Separator component.

### 4. Tooltip Strategy
**Decision**: Wrap history control buttons with Tooltip components, keeping existing `title` attributes as fallback.
**Rationale**: Tooltips provide richer context than native titles and align with modern UX patterns. Keeping title attributes ensures accessibility fallback.

### 5. CSS Variable Integration
**Decision**: Use shadcn's CSS variables for theming, integrated with existing Tailwind v4 setup.
**Rationale**: Tailwind v4 uses CSS-first configuration. shadcn components use CSS variables for theming which integrates naturally with the existing setup.

### 6. Color Theme Selection
**Decision**: Use the Zinc color theme (shadcn's gray palette).
**Rationale**: Zinc provides a neutral, professional gray scale that works well for developer tools. It offers good contrast and integrates cleanly with the existing visualizer's light/dark mode support.

## Risks / Trade-offs

**[Bundle Size]** → shadcn components add Radix UI dependencies (~50-100KB gzipped). Mitigation: Only install components that are actually used; tree-shaking should eliminate unused code.

**[Visual Breaking Change]** → Buttons and panels will look different. Mitigation: This is documented as a breaking change in the proposal; visual refresh is intentional and desired.

**[Peer Dependency Conflicts]** → Radix UI may have React version requirements. Mitigation: Visualizer uses React 19 which is supported by latest Radix versions; verify during installation.

**[Customization Limitations]** → shadcn components have opinionated styling. Mitigation: Components can be customized via Tailwind classes and CSS variables; the default styling is well-designed and consistent.

## Migration Plan

1. **Install shadcn CLI and initialize** in the visualizer package
2. **Install required components**: button, card, badge, tooltip, separator, scroll-area
3. **Update components in order**:
   - `HistoryControls.tsx` - Replace buttons with shadcn Button
   - `EventPanel.tsx` - Wrap in Card, use Badge for event labels
   - `ContextPanel.tsx` - Wrap in Card, use ScrollArea for context display
4. **Add CSS variables** to the visualizer's CSS file
5. **Test** keyboard shortcuts and accessibility
6. **Verify** bundle size impact

## Open Questions

- None - all questions resolved. Using Zinc theme, standard shadcn variants are sufficient.
