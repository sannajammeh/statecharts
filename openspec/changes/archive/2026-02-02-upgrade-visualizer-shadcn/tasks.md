## 1. Setup and Installation

- [x] 1.1 Initialize shadcn/ui in the visualizer package using the Zinc color theme
- [x] 1.2 Install shadcn Button component
- [x] 1.3 Install shadcn Card component (includes CardHeader, CardTitle, CardContent, CardFooter)
- [x] 1.4 Install shadcn Badge component
- [x] 1.5 Install shadcn Tooltip component (includes TooltipProvider, TooltipTrigger, TooltipContent)
- [x] 1.6 Install shadcn Separator component
- [x] 1.7 Install shadcn ScrollArea component
- [x] 1.8 Verify all dependencies are properly installed and TypeScript types resolve

## 2. HistoryControls Component Migration

- [x] 2.1 Import shadcn Button component into HistoryControls.tsx
- [x] 2.2 Replace Back button with shadcn Button using variant="secondary"
- [x] 2.3 Replace Forward button with shadcn Button using variant="secondary"
- [x] 2.4 Replace Reset button with shadcn Button using variant="destructive"
- [x] 2.5 Add Tooltip wrapper around Back button with "Back (←)" label
- [x] 2.6 Add Tooltip wrapper around Forward button with "Forward (→)" label
- [x] 2.7 Add Tooltip wrapper around Reset button with "Reset (R)" label
- [x] 2.8 Ensure disabled state styling works correctly for all buttons
- [ ] 2.9 Verify keyboard shortcuts still work (ArrowLeft, ArrowRight, R)
- [x] 2.10 Remove unused custom button style classes

## 3. EventPanel Component Migration

- [x] 3.1 Import shadcn Card components into EventPanel.tsx
- [x] 3.2 Wrap EventPanel content in Card container
- [x] 3.3 Add CardHeader with CardTitle "Available Events"
- [x] 3.4 Move event buttons into CardContent
- [x] 3.5 Import shadcn Badge component
- [x] 3.6 Add Badge component for guard conditions on event buttons (variant="secondary")
- [x] 3.7 Replace custom event button styles with shadcn Button (variant="default")
- [ ] 3.8 Verify event click handlers still work correctly
- [x] 3.9 Remove unused custom styling classes

## 4. ContextPanel Component Migration

- [x] 4.1 Import shadcn Card components into ContextPanel.tsx
- [x] 4.2 Wrap ContextPanel content in Card container
- [x] 4.3 Add CardHeader with CardTitle for "Current State" section
- [x] 4.4 Add CardHeader with CardTitle for "Context" section
- [x] 4.5 Import shadcn ScrollArea component
- [x] 4.6 Wrap JSON context display in ScrollArea with max-height constraint
- [x] 4.7 Import shadcn Separator component
- [x] 4.8 Add Separator between Current State and Context sections
- [x] 4.9 Verify monospace font and formatting preserved for context data
- [x] 4.10 Remove unused custom styling classes

## 5. CSS and Theming

- [x] 5.1 Add shadcn CSS variables to visualizer styles.css (Zinc theme colors)
- [ ] 5.2 Verify light mode displays correctly with Zinc palette
- [ ] 5.3 Verify dark mode displays correctly with Zinc palette
- [ ] 5.4 Ensure Card borders and backgrounds match theme
- [ ] 5.5 Ensure Button variants display correct Zinc-based colors
- [ ] 5.6 Ensure ScrollArea scrollbar styling matches theme

## 6. Testing and Verification

- [x] 6.1 Run TypeScript type checking: `turbo check-types --filter=@statecharts/visualizer`
- [ ] 6.2 Run linter: `turbo lint --filter=@statecharts/visualizer`
- [x] 6.3 Build package: `turbo build --filter=@statecharts/visualizer`
- [ ] 6.4 Test keyboard navigation (Tab, Enter, Space, Arrow keys)
- [ ] 6.5 Test keyboard shortcuts (ArrowLeft for back, ArrowRight for forward, R for reset)
- [ ] 6.6 Test tooltip display on hover and focus
- [ ] 6.7 Test button disabled states (canGoBack, canGoForward)
- [ ] 6.8 Test event button functionality
- [ ] 6.9 Verify scroll area works with long context data
- [ ] 6.10 Verify visual appearance matches design expectations

## 7. Cleanup and Documentation

- [ ] 7.1 Remove any unused Tailwind classes from migrated components
- [ ] 7.2 Update component imports to use consistent ordering (React → shadcn → local)
- [ ] 7.3 Verify no console errors or warnings in dev mode
- [ ] 7.4 Check bundle size impact with `npm run build`
- [ ] 7.5 Update any relevant documentation or README files
- [ ] 7.6 Verify all 42 spec scenarios are addressed in implementation
