## ADDED Requirements

### Requirement: Badge component displays labels
The Badge component SHALL display short labels, tags, or status indicators with consistent styling.

#### Scenario: Default badge renders correctly
- **WHEN** a Badge with variant="default" is rendered
- **THEN** it displays with primary brand colors

#### Scenario: Secondary badge renders correctly
- **WHEN** a Badge with variant="secondary" is rendered
- **THEN** it displays with muted background colors

#### Scenario: Outline badge renders correctly
- **WHEN** a Badge with variant="outline" is rendered
- **THEN** it displays with border-only styling

#### Scenario: Destructive badge renders correctly
- **WHEN** a Badge with variant="destructive" is rendered
- **THEN** it displays with error/danger colors

#### Scenario: Badge displays text content
- **WHEN** text is placed inside a Badge
- **THEN** the text is displayed with appropriate sizing and padding

#### Scenario: Badge supports custom className
- **WHEN** a Badge with className="custom-class" is rendered
- **THEN** the custom class is applied alongside base styles

### Requirement: Badge indicates state types
The Badge component SHALL be used to indicate different statechart state types (atomic, compound, parallel, final).

#### Scenario: Atomic state badge
- **WHEN** a Badge displays "atomic" state type
- **THEN** it uses the default variant

#### Scenario: Compound state badge
- **WHEN** a Badge displays "compound" state type
- **THEN** it uses the secondary variant

#### Scenario: Parallel state badge
- **WHEN** a Badge displays "parallel" state type
- **THEN** it uses the outline variant
