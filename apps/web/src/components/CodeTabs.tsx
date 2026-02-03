import { useState } from "react";
import { highlight } from "sugar-high";

interface CodeTabsProps {
  coreCode: string;
  reactCode: string;
  coreFilename: string;
  reactFilename: string;
}

export function CodeTabs({ coreCode, reactCode, coreFilename, reactFilename }: CodeTabsProps) {
  const [active, setActive] = useState<"core" | "react">("core");

  const tabs = [
    { id: "core" as const, label: "Core", code: coreCode, filename: coreFilename },
    { id: "react" as const, label: "React", code: reactCode, filename: reactFilename },
  ];

  const activeTab = tabs.find((t) => t.id === active)!;
  const html = highlight(activeTab.code);

  return (
    <div className="mt-6 border border-neutral-800">
      <div className="flex border-b border-neutral-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex-1 py-2 text-xs uppercase tracking-wide transition-colors ${
              active === tab.id
                ? "bg-neutral-800 text-neutral-100"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="border-b border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-500">
        {activeTab.filename}
      </div>
      <pre className="overflow-x-auto bg-neutral-900 p-3 text-xs leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
