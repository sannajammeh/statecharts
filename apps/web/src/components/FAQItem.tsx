import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
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
