"use client";

import { useState } from "react";
import { highlight } from "sugar-high";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="text-neutral-500 hover:text-neutral-300 transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? "✓" : "⧉"}
    </button>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-neutral-800">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium uppercase tracking-wide"
      >
        <span>{question}</span>
        <span className="text-neutral-500">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="pb-4 text-sm text-neutral-400">{answer}</div>}
    </div>
  );
}

const installCommands = [
  { label: "npm", command: "npm install statecharts" },
  { label: "pnpm", command: "pnpm add statecharts" },
  { label: "bun", command: "bun add statecharts" },
] as const;

const trafficLightExample = `import { chart } from "@statecharts/core"

const trafficLight = chart({
  context: {},
  initial: "red",
  states: {
    red: { on: { TIMER: "green" } },
    green: { on: { TIMER: "yellow" } },
    yellow: { on: { TIMER: "red" } },
  }
})

const instance = trafficLight.start()
instance.send("TIMER")  // → green`;

function CodeBlock({ code, filename }: { code: string; filename: string }) {
  const html = highlight(code);
  return (
    <div className="mt-6 border border-neutral-800 bg-neutral-900">
      <div className="border-b border-neutral-800 px-3 py-2 text-xs text-neutral-500">
        {filename}
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}

function InstallTabs() {
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
        <code className="text-xs text-neutral-300">{installCommands[active].command}</code>
        <CopyButton text={installCommands[active].command} />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-mono">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <h1 className="text-sm font-bold uppercase tracking-widest">Statecharts.sh</h1>

        {/* Hero Section */}
        <div className="mt-8 border border-neutral-800 p-8">
          <p className="text-center text-sm uppercase tracking-wide">
            An open state chart specification and library
          </p>

          {/* Feature Badges */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs uppercase tracking-wide">
            <div className="border border-neutral-800 py-3">Deterministic</div>
            <div className="border border-neutral-800 py-3">Framework Agnostic</div>
            <div className="border border-neutral-800 py-3">TypeScript-first</div>
          </div>

          {/* Install Commands */}
          <InstallTabs />

          {/* Links */}
          <div className="mt-4 flex items-center justify-between border border-neutral-800 px-4 py-3">
            <span className="text-xs uppercase tracking-wide">GitHub</span>
            <a
              href="https://github.com/statecharts/statecharts"
              className="flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-200"
            >
              https://github.com/statecharts/statecharts <span>→</span>
            </a>
          </div>
        </div>

        {/* Features */}
        <section className="mt-12">
          <h2 className="text-xs font-bold uppercase tracking-widest">What are Statecharts?</h2>
          <div className="mt-4 border border-neutral-800 p-6">
            <p className="text-sm text-neutral-400">
              Statecharts are a formal way to describe the behavior of reactive systems. They extend
              finite state machines with hierarchy, concurrency, and communication—making complex UI
              logic predictable and visualizable.
            </p>
            <p className="mt-4 text-sm text-neutral-400">
              Define your states, transitions, and actions declaratively. The statechart handles the
              rest: which transitions are valid, what state you&apos;re in, and what happens next.
            </p>

            <CodeBlock code={trafficLightExample} filename="traffic-light.ts" />
          </div>
        </section>

        {/* Coming Soon - Visualizer */}
        <section className="mt-12">
          <h2 className="text-xs font-bold uppercase tracking-widest">Visualizer</h2>
          <div className="mt-4 border border-neutral-800 p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium uppercase tracking-wide">State Visualizer</h3>
              <span className="border border-amber-700 bg-amber-950/50 px-2 py-1 text-xs uppercase text-amber-400">
                Coming Soon
              </span>
            </div>
            <p className="mt-4 text-sm text-neutral-400">
              Visualize your statecharts as interactive diagrams. See states, transitions, and the
              current state of your machine in real-time as your application runs.
            </p>
            <p className="mt-4 text-sm text-neutral-400">
              Debug complex state logic visually. Step through transitions, inspect context, and
              understand exactly how your machine behaves.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-xs font-bold uppercase tracking-widest">Frequently Asked Questions</h2>
          <div className="mt-4 border border-neutral-800 p-6">
            <FAQItem
              question="What are statecharts?"
              answer="Statecharts are an extension of finite state machines that add hierarchy (nested states), concurrency (parallel states), and history (remembering previous states). They were invented by David Harel in 1987 to model complex reactive systems in a visual and formal way."
            />
            <FAQItem
              question="How is this different from Redux?"
              answer="Redux is a general-purpose state container that doesn't enforce any structure on state transitions. Statecharts explicitly model which transitions are possible from each state, making impossible states impossible. This prevents bugs like triggering actions that don't make sense in the current state."
            />
            <FAQItem
              question="How is this different from XState?"
              answer="XState is a great statechart library. Statecharts.sh aims to provide a simpler, lighter-weight alternative focused on the core statechart specification. It's designed to be framework-agnostic and TypeScript-first with minimal dependencies."
            />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 flex items-center justify-between border-t border-neutral-800 pt-8 text-xs text-neutral-500">
          <span>© 2025 Statecharts.sh</span>
          <div className="flex gap-6">
            <a
              href="https://github.com/statecharts/statecharts"
              className="hover:text-neutral-300 transition-colors"
            >
              GITHUB
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
