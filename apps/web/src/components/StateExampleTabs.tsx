import { useState } from "react";
import { highlight } from "sugar-high";

const trafficLightCodeExample = `import { chart } from "statecharts.sh"

const trafficLight = chart({
  context: {},
  initial: "red",
  states: {
    red: { on: { TIMER: "green" } },
    green: { on: { TIMER: "yellow" } },
    yellow: { on: { TIMER: "red" } },
  }
})`;

const stateGraphExample = `    ┌─────┐         ┌───────┐
    │ red │ ───────▶│ green │
    └──┬──┘ TIMER   └───┬───┘
       ▲                │
       │                │ TIMER
       │                │
       │   ┌──────┐     │
       └───┤yellow│◀────┘
           └──┬───┘ TIMER
              │
              ▼`;

const stateExampleTabs = [
  { label: "State Code", content: trafficLightCodeExample, language: "typescript" as const },
  { label: "State Graph", content: stateGraphExample, language: "text" as const },
] as const;

export function StateExampleTabs() {
  const [active, setActive] = useState(0);
  const activeTab = stateExampleTabs[active];
  const html = activeTab?.language === "typescript" ? highlight(activeTab.content) : null;

  return (
    <div className="mt-6 border border-neutral-800">
      <div className="flex border-b border-neutral-800">
        {stateExampleTabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`flex-1 py-2 text-xs uppercase tracking-wide transition-colors ${
              active === i
                ? "bg-neutral-800 text-neutral-100"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-neutral-900">
        {activeTab?.language === "typescript" ? (
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
            <code dangerouslySetInnerHTML={{ __html: html ?? "" }} />
          </pre>
        ) : (
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-neutral-300">
            {activeTab?.content}
          </pre>
        )}
      </div>
    </div>
  );
}
