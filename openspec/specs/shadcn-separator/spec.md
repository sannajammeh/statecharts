## ADDED Requirements

### Requirement: Separator provides visual division
The Separator component SHALL provide horizontal and vertical lines for visually dividing content.

#### Scenario: Horizontal separator renders correctly
- **WHEN** a Separator with orientation="horizontal" is rendered
- **THEN** it displays as a horizontal line spanning full width

#### Scenario: Vertical separator renders correctly
- **WHEN** a Separator with orientation="vertical" is rendered
- **THEN** it displays as a vertical line spanning full height

#### Scenario: Separator has proper styling
- **WHEN** a Separator is rendered
- **THEN** it displays with subtle border color from theme

#### Scenario: Decorative separator
- **WHEN** a Separator with decorative={true} is rendered
- **THEN** it is hidden from screen readers

#### Scenario: Separator supports custom className
- **WHEN** a Separator with className="custom-class" is rendered
- **THEN** the custom class is applied alongside base styles

### Requirement: Separator integrates with Card layouts
The Separator component SHALL work within Card containers to divide sections.

#### Scenario: Separator between Card sections
- **WHEN** a Separator is placed between CardContent sections
- **THEN** it provides visual separation without extra spacing issues

#### Scenario: Separator in CardFooter
- **WHEN** a Separator is placed before CardFooter content
- **THEN** it visually separates content from footer actions
