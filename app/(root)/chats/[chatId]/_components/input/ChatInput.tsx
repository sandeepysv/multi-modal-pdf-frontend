import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction, useQuery } from "convex/react";
import { SendHorizonal } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

type Props = {
  chatId: Id<"chats">;
};

const ChatInput = ({ chatId }: Props) => {
  const [pending, setPending] = useState(false);
  const chat = useQuery(api.chat.get, {
    id: chatId,
  });
  const sendMessage = useAction(api.messages.submit);
  const [message, setMessage] = useState<string>("");
  const form = useForm();

  if (chat === undefined) return null;
  if (chat === null) return <p>Chat not found!</p>;

  const handleSubmit = async () => {
    if (message === "") return;

    const temp = message;
    setMessage("");
    setPending(true);
    await sendMessage({
      role: "user",
      content: temp,
      chatId: chat._id,
    });
    setPending(false);
  };

  const handleInputChange = (e: any) => {
    e.preventDefault();
    setMessage(e.target.value);
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <Card className="w-full p-2 rounded-lg relative">
      <div className="flex gap-2 items-end w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex gap-2 items-end w-full"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => {
                return (
                  <FormItem className="h-full w-full">
                    <FormControl>
                      <TextareaAutosize
                        onKeyDown={async (e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            await form.handleSubmit(handleSubmit)();
                          }
                        }}
                        rows={1}
                        maxRows={4}
                        {...field}
                        onChange={handleInputChange}
                        onClick={handleInputChange}
                        value={message}
                        placeholder="Type your prompt here..."
                        className="min-h-full w-full resize-none border-0 outline-0 bg-card text-card-foreground placeholder:text-muted-foreground pl-2 pb-0.5"
                      ></TextareaAutosize>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button disabled={pending} size="icon" type="submit">
              <SendHorizonal />
            </Button>
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ChatInput;
