"use client";

import ItemList from "@/components/shared/itemlist/ItemList";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import { DMChatItem } from "./_components/DMChatItem";
import CreateChat from "./_components/CreateChat";

type Props = React.PropsWithChildren<{}>;

const ChatsLayout = ({ children }: Props) => {
  const chats = useQuery(api.chats.list);
  return (
    <>
      <ItemList title="Chats" action={<CreateChat />}>
        {chats ? (
          (chats as any).length === 0 ? (
            <p className="w-full h-full flex items-center justify-center">
              No Chats Found!
            </p>
          ) : (
            chats.map((chat) => {
              return (
                <DMChatItem key={chat._id} id={chat._id} name={chat.title} />
              );
            })
          )
        ) : (
          <Loader2 />
        )}
      </ItemList>
      {children}
    </>
  );
};

export default ChatsLayout;
