## ADDED Requirements

### Requirement: ScrollArea provides custom scrolling
The ScrollArea component SHALL provide a scrollable container with custom-styled scrollbars.

#### Scenario: ScrollArea renders with scrollable content
- **WHEN** content exceeding container height is placed inside ScrollArea
- **THEN** scrollbars appear to allow content navigation

#### Scenario: ScrollArea displays custom scrollbar
- **WHEN** a ScrollArea is rendered
- **THEN** it displays a styled scrollbar instead of native scrollbar

#### Scenario: ScrollArea supports vertical scrolling
- **WHEN** a ScrollArea with vertical overflow is rendered
- **THEN** a vertical scrollbar appears

#### Scenario: ScrollArea supports horizontal scrolling
- **WHEN** a ScrollArea with horizontal overflow is rendered
- **THEN** a horizontal scrollbar appears

#### Scenario: ScrollArea supports custom className
- **WHEN** a ScrollArea with className="custom-class" is rendered
- **THEN** the custom class is applied alongside base styles

#### Scenario: ScrollArea hides scrollbar when not needed
- **WHEN** content fits within ScrollArea viewport
- **THEN** scrollbars are hidden automatically

### Requirement: ScrollArea displays context data
The ScrollArea component SHALL be used for displaying long context/state data in the visualizer.

#### Scenario: JSON context display
- **WHEN** JSON stringified context is placed inside ScrollArea
- **THEN** it displays with monospace font and proper overflow handling

#### Scenario: Nested state display
- **WHEN** nested statechart state objects are displayed in ScrollArea
- **THEN** users can scroll to view all nested properties

#### Scenario: ScrollArea respects max height
- **WHEN** a ScrollArea with max-height is rendered
- **THEN** content beyond max-height becomes scrollable
