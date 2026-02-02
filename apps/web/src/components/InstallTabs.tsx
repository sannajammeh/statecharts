import { useState } from "react";
import { CopyButton } from "./CopyButton";

const installCommands = [
  { label: "npm", command: "npm install statecharts" },
  { label: "pnpm", command: "pnpm add statecharts" },
  { label: "bun", command: "bun add statecharts" },
] as const;

export function InstallTabs() {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-6 border border-neutral-800">
      <div className="flex border-b border-neutral-800">
        {installCommands.map((pm, i) => (
          <button
            key={pm.label}
            onClick={() => setActive(i)}
            className={`flex-1 py-2 text-xs uppercase tracking-wide transition-colors ${
              active === i
                ? "bg-neutral-800 text-neutral-100"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {pm.label}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-3">
        <code className="text-xs text-neutral-300">{installCommands[active]?.command}</code>
        <CopyButton text={installCommands[active]?.command ?? ""} />
      </div>
    </div>
  );
}
