import { Card } from "@/components/ui/card";
import React from "react";

type Props = {};

function ChatFallback({}: Props) {
  return (
    <Card className="hidden lg:flex h-full w-full p-2 items-center justify-center bg-secondary text-secondary-foreground">
      Select/Start a Chat to get started!
    </Card>
  );
}

export default ChatFallback;
