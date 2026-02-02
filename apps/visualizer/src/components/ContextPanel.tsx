import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ContextPanelProps {
  context: unknown;
  currentState: string | Record<string, unknown>;
}

export function ContextPanel({ context, currentState }: ContextPanelProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-xs uppercase">Current State</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded bg-muted p-2 font-mono text-sm">
          {typeof currentState === "string" ? currentState : JSON.stringify(currentState, null, 2)}
        </div>
      </CardContent>

      <Separator />

      <CardHeader>
        <CardTitle className="font-semibold text-xs uppercase">Context</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-40">
          <pre className="rounded bg-muted p-2 font-mono text-xs">
            {JSON.stringify(context, null, 2)}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
