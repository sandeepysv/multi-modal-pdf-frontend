import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";
import Message from "./Message";

interface BodyProps {
  chatId: Id<"chats">;
}

const Body = ({ chatId }: BodyProps) => {
  const messages = useQuery(api.messages.retrive, {
    chatId: chatId,
  });

  return (
    <div className="flex-1 w-full flex overflow-y-scroll flex-col-reverse gap-2 p-3 no-scrollbar">
      {messages?.map((message) => (
        <Message
          key={message._id}
          name={message.role}
          content={message.content}
        />
      ))}
    </div>
  );
};

export default Body;
