import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AvailableEvent {
  event: string;
  guard: string | null;
  target: string;
}

interface EventPanelProps {
  events: AvailableEvent[];
  onSend: (event: string) => void;
}

export function EventPanel({ events, onSend }: EventPanelProps): React.JSX.Element {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-3">
          <p className="text-muted-foreground text-sm">No available events</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold text-xs uppercase">Available Events</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {events.map((e) => (
            <Button
              key={`${e.event}-${e.target}`}
              type="button"
              variant="default"
              onClick={() => onSend(e.event)}
              className="font-mono"
            >
              {e.event}
              {e.guard && (
                <Badge variant="secondary" className="ml-1">
                  {e.guard}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
