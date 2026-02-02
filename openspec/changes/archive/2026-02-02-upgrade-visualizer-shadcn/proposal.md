## Why

The Visualizer package currently uses custom-styled components with raw Tailwind classes. Migrating to shadcn/ui's prebuilt components will provide consistent, accessible UI primitives with built-in theming support, keyboard navigation, and reduced maintenance overhead. This upgrade also enables better integration with the existing shadcn ecosystem used across the monorepo.

## What Changes

- Install shadcn/ui dependencies in the Visualizer package
- Replace custom button implementations with shadcn Button component
- Add shadcn Card, Badge, and Tooltip components for improved UI
- Migrate panel layouts to use shadcn Card-based containers
- Update component styles to use shadcn design tokens and CSS variables
- Add proper accessibility attributes via shadcn built-in a11y features
- **BREAKING**: Visual styling changes to buttons and panels (design token migration)

## Capabilities

### New Capabilities
- `shadcn-button`: Button component integration with variants (default, secondary, destructive, outline, ghost)
- `shadcn-card`: Card container component for panel layouts with header, content, and footer sections
- `shadcn-badge`: Badge component for state type indicators and labels
- `shadcn-tooltip`: Tooltip component for button hints and state information
- `shadcn-separator`: Separator component for visual hierarchy in panels
- `shadcn-scroll-area`: Scrollable container for context display with custom scrollbar

### Modified Capabilities
<!-- No existing capabilities have spec-level requirement changes -->

## Impact

- **Package**: `@statecharts/visualizer`
- **Dependencies**: Add `@radix-ui/*` packages, `class-variance-authority`, `clsx`, `tailwind-merge`
- **Components Affected**: `EventPanel`, `HistoryControls`, `ContextPanel`, `StateNode`
- **Styling**: Migration from custom Tailwind classes to shadcn design tokens
- **Accessibility**: Improved via Radix UI primitives
- **Bundle Size**: Slight increase from Radix dependencies, offset by reduced custom CSS
