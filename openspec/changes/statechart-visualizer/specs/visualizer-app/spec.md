## ADDED Requirements

### Requirement: Standalone Vite application
The package SHALL include a Vite-built standalone app at the default entry point.

#### Scenario: Dev server
- **WHEN** running `npm run dev` in package
- **THEN** Vite dev server starts with hot reload

#### Scenario: Production build
- **WHEN** running `npm run build`
- **THEN** static files output to `dist/`

### Requirement: Load chart via file upload
The app SHALL allow users to load chart JSON by file upload.

#### Scenario: Drag and drop
- **WHEN** user drags .json file onto app
- **THEN** file is parsed and chart renders in Visualizer

#### Scenario: File picker
- **WHEN** user clicks "Load file" button
- **THEN** file picker opens filtered to .json files
- **THEN** selected file renders in Visualizer

#### Scenario: Invalid file
- **WHEN** user loads non-JSON or invalid chart file
- **THEN** error message displayed with details

### Requirement: Load chart via URL parameter
The app SHALL accept chart JSON URL via query parameter.

#### Scenario: URL parameter loading
- **WHEN** app loads with `?chart=https://example.com/chart.json`
- **THEN** JSON is fetched and rendered

#### Scenario: CORS error handling
- **WHEN** chart URL fails due to CORS
- **THEN** helpful error message suggests alternatives

### Requirement: Load chart via URL input
The app SHALL provide text input for chart JSON URL.

#### Scenario: Paste URL
- **WHEN** user pastes URL into input and clicks "Load"
- **THEN** JSON is fetched and rendered

### Requirement: Example charts
The app SHALL include example charts for demonstration.

#### Scenario: Example selector
- **WHEN** user clicks "Examples" dropdown
- **THEN** list of built-in example charts shown
- **WHEN** user selects example
- **THEN** example chart renders

### Requirement: Package.json bin entry for npx
The package SHALL define bin entry for `npx @statecharts/visualizer`.

#### Scenario: npx execution
- **WHEN** user runs `npx @statecharts/visualizer`
- **THEN** static server starts serving built app
- **THEN** browser opens to localhost

#### Scenario: npx with chart file
- **WHEN** user runs `npx @statecharts/visualizer chart.json`
- **THEN** app opens with chart pre-loaded via URL param

#### Scenario: Custom port
- **WHEN** user runs `npx @statecharts/visualizer --port 8080`
- **THEN** server starts on port 8080
