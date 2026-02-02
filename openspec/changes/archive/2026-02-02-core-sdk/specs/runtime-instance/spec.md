## ADDED Requirements

### Requirement: chart.start() creates running instance
Calling `start()` on a Chart SHALL return a running ChartInstance.

#### Scenario: Start returns instance
- **WHEN** `const instance = myChart.start()`
- **THEN** instance has `state`, `send()`, `subscribe()`, `onTransition()`, `stop()` methods

### Requirement: start() accepts optional initial context
`start()` MAY accept a partial context object to override initial context values.

#### Scenario: Context override
- **WHEN** chart has `context: { count: 0 }` and `start({ count: 10 })` is called
- **THEN** instance starts with `context.count` equal to `10`

### Requirement: send() dispatches events
`send()` SHALL accept an event object or event type string and process it.

#### Scenario: Send event object
- **WHEN** `instance.send({ type: 'TOGGLE' })`
- **THEN** TOGGLE event is processed by current state

#### Scenario: Send event type string
- **WHEN** `instance.send('TOGGLE')`
- **THEN** equivalent to `send({ type: 'TOGGLE' })`

### Requirement: subscribe() notifies on state changes
`subscribe()` SHALL accept a listener function called on every state change, returning an unsubscribe function.

#### Scenario: Subscription receives updates
- **WHEN** `const unsub = instance.subscribe(listener)` and state changes
- **THEN** listener is called with new state snapshot

#### Scenario: Unsubscribe stops notifications
- **WHEN** `unsub()` is called
- **THEN** listener no longer receives updates

### Requirement: onTransition() notifies on events
`onTransition()` SHALL accept a listener called with the event that caused each transition.

#### Scenario: Transition listener
- **WHEN** `instance.onTransition(listener)` and event is sent
- **THEN** listener is called with the event object

### Requirement: stop() terminates instance
`stop()` SHALL cancel all timers, invocations, and subscriptions.

#### Scenario: Stop cleans up
- **WHEN** `instance.stop()` is called
- **THEN** pending delays cancelled, active invokes cancelled, subscribers notified

### Requirement: state property is always current
`instance.state` SHALL always reflect the current state snapshot.

#### Scenario: State is reactive
- **WHEN** event causes transition
- **THEN** `instance.state` immediately reflects new state
