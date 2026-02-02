import { useState } from "react";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
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
