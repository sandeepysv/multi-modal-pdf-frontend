"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { MessageSquarePlus } from "lucide-react";
import React from "react";

type Props = {};

const CreateChat = (props: Props) => {
  const create = useMutation(api.chats.create);

  const handleAdd = () => {
    create({});
  };

  return (
    <Button size="icon" variant="outline" onClick={handleAdd}>
      <MessageSquarePlus />
    </Button>
  );
};

export default CreateChat;
