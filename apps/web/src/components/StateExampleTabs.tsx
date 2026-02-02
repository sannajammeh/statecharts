import { useState } from "react";
import { highlight } from "sugar-high";

const trafficLightJsonExample = `{
  "$schema": "https://statecharts.sh/schema.json",
  "version": 1,
  "id": "trafficLight",
  "initial": "red",
  "context": {},
  "states": {
    "red": {
      "entry": [],
      "exit": [],
      "on": {
        "TIMER": {
          "target": "green",
          "guard": null,
          "actions": []
        }
      }
    },
    "green": {
      "entry": [],
      "exit": [],
      "on": {
        "TIMER": {
          "target": "yellow",
          "guard": null,
          "actions": []
        }
      }
    },
    "yellow": {
      "entry": [],
      "exit": [],
      "on": {
        "TIMER": {
          "target": "red",
          "guard": null,
          "actions": []
        }
      }
    }
  }
}`;

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
  { label: "State Code", content: trafficLightJsonExample, language: "json" as const },
  { label: "State Graph", content: stateGraphExample, language: "text" as const },
] as const;

export function StateExampleTabs() {
  const [active, setActive] = useState(0);
  const activeTab = stateExampleTabs[active];
  const html = activeTab?.language === "json" ? highlight(activeTab.content) : null;

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
        {activeTab?.language === "json" ? (
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
