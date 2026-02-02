"use client";

import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  appName: string;
}

export const Button = ({ children, className = "", appName }: ButtonProps) => {
  const baseStyles = "flex h-12 min-w-[180px] cursor-pointer items-center justify-center rounded-full border border-solid border-black/[.08] bg-transparent px-5 text-base font-medium leading-5 transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]";

  return (
    <button
      className={`${baseStyles} ${className}`.trim()}
      onClick={() => alert(`Hello from your ${appName} app!`)}
    >
      {children}
    </button>
  );
};
