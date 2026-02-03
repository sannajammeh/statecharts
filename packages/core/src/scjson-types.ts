// SCJSON Type Definitions
// JSON translation of W3C SCXML specification

/**
 * Base interface for all SCJSON elements.
 * Uses $type discriminator for element identification.
 */
export interface SCJSONElement {
  $type: string;
}

/**
 * SCXML root element - the document root for a state machine.
 */
export interface SCXMLElement extends SCJSONElement {
  $type: "scxml";
  /** SCXML version, always "1.0" */
  version: "1.0";
  /** Machine name (maps from chart id) */
  name?: string;
  /** Initial state id */
  initial: string;
  /** Data model type */
  datamodel?: "ecmascript";
  /** Optional schema reference for validation */
  $schema?: string;
  /** Child elements (states, datamodel, scripts) */
  children: SCXMLChild[];
}

/**
 * State element - atomic or compound state.
 */
export interface StateElement extends SCJSONElement {
  $type: "state";
  /** State identifier */
  id: string;
  /** Initial child state (for compound states) */
  initial?: string;
  /** Child elements (transitions, states, onentry, onexit) */
  children?: StateChild[];
}

/**
 * Parallel element - orthogonal regions executing concurrently.
 */
export interface ParallelElement extends SCJSONElement {
  $type: "parallel";
  /** State identifier */
  id: string;
  /** Child elements (states representing regions) */
  children?: StateChild[];
}

/**
 * Final element - terminal state.
 */
export interface FinalElement extends SCJSONElement {
  $type: "final";
  /** State identifier */
  id: string;
  /** Child elements (onentry, onexit, donedata) */
  children?: (OnentryElement | OnexitElement | DonedataElement)[];
}

/**
 * History element - state history pseudo-state.
 */
export interface HistoryElement extends SCJSONElement {
  $type: "history";
  /** History state identifier */
  id: string;
  /** History type */
  type?: "shallow" | "deep";
  /** Child elements (transition for default history target) */
  children?: TransitionElement[];
}

/**
 * Initial element - explicit initial transition for compound states.
 */
export interface InitialElement extends SCJSONElement {
  $type: "initial";
  /** Child elements (transition to initial state) */
  children?: TransitionElement[];
}

/**
 * Transition element - state transition triggered by event.
 */
export interface TransitionElement extends SCJSONElement {
  $type: "transition";
  /** Event name(s) that trigger this transition */
  event?: string;
  /** Guard condition expression */
  cond?: string;
  /** Target state id(s) */
  target?: string;
  /** Transition type */
  type?: "internal" | "external";
  /** Executable content (actions) */
  children?: ExecutableContent[];
}

/**
 * Onentry element - actions executed when entering a state.
 */
export interface OnentryElement extends SCJSONElement {
  $type: "onentry";
  /** Executable content */
  children?: ExecutableContent[];
}

/**
 * Onexit element - actions executed when exiting a state.
 */
export interface OnexitElement extends SCJSONElement {
  $type: "onexit";
  /** Executable content */
  children?: ExecutableContent[];
}

/**
 * Datamodel element - container for data declarations.
 */
export interface DatamodelElement extends SCJSONElement {
  $type: "datamodel";
  /** Data items */
  children?: DataElement[];
}

/**
 * Data element - declares a data item in the data model.
 */
export interface DataElement extends SCJSONElement {
  $type: "data";
  /** Data item identifier */
  id: string;
  /** Expression to initialize the data item */
  expr?: string;
}

/**
 * Assign element - assigns a value to a data item.
 */
export interface AssignElement extends SCJSONElement {
  $type: "assign";
  /** Location (data item id) to assign to */
  location: string;
  /** Expression for the new value */
  expr: string;
}

/**
 * Script element - executes ECMAScript code.
 */
export interface ScriptElement extends SCJSONElement {
  $type: "script";
  /** Inline script content */
  $text?: string;
}

/**
 * Raise element - raises an internal event.
 */
export interface RaiseElement extends SCJSONElement {
  $type: "raise";
  /** Event name to raise */
  event: string;
}

/**
 * Send element - sends an event to an external target.
 */
export interface SendElement extends SCJSONElement {
  $type: "send";
  /** Event type to send */
  event?: string;
  /** Event type expression */
  eventexpr?: string;
  /** Target of the event */
  target?: string;
  /** Target expression */
  targetexpr?: string;
  /** Delay before sending (e.g., "1s", "500ms") */
  delay?: string;
  /** Delay expression */
  delayexpr?: string;
  /** Unique identifier for this send */
  id?: string;
  /** Expression for id */
  idlocation?: string;
  /** Type of I/O processor */
  type?: string;
  /** Parameters for the event */
  children?: ParamElement[];
}

/**
 * Cancel element - cancels a delayed send.
 */
export interface CancelElement extends SCJSONElement {
  $type: "cancel";
  /** ID of the send to cancel */
  sendid?: string;
  /** Expression for sendid */
  sendidexpr?: string;
}

/**
 * Log element - logs a message.
 */
export interface LogElement extends SCJSONElement {
  $type: "log";
  /** Label for the log message */
  label?: string;
  /** Expression to evaluate and log */
  expr?: string;
}

/**
 * If element - conditional execution.
 */
export interface IfElement extends SCJSONElement {
  $type: "if";
  /** Condition expression */
  cond: string;
  /** Executable content and elseif/else elements */
  children?: (ExecutableContent | ElseifElement | ElseElement)[];
}

/**
 * Elseif element - alternative condition in an if block.
 */
export interface ElseifElement extends SCJSONElement {
  $type: "elseif";
  /** Condition expression */
  cond: string;
}

/**
 * Else element - fallback branch in an if block.
 */
export interface ElseElement extends SCJSONElement {
  $type: "else";
}

/**
 * Foreach element - iterates over a collection.
 */
export interface ForeachElement extends SCJSONElement {
  $type: "foreach";
  /** Expression evaluating to the collection */
  array: string;
  /** Variable name for current item */
  item: string;
  /** Variable name for current index */
  index?: string;
  /** Executable content */
  children?: ExecutableContent[];
}

/**
 * Invoke element - invokes an external service.
 */
export interface InvokeElement extends SCJSONElement {
  $type: "invoke";
  /** Unique identifier for this invocation */
  id?: string;
  /** Location to store the generated id */
  idlocation?: string;
  /** Type of service to invoke */
  type?: string;
  /** Type expression */
  typeexpr?: string;
  /** URI of the service */
  src?: string;
  /** Source expression */
  srcexpr?: string;
  /** Whether to forward events to the invoked service */
  autoforward?: boolean;
  /** Child elements (param, content, finalize) */
  children?: (ParamElement | ContentElement | FinalizeElement)[];
}

/**
 * Finalize element - actions to run when invoked service completes.
 */
export interface FinalizeElement extends SCJSONElement {
  $type: "finalize";
  /** Executable content */
  children?: ExecutableContent[];
}

/**
 * Content element - provides inline content for invoke/send.
 */
export interface ContentElement extends SCJSONElement {
  $type: "content";
  /** Expression for content */
  expr?: string;
  /** Inline text content */
  $text?: string;
}

/**
 * Param element - parameter for invoke/send.
 */
export interface ParamElement extends SCJSONElement {
  $type: "param";
  /** Parameter name */
  name: string;
  /** Expression for parameter value */
  expr?: string;
  /** Location of value in datamodel */
  location?: string;
}

/**
 * Donedata element - data to return when final state is reached.
 */
export interface DonedataElement extends SCJSONElement {
  $type: "donedata";
  /** Child elements (param or content) */
  children?: (ParamElement | ContentElement)[];
}

// =============================================================================
// Discriminated Union Types
// =============================================================================

/**
 * Executable content - actions that can be performed.
 */
export type ExecutableContent =
  | RaiseElement
  | SendElement
  | CancelElement
  | LogElement
  | AssignElement
  | ScriptElement
  | IfElement
  | ForeachElement;

/**
 * State child elements - elements that can appear inside a state.
 */
export type StateChild =
  | StateElement
  | ParallelElement
  | FinalElement
  | HistoryElement
  | InitialElement
  | TransitionElement
  | OnentryElement
  | OnexitElement
  | InvokeElement
  | DatamodelElement;

/**
 * SCXML root children - elements that can appear at the root level.
 */
export type SCXMLChild =
  | StateElement
  | ParallelElement
  | FinalElement
  | DatamodelElement
  | ScriptElement;

/**
 * All SCJSON element types as a discriminated union.
 */
export type SCJSONChild =
  | SCXMLElement
  | StateElement
  | ParallelElement
  | FinalElement
  | HistoryElement
  | InitialElement
  | TransitionElement
  | OnentryElement
  | OnexitElement
  | DatamodelElement
  | DataElement
  | AssignElement
  | ScriptElement
  | RaiseElement
  | SendElement
  | CancelElement
  | LogElement
  | IfElement
  | ElseifElement
  | ElseElement
  | ForeachElement
  | InvokeElement
  | FinalizeElement
  | ContentElement
  | ParamElement
  | DonedataElement;

/**
 * SCJSON Document - the complete exported document type.
 */
export type SCJSONDocument = SCXMLElement;
