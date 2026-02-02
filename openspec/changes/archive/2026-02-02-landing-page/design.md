## Context

Current `apps/web/app/page.tsx` has working UI structure with placeholder text. Need to replace Lorem ipsum with real statecharts content.

## Goals / Non-Goals

**Goals:**
- Communicate what statecharts are and why they matter
- Show install commands for all package managers
- Tease the visualizer (coming soon)
- Provide relevant FAQ content

**Non-Goals:**
- No structural changes to page layout
- No new components or dependencies
- No interactive features beyond existing (copy button, FAQ accordion)

## Decisions

### Content structure
Keep existing sections, update content:
1. **Hero**: "An open state chart specification and library" + badges
2. **Install**: Show `npm/pnpm/bun install statecharts`
3. **Features**: Explain statecharts concept with code example (state machine definition)
4. **Coming Soon**: Visualizer preview with placeholder/mockup
5. **FAQ**: Statecharts-specific questions (what are they, vs redux, vs xstate, etc.)

### Code example approach
Show simple traffic light statechart - universally understood, demonstrates states + transitions.

## Risks / Trade-offs

- **Visualizer mockup**: Need placeholder since feature doesn't exist yet → Use "Coming Soon" badge + description
- **No actual GitHub repo yet**: Use placeholder URL → Update when repo is public
