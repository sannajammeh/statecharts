import type { ReactNode } from "react";
import { highlight } from "sugar-high";

function Code({ children, className }: { children: string; className?: string }) {
  const language = className?.replace("language-", "") ?? "";
  const html = highlight(children);

  return (
    <code
      className={className}
      data-language={language}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Pre({ children }: { children: ReactNode }) {
  return <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4">{children}</pre>;
}

export const mdxComponents = {
  code: Code,
  pre: Pre,
};
