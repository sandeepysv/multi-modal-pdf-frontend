"use client";

import ChatContainer from "@/components/shared/chat/ChatContainer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import React from "react";
import Header from "./_components/Header";
import Body from "./_components/body/Body";
import ChatInput from "./_components/input/ChatInput";

type Props = {
  params: {
    chatId: Id<"chats">;
  };
};

const ChatPage = ({ params: { chatId } }: Props) => {
  const chat = useQuery(api.chat.get, {
    id: chatId,
  });
  return chat === undefined ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader2 className="h-8 w-8" />
    </div>
  ) : chat === null ? (
    <p className="w-full h-full flex items-center justify-center">
      Chat not Found!
    </p>
  ) : (
    <ChatContainer>
      <Header imageUrl={""} name={chat.title} />
      <Body chatId={chatId} />
      <ChatInput chatId={chatId} />
      <p className="w-full text-center text-xs text-neutral-400 my-2">
        Multi Modal PDF can make errors as it is still under development.
        Consider checking your sources.
      </p>
    </ChatContainer>
  );
};

export default ChatPage;
