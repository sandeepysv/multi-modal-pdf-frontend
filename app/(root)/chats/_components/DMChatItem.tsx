import { Card } from "@/components/ui/card";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import React from "react";

type Props = {
  id: Id<"chats">;
  name: string;
};

export const DMChatItem = ({ id, name }: Props) => {
  return (
    <Link href={`/chats/${id}`} className="w-full">
      <Card className="p-2 flex flex-row items-center gap-4 truncate pl-3">
        <div className="flex flex-row items-center gap-4 truncate">
          <div className="flex flex-col truncate">
            <h4 className="truncate">{name}</h4>
          </div>
        </div>
      </Card>
    </Link>
  );
};
