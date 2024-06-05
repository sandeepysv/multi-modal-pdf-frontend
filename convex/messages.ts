import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { put } from "@vercel/blob";
import { Id } from "./_generated/dataModel";

export const list = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();
  },
});

export const send = internalMutation({
  args: {
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const newMessageId = await ctx.db.insert("messages", {
      role: args.role,
      content: args.content,
      chatId: args.chatId,
    });

    return newMessageId;
  },
});

export const retrive = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("desc")
      .take(3);

    return messages;
  },
});

export const submit = action({
  args: {
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.auth.getUserIdentity();

    if (currentUser === null) {
      throw new Error("User not found");
    }

    // send user message
    await ctx.runMutation(internal.messages.send, {
      role: args.role,
      content: args.content,
      chatId: args.chatId,
    });

    const prompt_message = args.content;

    // update the chat title with prompt
    await ctx.runMutation(internal.chats.update, {
      chatId: args.chatId,
      title: prompt_message,
    });

    const response = await fetch(
      "https://multi-modal-pdf-backend.vercel.app/generate-pdf",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt_message }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    const blob = await response.blob();

    // store it in the vercel blob storage
    const { url } = await put(`pdf-${Date.now()}`, blob, {
      access: "public",
      token:
        process.env.BLOB_READ_WRITE_TOKEN ||
        "vercel_blob_rw_H3oJu6sBAcDvckiW_o6E0RWE9OStZNFgSrSvfjBcGMDyWrL",
    });

    // save the pdf blob to database as base64
    await ctx.runMutation(internal.messages.send, {
      role: "assistant",
      content: url,
      chatId: args.chatId,
    });
  },
});

export const update = internalMutation({
  args: { messageId: v.id("messages"), content: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      content: args.content,
    });
  },
});
