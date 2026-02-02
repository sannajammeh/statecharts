import { highlight } from "sugar-high";

interface CodeBlockProps {
  code: string;
  filename: string;
}

export function CodeBlock({ code, filename }: CodeBlockProps) {
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
